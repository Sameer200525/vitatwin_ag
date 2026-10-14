const HealthProfile = require('../models/HealthProfile');
const HealthMeasurement = require('../models/HealthMeasurement');
const DiseaseAssessment = require('../models/DiseaseAssessment');
const Recommendation = require('../models/Recommendation');
const { calculateHealthSummary } = require('../services/healthScoreEngine');

// @desc Get comprehensive Digital Twin dashboard summary
// @route GET /api/summary
const getDashboardSummary = async (req, res, next) => {
  try {
    const { days = '30' } = req.query;

    const profile = await HealthProfile.findOne({ userId: req.user.id });

    // Date filter for trends
    let dateFilter = {};
    if (days !== 'all') {
      const daysNum = parseInt(days, 10) || 30;
      const since = new Date();
      since.setDate(since.getDate() - daysNum);
      dateFilter = { recordedAt: { $gte: since } };
    }

    const measurements = await HealthMeasurement.find({
      userId: req.user.id,
      ...dateFilter,
    }).sort({ recordedAt: 1 }); // chronological for charting

    const latestMeasurements = await HealthMeasurement.find({
      userId: req.user.id,
    }).sort({ recordedAt: -1 }).limit(30);

    const assessments = await DiseaseAssessment.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    const recommendations = await Recommendation.find({
      userId: req.user.id,
      isDismissed: false,
    }).sort({ createdAt: -1 }).limit(5);

    const twinSummary = calculateHealthSummary({
      profile,
      measurements: latestMeasurements,
      assessments,
    });

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      profile,
      twinSummary,
      historicalMeasurements: measurements,
      recentAssessments: assessments.slice(0, 6),
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardSummary };
