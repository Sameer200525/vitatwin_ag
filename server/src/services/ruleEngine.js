/**
 * VitaTwin Transparent Rule-Based Health Recommendation Engine
 * Educational and lifestyle guidance.
 * Note: Never prescribes medicines, diagnoses diseases, or replaces clinical care.
 */

function generateRecommendations({ profile, measurements = [], assessments = [] }) {
  const recommendations = [];

  // Extract latest measurements or profile defaults
  const latestBP = measurements.find((m) => m.type === 'blood_pressure');
  const systolic = latestBP ? latestBP.value : profile?.systolicBP || 120;
  const diastolic = latestBP ? latestBP.secondaryValue || 80 : profile?.diastolicBP || 80;

  const latestGlucose = measurements.find((m) => m.type === 'glucose');
  const glucose = latestGlucose ? latestGlucose.value : profile?.bloodGlucose || 95;

  const bmi = profile?.bmi || 24;
  const sleepHours = profile?.sleepDurationHours || 7;
  const activity = profile?.physicalActivity || 'moderate';
  const smoking = profile?.smokingStatus || 'never';

  // 1. Blood Pressure & Cardiovascular Monitoring
  if (systolic >= 140 || diastolic >= 90) {
    recommendations.push({
      category: 'medical_consultation',
      title: 'Schedule Primary Care Blood Pressure Evaluation',
      message:
        'Your recorded blood pressure readings are in the Stage 2 hypertension range. We advise consulting a licensed physician for a comprehensive clinical assessment.',
      rationale:
        'Sustained blood pressure exceeding 140/90 mmHg increases long-term vascular and cardiac stress.',
      triggeredBy: `Blood pressure measurement of ${systolic}/${diastolic} mmHg`,
      priority: 'urgent',
    });
    recommendations.push({
      category: 'routine_monitoring',
      title: 'Maintain a 14-Day Morning/Evening BP Log',
      message:
        'Record your resting blood pressure twice daily (morning before breakfast and evening) using a calibrated upper-arm cuff to bring to your healthcare provider.',
      rationale:
        'Consistent ambulatory measurements eliminate transient stress spikes and provide clinicians with actionable data.',
      triggeredBy: `Elevated systolic BP (${systolic} mmHg)`,
      priority: 'high',
    });
  } else if (systolic >= 125 || diastolic >= 82) {
    recommendations.push({
      category: 'routine_monitoring',
      title: 'Weekly Blood Pressure Tracking',
      message:
        'Your blood pressure is slightly elevated above optimal limits (<120/80 mmHg). Track measurements once weekly under quiet resting conditions.',
      rationale:
        'Early detection of upward vascular pressure trends enables timely lifestyle adjustments.',
      triggeredBy: `Borderline BP reading of ${systolic}/${diastolic} mmHg`,
      priority: 'moderate',
    });
  }

  // 2. Nutrition: Sodium & Dietary Fiber
  if (systolic >= 125) {
    recommendations.push({
      category: 'nutrition',
      title: 'Adopt the Sodium-Reduced DASH Dietary Pattern',
      message:
        'Focus on whole foods, leafy vegetables, potassium-rich fruits (bananas, avocados), and target dietary sodium under 2,000 mg/day.',
      rationale:
        'Clinical trials establish that reducing excess dietary sodium while increasing dietary potassium directly softens arterial tone.',
      triggeredBy: `Elevated systolic blood pressure (${systolic} mmHg)`,
      priority: 'moderate',
    });
  }

  // 3. Glucose & Metabolic Management
  if (glucose >= 126) {
    recommendations.push({
      category: 'medical_consultation',
      title: 'Discuss Fasting Glucose and HbA1c with Your Doctor',
      message:
        'Your blood glucose measurement is elevated. A certified physician can order an HbA1c test to assess your 3-month glycaemic control.',
      rationale:
        'Fasting glucose ≥126 mg/dL or random readings >140 mg/dL warrant laboratory confirmation.',
      triggeredBy: `Blood glucose reading of ${glucose} mg/dL`,
      priority: 'urgent',
    });
    recommendations.push({
      category: 'nutrition',
      title: 'Prioritise Low-Glycaemic Index Carbohydrates',
      message:
        'Replace refined sugars, white bread, and sweetened drinks with legumes, oats, quinoa, and fiber-rich vegetables.',
      rationale:
        'High-fiber foods slow carbohydrate absorption in the gut, dampening post-meal glucose surges.',
      triggeredBy: `Elevated glucose biomarker (${glucose} mg/dL)`,
      priority: 'high',
    });
  } else if (glucose >= 100) {
    recommendations.push({
      category: 'nutrition',
      title: 'Mindful Sugar Intake & Post-Meal Walks',
      message:
        'Engage in a 10-15 minute gentle walk within 30 minutes following meals to promote muscle glucose uptake without insulin surges.',
      rationale:
        'Light postprandial movement activates GLUT4 transporters in skeletal muscle independently of insulin.',
      triggeredBy: `Pre-diabetes borderline glucose (${glucose} mg/dL)`,
      priority: 'moderate',
    });
  }

  // 4. Weight Management & Body Composition
  if (bmi >= 30) {
    recommendations.push({
      category: 'weight_management',
      title: 'Sustainable Caloric Balance & Portion Mindfulness',
      message:
        'Aim for a gradual, sustainable weight reduction target of 0.5–1.0 kg (1–2 lbs) per week through wholesome nutrition and daily active movement.',
      rationale:
        'Clinical research confirms that even a 5% reduction in total body mass significantly improves cardiovascular lipids, insulin sensitivity, and liver health.',
      triggeredBy: `Body Mass Index (BMI: ${bmi}) in Obesity category`,
      priority: 'high',
    });
  } else if (bmi >= 25) {
    recommendations.push({
      category: 'weight_management',
      title: 'Body Composition Maintenance',
      message:
        'Incorporate resistance exercises twice weekly to preserve lean muscle mass while keeping body fat in check.',
      rationale:
        'Preserving skeletal muscle enhances basal metabolic rate and improves systemic glucose disposal.',
      triggeredBy: `BMI (${bmi}) in Overweight threshold`,
      priority: 'moderate',
    });
  }

  // 5. Physical Activity
  if (activity === 'sedentary' || activity === 'light') {
    recommendations.push({
      category: 'physical_activity',
      title: 'Gradually Build to 150 Minutes of Moderate Aerobic Activity',
      message:
        'Start with brisk 20-minute daily walks, stair climbing, or cycling. Accumulating 150 minutes per week improves cardiac output and autonomic balance.',
      rationale:
        'Regular moderate exercise lowers resting heart rate, enhances nitric oxide bioavailability, and reduces visceral adipose tissue.',
      triggeredBy: `Activity profile logged as ${activity}`,
      priority: 'high',
    });
  } else {
    recommendations.push({
      category: 'physical_activity',
      title: 'Maintain Consistent Training Variety',
      message:
        'Continue your active routine! Consider alternating between cardiovascular endurance sessions and flexibility or core mobility work.',
      rationale:
        'Varied physical training prevents repetitive stress and supports joint longevity.',
      triggeredBy: `Active lifestyle rating (${activity})`,
      priority: 'info',
    });
  }

  // 6. Sleep Duration & Recovery
  if (sleepHours < 6) {
    recommendations.push({
      category: 'sleep',
      title: 'Target 7 to 8 Hours of Restful Sleep',
      message:
        'Establish a consistent bedtime routine, eliminate electronic screens 45 minutes before sleeping, and keep your bedroom cool and dark.',
      rationale:
        'Chronic sleep deprivation (<6 hours) elevates evening cortisol, stimulates appetite hormones (ghrelin), and impairs vascular endothelial recovery.',
      triggeredBy: `Sleep duration logged as ${sleepHours} hours/night`,
      priority: 'high',
    });
  } else if (sleepHours > 9.5) {
    recommendations.push({
      category: 'sleep',
      title: 'Evaluate Sleep Quality and Daytime Energy',
      message:
        'If you sleep over 9.5 hours but still feel unrefreshed, monitor whether sleep apnea or circadian misalignment might be contributing factors.',
      rationale:
        'Prolonged sleep without restoration can be an indicator of fragmented sleep architecture.',
      triggeredBy: `Logged sleep duration of ${sleepHours} hours`,
      priority: 'moderate',
    });
  }

  // 7. Tobacco Cessation
  if (smoking === 'current') {
    recommendations.push({
      category: 'medical_consultation',
      title: 'Explore Evidence-Based Tobacco Cessation Programs',
      message:
        'Discuss smoking cessation strategies with your healthcare provider. Nicotine replacement or structured cessation therapy dramatically drops cardiac and stroke risks.',
      rationale:
        'Within 1 year of tobacco cessation, the excess risk of coronary heart disease drops by 50%.',
      triggeredBy: 'Current tobacco smoking status',
      priority: 'urgent',
    });
  }

  return recommendations;
}

module.exports = { generateRecommendations };
