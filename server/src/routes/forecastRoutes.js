const express = require('express');
const { getForecast } = require('../controllers/forecastController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/:metric', getForecast);

module.exports = router;
