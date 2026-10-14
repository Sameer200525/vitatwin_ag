const DiseaseAssessment = require('../models/DiseaseAssessment');
const HealthProfile = require('../models/HealthProfile');
const mlClient = require('../services/mlClient');

// Helper to save assessment in database
const recordAssessment = async (userId, disease, result, inputs) => {
  return await DiseaseAssessment.create({
    userId,
    disease,
    riskLevel: result.risk_level,
    probability: result.probability,
    riskPercentage: result.risk_percentage,
    confidenceTier: result.confidence_tier,
    predictedClass: result.predicted_class,
    topContributingFactors: result.top_contributing_factors,
    clinicalNote: result.clinical_note,
    limitationsDisclaimer: result.limitations_disclaimer,
    inputsSnapshot: inputs,
    modelVersion: result.model_version || '1.0.0',
  });
};

// 1. Heart Disease Prediction
const predictHeart = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.user.id });

    // Populate missing payload fields from profile
    const payload = {
      age: req.body.age || profile?.age || 45,
      sex: req.body.sex || profile?.gender || 'Male',
      cp: req.body.cp || 'typical angina',
      trestbps: req.body.trestbps || profile?.systolicBP || 120,
      chol: req.body.chol || profile?.cholesterol || 200,
      fbs: req.body.fbs || (profile?.bloodGlucose > 120 ? 'TRUE' : 'FALSE'),
      restecg: req.body.restecg || 'normal',
      thalch: req.body.thalch || 150,
      exang: req.body.exang || 'FALSE',
      oldpeak: req.body.oldpeak !== undefined ? req.body.oldpeak : 0.0,
      slope: req.body.slope || 'upsloping',
    };

    const result = await mlClient.predictHeart(payload);
    const saved = await recordAssessment(req.user.id, 'heart', result, payload);

    res.status(200).json({
      success: true,
      assessmentId: saved._id,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Diabetes Prediction
const predictDiabetes = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.user.id });

    const bmi = req.body.BMI || profile?.bmi || 25.0;
    const isHighBP = req.body.HighBP !== undefined ? req.body.HighBP : (profile?.systolicBP >= 130 ? 1 : 0);
    const isSmoker = req.body.Smoker !== undefined ? req.body.Smoker : (profile?.smokingStatus === 'current' ? 1 : 0);
    const phys = req.body.PhysActivity !== undefined ? req.body.PhysActivity : (profile?.physicalActivity !== 'sedentary' ? 1 : 0);

    const payload = {
      HighBP: isHighBP,
      HighChol: req.body.HighChol || (profile?.cholesterol >= 200 ? 1 : 0),
      CholCheck: req.body.CholCheck !== undefined ? req.body.CholCheck : 1,
      BMI: bmi,
      Smoker: isSmoker,
      Stroke: req.body.Stroke || 0,
      HeartDiseaseorAttack: req.body.HeartDiseaseorAttack || 0,
      PhysActivity: phys,
      Fruits: req.body.Fruits !== undefined ? req.body.Fruits : 1,
      Veggies: req.body.Veggies !== undefined ? req.body.Veggies : 1,
      HvyAlcoholConsump: req.body.HvyAlcoholConsump || 0,
      GenHlth: req.body.GenHlth || 2,
      MentHlth: req.body.MentHlth || 0,
      PhysHlth: req.body.PhysHlth || 0,
      DiffWalk: req.body.DiffWalk || 0,
      Sex: req.body.Sex !== undefined ? req.body.Sex : (profile?.gender === 'Male' ? 1 : 0),
      Age: req.body.Age || 6,
    };

    const result = await mlClient.predictDiabetes(payload);
    const saved = await recordAssessment(req.user.id, 'diabetes', result, payload);

    res.status(200).json({
      success: true,
      assessmentId: saved._id,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Hypertension Prediction
const predictHypertension = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.user.id });

    const payload = {
      Age: req.body.Age || profile?.age || 40,
      BMI: req.body.BMI || profile?.bmi || 24.5,
      Systolic_BP: req.body.Systolic_BP || profile?.systolicBP || 120,
      Diastolic_BP: req.body.Diastolic_BP || profile?.diastolicBP || 80,
      Heart_Rate: req.body.Heart_Rate || profile?.heartRate || 72,
      Glucose: req.body.Glucose || profile?.bloodGlucose || 95,
      Cholesterol: req.body.Cholesterol || profile?.cholesterol || 190,
      Sleep_Duration: req.body.Sleep_Duration || profile?.sleepDurationHours || 7,
      Smoking_Status: req.body.Smoking_Status || (profile?.smokingStatus === 'current' ? 'Current' : 'Never'),
      Alcohol_Intake: req.body.Alcohol_Intake ?? 0,
      Physical_Activity_Level: req.body.Physical_Activity_Level || 'Moderate',
      Family_History: req.body.Family_History || (profile?.medicalHistory?.familyHypertension ? 'Yes' : 'No'),
      Stress_Level: req.body.Stress_Level ?? 5,
      Gender: req.body.Gender || profile?.gender || 'Male',
    };

    const result = await mlClient.predictHypertension(payload);
    const saved = await recordAssessment(req.user.id, 'hypertension', result, payload);

    res.status(200).json({
      success: true,
      assessmentId: saved._id,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Stroke Prediction
const predictStroke = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.user.id });

    const payload = {
      gender: req.body.gender || profile?.gender || 'Male',
      age: req.body.age || profile?.age || 45,
      hypertension: req.body.hypertension !== undefined ? req.body.hypertension : (profile?.systolicBP >= 130 ? 1 : 0),
      heart_disease: req.body.heart_disease !== undefined ? req.body.heart_disease : (profile?.medicalHistory?.familyHeartDisease ? 1 : 0),
      ever_married: req.body.ever_married || 'Yes',
      work_type: req.body.work_type || 'Private',
      Residence_type: req.body.Residence_type || 'Urban',
      avg_glucose_level: req.body.avg_glucose_level || profile?.bloodGlucose || 95,
      bmi: req.body.bmi || profile?.bmi || 25,
      smoking_status: req.body.smoking_status || (profile?.smokingStatus === 'current' ? 'smokes' : 'never smoked'),
    };

    const result = await mlClient.predictStroke(payload);
    const saved = await recordAssessment(req.user.id, 'stroke', result, payload);

    res.status(200).json({
      success: true,
      assessmentId: saved._id,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Kidney Disease Prediction
const predictKidney = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.user.id });

    const payload = {
      age: req.body.age || profile?.age || 50,
      bp: req.body.bp || profile?.diastolicBP || 80,
      sg: req.body.sg || 1.02,
      al: req.body.al !== undefined ? req.body.al : 0,
      su: req.body.su !== undefined ? req.body.su : 0,
      rbc: req.body.rbc || 'normal',
      pc: req.body.pc || 'normal',
      pcc: req.body.pcc || 'notpresent',
      ba: req.body.ba || 'notpresent',
      bgr: req.body.bgr || profile?.bloodGlucose || 110,
      bu: req.body.bu || 35,
      sc: req.body.sc || 1.0,
      sod: req.body.sod || 138,
      pot: req.body.pot || 4.2,
      hemo: req.body.hemo || 14.5,
      pcv: req.body.pcv || 42,
      wc: req.body.wc || 7800,
      rc: req.body.rc || 5.0,
      htn: req.body.htn || (profile?.systolicBP >= 130 ? 'yes' : 'no'),
      dm: req.body.dm || (profile?.bloodGlucose >= 126 ? 'yes' : 'no'),
      cad: req.body.cad || 'no',
      appet: req.body.appet || 'good',
      pe: req.body.pe || 'no',
      ane: req.body.ane || 'no',
    };

    const result = await mlClient.predictKidney(payload);
    const saved = await recordAssessment(req.user.id, 'kidney', result, payload);

    res.status(200).json({
      success: true,
      assessmentId: saved._id,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Obesity Prediction
const predictObesity = async (req, res, next) => {
  try {
    const profile = await HealthProfile.findOne({ userId: req.user.id });

    const heightM = (req.body.Height || (profile?.heightCm ? profile.heightCm / 100 : 1.75));
    const weightKg = (req.body.Weight || profile?.weightKg || 70);

    const payload = {
      Gender: req.body.Gender || profile?.gender || 'Male',
      Age: req.body.Age || profile?.age || 25,
      Height: heightM,
      Weight: weightKg,
      family_history_with_overweight: req.body.family_history_with_overweight || 'no',
      FAVC: req.body.FAVC || 'yes',
      FCVC: req.body.FCVC || 2.0,
      NCP: req.body.NCP || 3.0,
      CAEC: req.body.CAEC || 'Sometimes',
      SMOKE: req.body.SMOKE || (profile?.smokingStatus === 'current' ? 'yes' : 'no'),
      CH2O: req.body.CH2O || 2.0,
      SCC: req.body.SCC || 'no',
      FAF: req.body.FAF !== undefined ? req.body.FAF : (profile?.physicalActivity !== 'sedentary' ? 1.5 : 0.5),
      TUE: req.body.TUE || 1.0,
      CALC: req.body.CALC || 'Sometimes',
      MTRANS: req.body.MTRANS || 'Public_Transportation',
    };

    const result = await mlClient.predictObesity(payload);
    const saved = await recordAssessment(req.user.id, 'obesity', result, payload);

    res.status(200).json({
      success: true,
      assessmentId: saved._id,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// 7. Unified Digital Twin Prediction (All 6 at once)
const predictAll = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const results = await mlClient.predictAll(payload);

    // Persist only actual predictions, never insufficient-data status objects.
    for (const [disease, assessment] of Object.entries(results)) {
      if (assessment.status === 'predicted' && assessment.result) {
        await recordAssessment(req.user.id, disease, assessment.result, payload[disease]);
      }
    }

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get assessment history for user
// @route GET /api/predictions/history
const getPredictionHistory = async (req, res, next) => {
  try {
    const { disease, limit = 50 } = req.query;
    const query = { userId: req.user.id };

    if (disease && disease !== 'all') {
      query.disease = disease;
    }

    const history = await DiseaseAssessment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  predictHeart,
  predictDiabetes,
  predictHypertension,
  predictStroke,
  predictKidney,
  predictObesity,
  predictAll,
  getPredictionHistory,
};
