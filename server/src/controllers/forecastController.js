const HealthMeasurement = require('../models/HealthMeasurement');
const Forecast = require('../models/Forecast');
const { calculateForecast } = require('../services/forecastEngine');

// @desc Generate or fetch longitudinal trend forecast for a specific metric
// @route GET /api/forecast/:metric
const getForecast = async (req, res, next) => {
  try {
    const { metric } = req.params;
    const { horizonDays = 30 } = req.query;

    const validMetrics = ['blood_pressure', 'glucose', 'weight', 'heart_rate', 'bmi', 'sleep_duration'];
    if (!validMetrics.includes(metric)) {
      return res.status(400).json({
        success: false,
        message: `Invalid metric '${metric}'. Valid metrics: ${validMetrics.join(', ')}`,
      });
    }

    const measurements = await HealthMeasurement.find({
      userId: req.user.id,
      type: metric,
    }).sort({ recordedAt: 1 });

    const result = calculateForecast({
      measurements,
      horizonDays: parseInt(horizonDays, 10),
      metricName: metric.replace('_', ' '),
    });

    // Save forecast snapshot if sufficient data was found
    if (result.sufficientData) {
      await Forecast.create({
        userId: req.user.id,
        metric,
        historicalCount: result.historicalCount,
        horizonDays: result.horizonDays,
        trendDirection: result.trendDirection,
        methodology: result.methodology,
        points: result.forecastPoints,
        sufficientData: true,
      });
    }

    res.status(200).json({
      success: true,
      forecast: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getForecast };
