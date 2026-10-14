const mongoose = require('mongoose');

const healthMeasurementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Measurement type is required'],
      enum: [
        'blood_pressure',
        'heart_rate',
        'glucose',
        'weight',
        'height',
        'bmi',
        'sleep_duration',
        'activity',
        'cholesterol',
        'steps',
        'smoking',
        'alcohol_intake',
        'water_intake',
        'body_temperature',
        'oxygen_saturation',
        'stress_level',
        'mood',
        'calories_burned',
      ],
      index: true,
    },
    value: {
      type: Number,
      required: [true, 'Primary measurement value is required'],
    },
    secondaryValue: {
      type: Number, // e.g. diastolic blood pressure when type is 'blood_pressure'
    },
    unit: {
      type: String,
      required: [true, 'Measurement unit is required'],
    },
    notes: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

healthMeasurementSchema.index({ userId: 1, recordedAt: -1 });
healthMeasurementSchema.index({ userId: 1, type: 1, recordedAt: -1 });

module.exports = mongoose.model('HealthMeasurement', healthMeasurementSchema);
