/**
 * VitaTwin Explainable Longitudinal Health Trajectory Forecasting Engine
 * Methodology: Ordinary Least Squares (OLS) Linear Trend with 95% Confidence Band
 * Strict requirement: At least 3 historical data points.
 */

function calculateForecast({ measurements = [], horizonDays = 30, metricName = 'metric' }) {
  // Sort measurements chronologically (oldest to newest)
  const sorted = [...measurements].sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));

  if (sorted.length < 3) {
    return {
      sufficientData: false,
      message: `Insufficient longitudinal history for ${metricName}. At least 3 historical measurements recorded on different days are required to generate an explainable trajectory forecast.`,
      historicalPoints: sorted.map((m) => ({
        date: m.recordedAt,
        value: m.value,
        secondaryValue: m.secondaryValue,
      })),
      forecastPoints: [],
      trendDirection: 'insufficient_data',
      methodology: 'Linear Trajectory Regression with 95% Confidence Interval',
    };
  }

  // Convert dates to day offset from the earliest point
  const t0 = new Date(sorted[0].recordedAt).getTime();
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const points = sorted.map((m) => {
    const days = (new Date(m.recordedAt).getTime() - t0) / MS_PER_DAY;
    return { x: days, y: m.value, date: m.recordedAt };
  });

  const n = points.length;
  const sumX = points.reduce((acc, p) => acc + p.x, 0);
  const sumY = points.reduce((acc, p) => acc + p.y, 0);
  const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

  const meanX = sumX / n;
  const meanY = sumY / n;

  const denominator = sumXX - n * meanX * meanX;
  const slope = denominator === 0 ? 0 : (sumXY - n * meanX * meanY) / denominator;
  const intercept = meanY - slope * meanX;

  // Compute residual standard error
  let sumSquaredResiduals = 0;
  for (const p of points) {
    const yHat = slope * p.x + intercept;
    sumSquaredResiduals += Math.pow(p.y - yHat, 2);
  }
  const degreesOfFreedom = Math.max(1, n - 2);
  const standardError = Math.sqrt(sumSquaredResiduals / degreesOfFreedom);

  // Trend direction
  let trendDirection = 'stable';
  if (Math.abs(slope) > 0.05) {
    trendDirection = slope > 0 ? 'increasing' : 'decreasing';
  }

  // Generate future forecast points at +7, +14, +21, +30 days
  const latestDate = new Date(sorted[sorted.length - 1].recordedAt);
  const latestDays = (latestDate.getTime() - t0) / MS_PER_DAY;

  const forecastIntervals = [7, 14, 21, 30].filter((d) => d <= horizonDays);
  const forecastPoints = forecastIntervals.map((daysAhead) => {
    const targetDays = latestDays + daysAhead;
    const predictedValue = parseFloat((slope * targetDays + intercept).toFixed(1));

    // Confidence interval widens with distance from meanX
    const leverage = 1 / n + Math.pow(targetDays - meanX, 2) / Math.max(1, sumXX - n * meanX * meanX);
    const marginOfError = Math.max(1.5, 1.96 * standardError * Math.sqrt(1 + leverage));

    const targetDate = new Date(latestDate.getTime() + daysAhead * MS_PER_DAY);

    return {
      targetDate: targetDate.toISOString(),
      daysAhead,
      predictedValue,
      lowerBound: parseFloat(Math.max(0, predictedValue - marginOfError).toFixed(1)),
      upperBound: parseFloat((predictedValue + marginOfError).toFixed(1)),
    };
  });

  return {
    sufficientData: true,
    historicalCount: n,
    historicalPoints: sorted.map((m) => ({
      date: m.recordedAt,
      value: m.value,
      secondaryValue: m.secondaryValue,
      unit: m.unit,
    })),
    forecastPoints,
    trendDirection,
    slopePerDay: parseFloat(slope.toFixed(4)),
    residualStandardError: parseFloat(standardError.toFixed(2)),
    methodology: 'Ordinary Least Squares (OLS) with 95% Dynamic Prediction Interval',
    horizonDays,
  };
}

module.exports = { calculateForecast };
