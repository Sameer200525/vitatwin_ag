const mongoose = require('mongoose');

const healthProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be positive'],
      max: [120, 'Age must be 120 or less'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    heightCm: {
      type: Number,
      required: [true, 'Height in cm is required'],
      min: [50, 'Height must be at least 50 cm'],
      max: [260, 'Height must be at most 260 cm'],
    },
    weightKg: {
      type: Number,
      required: [true, 'Weight in kg is required'],
      min: [20, 'Weight must be at least 20 kg'],
      max: [300, 'Weight must be at most 300 kg'],
    },
    bmi: {
      type: Number,
      min: 10,
      max: 80,
    },
    systolicBP: {
      type: Number,
      min: 60,
      max: 260,
      default: 120,
    },
    diastolicBP: {
      type: Number,
      min: 40,
      max: 160,
      default: 80,
    },
    bloodGlucose: {
      type: Number,
      min: 40,
      max: 500,
      default: 95,
    },
    heartRate: {
      type: Number,
      min: 35,
      max: 220,
      default: 72,
    },
    cholesterol: {
      type: Number,
      min: 80,
      max: 600,
    },
    smokingStatus: {
      type: String,
      enum: ['never', 'former', 'current'],
      default: 'never',
    },
    physicalActivity: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      default: 'moderate',
    },
    sleepDurationHours: {
      type: Number,
      min: 2,
      max: 18,
      default: 7,
    },
    dietaryHabits: {
      type: String,
      enum: ['balanced', 'vegetarian', 'vegan', 'keto', 'mediterranean', 'high_sugar_fast_food', 'other'],
      default: 'balanced',
    },
    medicalHistory: {
      familyHeartDisease: { type: Boolean, default: false },
      familyDiabetes: { type: Boolean, default: false },
      familyHypertension: { type: Boolean, default: false },
      diagnosedConditions: [{ type: String }],
      allergies: [{ type: String }],
      currentMedications: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

// Automatically calculate BMI before saving
healthProfileSchema.pre('save', function (next) {
  if (this.heightCm && this.weightKg) {
    const heightInMeters = this.heightCm / 100;
    this.bmi = parseFloat((this.weightKg / (heightInMeters * heightInMeters)).toFixed(1));
  }
  next();
});

module.exports = mongoose.model('HealthProfile', healthProfileSchema);
