const express = require('express');
const { body } = require('express-validator');
const {
  getMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
  exportMeasurementsCSV,
} = require('../controllers/measurementController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect); // All measurement routes require authenticated session

router.get('/export/csv', exportMeasurementsCSV);

router.route('/')
  .get(getMeasurements)
  .post(
    validate([
      body('type').notEmpty().withMessage('Measurement type is required'),
      body('value').isNumeric().withMessage('Value must be a valid number'),
      body('unit').notEmpty().withMessage('Unit is required'),
    ]),
    createMeasurement
  );

router.route('/:id')
  .put(updateMeasurement)
  .delete(deleteMeasurement);

module.exports = router;
