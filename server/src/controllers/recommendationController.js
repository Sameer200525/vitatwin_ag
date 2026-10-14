const Recommendation = require('../models/Recommendation');
const HealthProfile = require('../models/HealthProfile');
const HealthMeasurement = require('../models/HealthMeasurement');
const DiseaseAssessment = require('../models/DiseaseAssessment');
const { generateRecommendations } = require('../services/ruleEngine');

// @desc Get active recommendations for user
// @route GET /api/recommendations
const getRecommendations = async (req, res, next) => {
  try {
    let recs = await Recommendation.find({
      userId: req.user.id,
      isDismissed: false,
    }).sort({ createdAt: -1 });

    // If no active recommendations exist, generate fresh ones from profile
    if (recs.length === 0) {
      const profile = await HealthProfile.findOne({ userId: req.user.id });
      const measurements = await HealthMeasurement.find({ userId: req.user.id }).sort({ recordedAt: -1 }).limit(20);
      const assessments = await DiseaseAssessment.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);

      const generated = generateRecommendations({ profile, measurements, assessments });

      if (generated.length > 0) {
        const docs = generated.map((r) => ({
          ...r,
          userId: req.user.id,
        }));
        recs = await Recommendation.insertMany(docs);
      }
    }

    res.status(200).json({
      success: true,
      count: recs.length,
      recommendations: recs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Re-generate recommendations based on latest twin data
// @route POST /api/recommendations/generate
const refreshRecommendations = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.user.id });
    const measurements = await HealthMeasurement.find({ userId: req.user.id }).sort({ recordedAt: -1 }).limit(30);
    const assessments = await DiseaseAssessment.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(15);

    const generated = generateRecommendations({ profile, measurements, assessments });

    // Dismiss existing and insert fresh
    await Recommendation.updateMany({ userId: req.user.id }, { isDismissed: true });

    const docs = generated.map((r) => ({
      ...r,
      userId: req.user.id,
    }));
    const saved = await Recommendation.insertMany(docs);

    res.status(200).json({
      success: true,
      message: 'Educational health recommendations refreshed.',
      count: saved.length,
      recommendations: saved,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
  refreshRecommendations,
};
