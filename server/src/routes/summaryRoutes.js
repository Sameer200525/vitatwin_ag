const express = require('express');
const { getDashboardSummary } = require('../controllers/summaryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getDashboardSummary);

module.exports = router;
