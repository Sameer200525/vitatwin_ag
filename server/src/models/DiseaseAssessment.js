const mongoose = require('mongoose');

const diseaseAssessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    disease: {
      type: String,
      required: true,
      enum: [
        'heart',
        'diabetes',
        'hypertension',
        'kidney',
        'stroke',
        'obesity',
      ],
      index: true,
    },
    riskLevel: {
      type: String,
      required: true,
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    riskPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    confidenceTier: {
      type: String,
      default: 'Moderate Confidence',
    },
    predictedClass: {
      type: mongoose.Schema.Types.Mixed,
    },
    topContributingFactors: [{ type: String }],
    clinicalNote: { type: String },
    limitationsDisclaimer: { type: String },
    inputsSnapshot: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    modelVersion: {
      type: String,
      default: '1.0.0',
    },
  },
  {
    timestamps: true,
  }
);

diseaseAssessmentSchema.index({ userId: 1, disease: 1, createdAt: -1 });

module.exports = mongoose.model('DiseaseAssessment', diseaseAssessmentSchema);
