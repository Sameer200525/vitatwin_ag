const mongoose = require('mongoose');

const forecastPointSchema = new mongoose.Schema(
  {
    targetDate: { type: Date, required: true },
    predictedValue: { type: Number, required: true },
    lowerBound: { type: Number, required: true },
    upperBound: { type: Number, required: true },
  },
  { _id: false }
);

const forecastSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    metric: {
      type: String,
      required: true,
      enum: ['blood_pressure', 'glucose', 'weight', 'heart_rate', 'bmi', 'sleep_duration'],
    },
    historicalCount: {
      type: Number,
      required: true,
    },
    horizonDays: {
      type: Number,
      default: 30,
    },
    trendDirection: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable', 'fluctuating'],
      default: 'stable',
    },
    methodology: {
      type: String,
      default: 'Ordinary Least Squares with 95% Confidence Band',
    },
    points: [forecastPointSchema],
    sufficientData: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

forecastSchema.index({ userId: 1, metric: 1, createdAt: -1 });

module.exports = mongoose.model('Forecast', forecastSchema);
