const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'physical_activity',
        'nutrition',
        'sleep',
        'weight_management',
        'routine_monitoring',
        'medical_consultation',
      ],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rationale: {
      type: String,
      required: true,
    },
    triggeredBy: {
      type: String,
      required: true, // e.g., "Systolic BP >= 135 mmHg" or "BMI >= 28"
    },
    priority: {
      type: String,
      enum: ['info', 'moderate', 'high', 'urgent'],
      default: 'moderate',
    },
    isDismissed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

recommendationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
