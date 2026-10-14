const express = require('express');
const {
  predictHeart,
  predictDiabetes,
  predictHypertension,
  predictStroke,
  predictKidney,
  predictObesity,
  predictAll,
  getPredictionHistory,
} = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/heart', predictHeart);
router.post('/diabetes', predictDiabetes);
router.post('/hypertension', predictHypertension);
router.post('/stroke', predictStroke);
router.post('/kidney', predictKidney);
router.post('/obesity', predictObesity);
router.post('/all', predictAll);
router.get('/history', getPredictionHistory);

module.exports = router;
