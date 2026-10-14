const express = require('express');
const { getRecommendations, refreshRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getRecommendations);
router.post('/generate', refreshRecommendations);

module.exports = router;
