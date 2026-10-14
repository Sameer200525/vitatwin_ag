/**
 * VitaTwin Explainable Digital Health Twin Summary & Completeness Engine
 * Calculates data completeness, vital status categorisation, and transparent pillar ratings.
 */

function calculateHealthSummary({ profile, measurements = [], assessments = [] }) {
  // 1. Data Completeness Calculation
  const keyFields = [
    { name: 'Age & Demographics', present: Boolean(profile?.age && profile?.gender) },
    { name: 'Height & Weight', present: Boolean(profile?.heightCm && profile?.weightKg) },
    { name: 'Blood Pressure', present: Boolean(profile?.systolicBP || measurements.some((m) => m.type === 'blood_pressure')) },
    { name: 'Blood Glucose', present: Boolean(profile?.bloodGlucose || measurements.some((m) => m.type === 'glucose')) },
    { name: 'Heart Rate', present: Boolean(profile?.heartRate || measurements.some((m) => m.type === 'heart_rate')) },
    { name: 'Cholesterol Profile', present: Boolean(profile?.cholesterol || measurements.some((m) => m.type === 'cholesterol')) },
    { name: 'Sleep Log', present: Boolean(profile?.sleepDurationHours || measurements.some((m) => m.type === 'sleep_duration')) },
    { name: 'Physical Activity', present: Boolean(profile?.physicalActivity || measurements.some((m) => m.type === 'activity')) },
    { name: 'Smoking & Lifestyle', present: Boolean(profile?.smokingStatus) },
    { name: 'Dietary Habits', present: Boolean(profile?.dietaryHabits) },
  ];

  const presentCount = keyFields.filter((f) => f.present).length;
  const completenessPercentage = Math.round((presentCount / keyFields.length) * 100);

  // 2. Latest Values
  const getLatest = (type, fallback) => {
    const latest = [...measurements]
      .filter((m) => m.type === type)
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];

    return latest ? latest.value : fallback;
  };

  const latestBloodPressure = [...measurements]
    .filter((m) => m.type === 'blood_pressure')
    .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];

  const systolic = latestBloodPressure ? latestBloodPressure.value : profile?.systolicBP || 120;
  const diastolic = latestBloodPressure ? latestBloodPressure.secondaryValue ?? profile?.diastolicBP ?? 80 : profile?.diastolicBP || 80;
  const glucose = getLatest('glucose', profile?.bloodGlucose || 95);
  const heartRate = getLatest('heart_rate', profile?.heartRate || 72);
  const bmi = getLatest('bmi', profile?.bmi || 23.5);
  const sleep = getLatest('sleep_duration', profile?.sleepDurationHours || 7);
  const activity = getLatest('activity', profile?.physicalActivity || 'moderate');

  // 3. Dimensional Pillar Scores (Transparent, bounded 0-100 scales based on clinical guidelines)
  // Cardiovascular Pillar
  let cardioScore = 95;
  if (systolic >= 140 || diastolic >= 90) cardioScore = 55;
  else if (systolic >= 130 || diastolic >= 85) cardioScore = 70;
  else if (systolic >= 120 || diastolic >= 80) cardioScore = 85;

  // Metabolic Pillar
  let metabolicScore = 95;
  if (glucose >= 126) metabolicScore = 50;
  else if (glucose >= 100) metabolicScore = 72;

  // Body Composition Pillar
  let bodyCompScore = 95;
  if (bmi >= 30) bodyCompScore = 55;
  else if (bmi >= 25) bodyCompScore = 75;
  else if (bmi < 18.5) bodyCompScore = 70;

  // Sleep & Recovery Pillar
  let sleepScore = 95;
  if (sleep < 6 || sleep > 9.5) sleepScore = 65;
  else if (sleep < 7) sleepScore = 80;

  // Activity Pillar
  let activityScore = 90;
  if (activity === 'sedentary') activityScore = 55;
  else if (activity === 'light') activityScore = 70;
  else if (activity === 'very_active') activityScore = 100;

  // Overall Health Readiness Index (Weighted average of transparent pillars)
  const healthReadinessIndex = Math.round(
    cardioScore * 0.25 +
    metabolicScore * 0.25 +
    bodyCompScore * 0.2 +
    sleepScore * 0.15 +
    activityScore * 0.15
  );

  // Status Badge
  let readinessTier = 'Optimal';
  if (healthReadinessIndex < 65) readinessTier = 'Attention Recommended';
  else if (healthReadinessIndex < 80) readinessTier = 'Moderate / Actionable';

  // Latest Disease Assessments summary
  const latestAssessmentsMap = {};
  assessments.forEach((a) => {
    if (!latestAssessmentsMap[a.disease]) {
      latestAssessmentsMap[a.disease] = {
        disease: a.disease,
        riskLevel: a.riskLevel,
        probability: a.probability,
        riskPercentage: a.riskPercentage,
        assessedAt: a.createdAt,
      };
    }
  });

  return {
    completenessPercentage,
    completenessBreakdown: keyFields,
    healthReadinessIndex,
    readinessTier,
    pillars: [
      { name: 'Cardiovascular', score: cardioScore, status: cardioScore >= 80 ? 'Good' : 'Needs Focus' },
      { name: 'Metabolic', score: metabolicScore, status: metabolicScore >= 80 ? 'Good' : 'Needs Focus' },
      { name: 'Body Composition', score: bodyCompScore, status: bodyCompScore >= 80 ? 'Good' : 'Needs Focus' },
      { name: 'Sleep & Rest', score: sleepScore, status: sleepScore >= 80 ? 'Good' : 'Needs Focus' },
      { name: 'Physical Fitness', score: activityScore, status: activityScore >= 80 ? 'Good' : 'Needs Focus' },
    ],
    latestVitals: {
      bloodPressure: `${systolic}/${diastolic} mmHg`,
      glucose: `${glucose} mg/dL`,
      heartRate: `${heartRate} bpm`,
      bmi: `${bmi} kg/m²`,
      sleep: `${sleep} hrs/night`,
    },
    latestAssessments: latestAssessmentsMap,
    evaluatedAt: new Date().toISOString(),
  };
}

module.exports = { calculateHealthSummary };
