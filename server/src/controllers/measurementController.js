const HealthMeasurement = require('../models/HealthMeasurement');

// @desc Get user measurements with filters
// @route GET /api/measurements
const getMeasurements = async (req, res, next) => {
  try {
    const { type, startDate, endDate, limit = 100, page = 1 } = req.query;

    const query = { userId: req.user.id };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (startDate || endDate) {
      query.recordedAt = {};
      if (startDate) query.recordedAt.$gte = new Date(startDate);
      if (endDate) query.recordedAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const measurements = await HealthMeasurement.find(query)
      .sort({ recordedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await HealthMeasurement.countDocuments(query);

    res.status(200).json({
      success: true,
      count: measurements.length,
      total,
      measurements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add a new health measurement
// @route POST /api/measurements
const createMeasurement = async (req, res, next) => {
  try {
    const { type, value, secondaryValue, unit, notes, recordedAt } = req.body;

    const measurement = await HealthMeasurement.create({
      userId: req.user.id,
      type,
      value: parseFloat(value),
      secondaryValue: secondaryValue !== undefined ? parseFloat(secondaryValue) : undefined,
      unit,
      notes,
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Measurement recorded successfully.',
      measurement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update measurement
// @route PUT /api/measurements/:id
const updateMeasurement = async (req, res, next) => {
  try {
    const measurement = await HealthMeasurement.findOne({
      _id: req.params.id,
      userId: req.user.id, // Enforce strict ownership
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement not found or unauthorized access.',
      });
    }

    const { type, value, secondaryValue, unit, notes, recordedAt } = req.body;

    if (type) measurement.type = type;
    if (value !== undefined) measurement.value = parseFloat(value);
    if (secondaryValue !== undefined) measurement.secondaryValue = parseFloat(secondaryValue);
    if (unit) measurement.unit = unit;
    if (notes !== undefined) measurement.notes = notes;
    if (recordedAt) measurement.recordedAt = new Date(recordedAt);

    await measurement.save();

    res.status(200).json({
      success: true,
      message: 'Measurement updated successfully.',
      measurement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete measurement
// @route DELETE /api/measurements/:id
const deleteMeasurement = async (req, res, next) => {
  try {
    const measurement = await HealthMeasurement.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // Enforce strict ownership
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement not found or unauthorized access.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Measurement successfully deleted.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Export user measurements as CSV
// @route GET /api/measurements/export/csv
const exportMeasurementsCSV = async (req, res, next) => {
  try {
    const measurements = await HealthMeasurement.find({ userId: req.user.id }).sort({
      recordedAt: -1,
    });

    const headers = 'ID,Type,Primary Value,Secondary Value,Unit,Recorded At,Notes\n';
    const rows = measurements.map((m) => {
      const notes = (m.notes || '').replace(/"/g, '""');
      return `"${m._id}","${m.type}","${m.value}","${m.secondaryValue || ''}","${m.unit}","${m.recordedAt.toISOString()}","${notes}"`;
    });

    const csvContent = headers + rows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=vitatwin_measurements_${req.user.id}_${Date.now()}.csv`
    );

    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
  exportMeasurementsCSV,
};
