const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const HealthMeasurement = require('../src/models/HealthMeasurement');
const HealthProfile = require('../src/models/HealthProfile');

const TEST_MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vitatwin_test';

beforeAll(async () => {
  await mongoose.connect(TEST_MONGO_URI);
});

afterAll(async () => {
  // Clean up collections created during test
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe('VitaTwin Backend API Test Suite', () => {
  let userToken = '';
  let userId = '';
  let testMeasurementId = '';

  const testUser = {
    name: 'Sarah Connor',
    email: `sarah_${Date.now()}@test.com`,
    password: 'Password123!',
  };

  test('1. Health Check Endpoint', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  test('2. User Registration and Auto-Profile Generation', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email.toLowerCase());

    userToken = res.body.token;
    userId = res.body.user.id;

    // Check that default profile was generated
    const profile = await HealthProfile.findOne({ userId });
    expect(profile).not.toBeNull();
    expect(profile.bmi).toBeDefined();
  });

  test('3. User Login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test('4. Protected Route Rejection without Token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  test('5. Protected Route Access with Token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe(testUser.name);
  });

  test('6. Health Profile Update & BMI Auto-Calculation', async () => {
    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        age: 35,
        heightCm: 180,
        weightKg: 81,
        systolicBP: 128,
        diastolicBP: 82,
        smokingStatus: 'never',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.profile.age).toBe(35);
    expect(res.body.profile.bmi).toBe(25.0); // 81 / (1.8 * 1.8) = 25.0
  });

  test('7. Measurement Creation (CRUD - Create)', async () => {
    const res = await request(app)
      .post('/api/measurements')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        type: 'blood_pressure',
        value: 124,
        secondaryValue: 80,
        unit: 'mmHg',
        notes: 'Resting morning reading',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.measurement.value).toBe(124);
    testMeasurementId = res.body.measurement._id;
  });

  test('8. Measurement Retrieval (CRUD - Read with filter)', async () => {
    const res = await request(app)
      .get('/api/measurements?type=blood_pressure')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.measurements.length).toBeGreaterThanOrEqual(1);
  });

  test('9. Measurement Update (CRUD - Update)', async () => {
    const res = await request(app)
      .put(`/api/measurements/${testMeasurementId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        value: 122,
        notes: 'Updated calibration check',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.measurement.value).toBe(122);
  });

  test('10. CSV Export Permissions & Ownership', async () => {
    const res = await request(app)
      .get('/api/measurements/export/csv')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text).toContain('ID,Type,Primary Value');
    expect(res.text).toContain('blood_pressure');
  });

  test('11. Measurement Deletion (CRUD - Delete)', async () => {
    const res = await request(app)
      .delete(`/api/measurements/${testMeasurementId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('12. User Data Isolation: Second User cannot access First User measurement', async () => {
    // Register second user
    const user2Res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Connor',
        email: `john_${Date.now()}@test.com`,
        password: 'Password123!',
      });
    const user2Token = user2Res.body.token;

    // Create measurement for User 1
    const mRes = await request(app)
      .post('/api/measurements')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        type: 'glucose',
        value: 95,
        unit: 'mg/dL',
      });
    const mId = mRes.body.measurement._id;

    // User 2 tries to delete User 1's measurement
    const delRes = await request(app)
      .delete(`/api/measurements/${mId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(delRes.statusCode).toBe(404); // Forbidden / Not found for User 2
  });

  test('13. Digital Twin Dashboard Summary Endpoint', async () => {
    await HealthMeasurement.create({
      userId,
      type: 'blood_pressure',
      value: 120,
      secondaryValue: 80,
      unit: 'mmHg',
      recordedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    await HealthMeasurement.create({
      userId,
      type: 'blood_pressure',
      value: 140,
      secondaryValue: 90,
      unit: 'mmHg',
      recordedAt: new Date(),
    });

    const res = await request(app)
      .get('/api/summary?days=30')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.twinSummary).toBeDefined();
    expect(res.body.twinSummary.completenessPercentage).toBeGreaterThan(0);
    expect(res.body.twinSummary.pillars.length).toBe(5);
    expect(res.body.twinSummary.latestVitals.bloodPressure).toBe('140/90 mmHg');
  });

  test('14. Rule-Based Recommendations Generation', async () => {
    const res = await request(app)
      .get('/api/recommendations')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.recommendations.length).toBeGreaterThan(0);
    expect(res.body.recommendations[0].triggeredBy).toBeDefined();
  });
});
