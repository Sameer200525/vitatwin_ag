import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List

sys.path.insert(0, os.path.dirname(__file__))

from schemas import (
    HeartInput,
    DiabetesInput,
    HypertensionInput,
    StrokeInput,
    KidneyInput,
    ObesityInput,
    UnifiedTwinAssessmentInput,
    RiskPredictionResult,
)

BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "..", "models")

_MODELS: Dict[str, Any] = {}
_METADATA: Dict[str, Any] = {}


def load_model(name: str):
    if name not in _MODELS:
        model_file = os.path.join(MODEL_DIR, f"{name}_model.joblib")
        if not os.path.exists(model_file):
            raise FileNotFoundError(f"Model file not found: {model_file}")
        _MODELS[name] = joblib.load(model_file)
    return _MODELS[name]


def load_metadata(name: str):
    if name not in _METADATA:
        meta_file = os.path.join(MODEL_DIR, f"{name}_metadata.json")
        if os.path.exists(meta_file):
            with open(meta_file, "r") as f:
                _METADATA[name] = json.load(f)
        else:
            _METADATA[name] = {"disease": name, "model_version": "1.0.0"}
    return _METADATA[name]


DISCLAIMER = (
    "AI-assisted risk score for preventive health education and lifestyle planning. "
    "Not a clinical medical diagnosis. Consult a licensed physician for medical evaluation."
)


def get_risk_tier(prob: float) -> str:
    if prob < 0.25:
        return "Low"
    elif prob < 0.55:
        return "Moderate"
    else:
        return "High"


def predict_heart(input_data: HeartInput) -> RiskPredictionResult:
    pipeline = load_model("heart_disease")
    meta = load_metadata("heart_disease")

    df = pd.DataFrame([input_data.model_dump()])
    prob = float(pipeline.predict_proba(df)[0][1])
    pred_class = int(pipeline.predict(df)[0])

    factors = []
    if (input_data.trestbps or 0) >= 135:
        factors.append(f"Elevated resting blood pressure ({input_data.trestbps} mmHg)")
    if (input_data.chol or 0) >= 200:
        factors.append(f"Elevated total cholesterol ({input_data.chol} mg/dL)")
    if input_data.age >= 50:
        factors.append(f"Age tier ({int(input_data.age)} years)")
    if input_data.exang == "TRUE":
        factors.append("Exercise-induced angina symptom reported")
    if (input_data.oldpeak or 0) > 1.5:
        factors.append("ST-segment depression on exertion")

    risk_level = get_risk_tier(prob)
    return RiskPredictionResult(
        disease="Heart Disease",
        risk_level=risk_level,
        probability=round(prob, 4),
        risk_percentage=round(prob * 100, 1),
        confidence_tier="High Confidence" if (prob < 0.2 or prob > 0.7) else "Moderate Confidence",
        predicted_class=pred_class,
        top_contributing_factors=factors or ["Physiological biomarkers within typical ranges"],
        clinical_note=f"Calculated 10-year coronary heart disease probability is {round(prob * 100, 1)}%.",
        limitations_disclaimer=DISCLAIMER,
        model_version=meta.get("model_version", "1.0.0"),
    )


def predict_diabetes(input_data: DiabetesInput) -> RiskPredictionResult:
    pipeline = load_model("diabetes")
    meta = load_metadata("diabetes")

    df = pd.DataFrame([input_data.model_dump()])
    prob = float(pipeline.predict_proba(df)[0][1])
    pred_class = int(pipeline.predict(df)[0])

    factors = []
    if input_data.BMI >= 25.0:
        factors.append(f"Elevated Body Mass Index ({input_data.BMI})")
    if input_data.HighBP == 1:
        factors.append("Hypertension presence indicator")
    if input_data.HighChol == 1:
        factors.append("High cholesterol status reported")
    if input_data.PhysActivity == 0:
        factors.append("Sedentary lifestyle in the past 30 days")
    if input_data.GenHlth >= 4:
        factors.append("Sub-optimal self-assessed general health")

    risk_level = get_risk_tier(prob)
    return RiskPredictionResult(
        disease="Diabetes",
        risk_level=risk_level,
        probability=round(prob, 4),
        risk_percentage=round(prob * 100, 1),
        confidence_tier="High Confidence" if (prob < 0.2 or prob > 0.7) else "Moderate Confidence",
        predicted_class=pred_class,
        top_contributing_factors=factors or ["Metabolic indicators currently stable"],
        clinical_note=f"Metabolic diabetes susceptibility estimated at {round(prob * 100, 1)}%.",
        limitations_disclaimer=DISCLAIMER,
        model_version=meta.get("model_version", "1.0.0"),
    )


def predict_hypertension(input_data: HypertensionInput) -> RiskPredictionResult:
    pipeline = load_model("hypertension")
    meta = load_metadata("hypertension")

    df = pd.DataFrame([input_data.model_dump()])
    prob = float(pipeline.predict_proba(df)[0][1])
    pred_class = int(pipeline.predict(df)[0])

    factors = []
    if input_data.Systolic_BP >= 130 or input_data.Diastolic_BP >= 85:
        factors.append(f"Elevated Blood Pressure ({int(input_data.Systolic_BP)}/{int(input_data.Diastolic_BP)} mmHg)")
    if input_data.BMI >= 25:
        factors.append(f"Overweight / elevated BMI ({input_data.BMI})")
    if input_data.Smoking_Status.lower() in ["current", "smoker"]:
        factors.append("Active tobacco smoking")
    if input_data.Sleep_Duration < 6:
        factors.append("Insufficient sleep duration (< 6 hrs/night)")
    if input_data.Family_History.lower() == "yes":
        factors.append("Family history of cardiovascular hypertension")

    risk_level = get_risk_tier(prob)
    return RiskPredictionResult(
        disease="Hypertension",
        risk_level=risk_level,
        probability=round(prob, 4),
        risk_percentage=round(prob * 100, 1),
        confidence_tier="Moderate Confidence",
        predicted_class=pred_class,
        top_contributing_factors=factors or ["Vascular pressures within normal clinical guidelines"],
        clinical_note=f"Arterial hypertension risk estimated at {round(prob * 100, 1)}%.",
        limitations_disclaimer=DISCLAIMER,
        model_version=meta.get("model_version", "1.0.0"),
    )


def predict_stroke(input_data: StrokeInput) -> RiskPredictionResult:
    pipeline = load_model("stroke")
    meta = load_metadata("stroke")

    df = pd.DataFrame([input_data.model_dump()])
    prob = float(pipeline.predict_proba(df)[0][1])
    pred_class = int(pipeline.predict(df)[0])

    factors = []
    if input_data.age >= 55:
        factors.append(f"Advancing chronological age ({int(input_data.age)} yrs)")
    if input_data.hypertension == 1:
        factors.append("Documented hypertension")
    if input_data.heart_disease == 1:
        factors.append("Underlying cardiac disease")
    if input_data.avg_glucose_level >= 120:
        factors.append(f"Elevated average serum glucose ({input_data.avg_glucose_level} mg/dL)")
    if input_data.smoking_status in ["smokes", "formerly smoked"]:
        factors.append(f"Tobacco history ({input_data.smoking_status})")

    risk_level = get_risk_tier(prob)
    return RiskPredictionResult(
        disease="Stroke",
        risk_level=risk_level,
        probability=round(prob, 4),
        risk_percentage=round(prob * 100, 1),
        confidence_tier="High Confidence" if (prob < 0.2 or prob > 0.7) else "Moderate Confidence",
        predicted_class=pred_class,
        top_contributing_factors=factors or ["Cerebrovascular risk indicators within normal threshold"],
        clinical_note=f"Cerebrovascular risk index estimated at {round(prob * 100, 1)}%.",
        limitations_disclaimer=DISCLAIMER,
        model_version=meta.get("model_version", "1.0.0"),
    )


def predict_kidney(input_data: KidneyInput) -> RiskPredictionResult:
    pipeline = load_model("kidney_disease")
    meta = load_metadata("kidney_disease")

    df = pd.DataFrame([input_data.model_dump()])
    prob = float(pipeline.predict_proba(df)[0][1])
    pred_class = int(pipeline.predict(df)[0])

    factors = []
    if (input_data.sc or 1.0) >= 1.3:
        factors.append(f"Elevated serum creatinine ({input_data.sc} mg/dL)")
    if (input_data.al or 0.0) >= 1.0:
        factors.append(f"Albuminuria present (grade {input_data.al})")
    if (input_data.hemo or 14.0) < 12.0:
        factors.append(f"Lowered hemoglobin ({input_data.hemo} g/dL)")
    if (input_data.bgr or 100.0) >= 140.0:
        factors.append(f"Elevated blood glucose ({input_data.bgr} mg/dL)")
    if input_data.htn == "yes":
        factors.append("Renal stress from systemic hypertension")

    risk_level = get_risk_tier(prob)
    return RiskPredictionResult(
        disease="Chronic Kidney Disease",
        risk_level=risk_level,
        probability=round(prob, 4),
        risk_percentage=round(prob * 100, 1),
        confidence_tier="High Confidence",
        predicted_class=pred_class,
        top_contributing_factors=factors or ["Renal filtration indicators within baseline limits"],
        clinical_note=f"Renal functional risk index evaluated at {round(prob * 100, 1)}%.",
        limitations_disclaimer=DISCLAIMER,
        model_version=meta.get("model_version", "1.0.0"),
    )


def predict_obesity(input_data: ObesityInput) -> RiskPredictionResult:
    pipeline = load_model("obesity")
    meta = load_metadata("obesity")

    df = pd.DataFrame([input_data.model_dump()])
    predicted_label = str(pipeline.predict(df)[0])
    probabilities = pipeline.predict_proba(df)[0]
    classes = list(pipeline.classes_)

    class_prob_map = {cls_name: float(probabilities[i]) for i, cls_name in enumerate(classes)}
    top_prob = float(np.max(probabilities))

    # Calculate overall elevated weight risk (sum of overweight & obese classes)
    elevated_classes = [c for c in classes if "Obesity" in c or "Overweight" in c]
    elevated_prob = sum(class_prob_map.get(c, 0.0) for c in elevated_classes)

    factors = []
    calculated_bmi = input_data.Weight / ((input_data.Height) ** 2)
    if calculated_bmi >= 25.0:
        factors.append(f"Calculated BMI is {round(calculated_bmi, 1)}")
    if input_data.FAVC.lower() == "yes":
        factors.append("High caloric density food intake")
    if input_data.FAF < 1.0:
        factors.append("Low physical activity frequency")
    if input_data.family_history_with_overweight.lower() == "yes":
        factors.append("Genetic/familial overweight history")

    display_level = predicted_label.replace("_", " ")

    return RiskPredictionResult(
        disease="Obesity",
        risk_level=display_level,
        probability=round(elevated_prob, 4),
        risk_percentage=round(elevated_prob * 100, 1),
        confidence_tier="High Confidence" if top_prob > 0.6 else "Moderate Confidence",
        predicted_class=predicted_label,
        top_contributing_factors=factors or ["Body composition and lifestyle habits well balanced"],
        clinical_note=f"Weight phenotype predicted as '{display_level}' with {round(top_prob * 100, 1)}% class certainty.",
        limitations_disclaimer=DISCLAIMER,
        model_version=meta.get("model_version", "1.0.0"),
    )


def predict_all_from_twin(twin: UnifiedTwinAssessmentInput) -> Dict[str, RiskPredictionResult]:
    # Calculate BMI
    bmi = twin.bmi
    if not bmi:
        height_m = twin.height_cm / 100.0
        bmi = round(twin.weight_kg / (height_m * height_m), 1)

    age_cat = 5
    if twin.age < 25:
        age_cat = 1
    elif twin.age < 35:
        age_cat = 3
    elif twin.age < 50:
        age_cat = 6
    elif twin.age < 65:
        age_cat = 9
    else:
        age_cat = 12

    is_smoker = 1 if twin.smoking_status.lower() in ["smoker", "current", "yes"] else 0
    is_high_bp = 1 if twin.systolic_bp >= 130 or twin.diastolic_bp >= 85 else 0
    is_high_chol = 1 if (twin.cholesterol or 190) >= 200 else 0
    phys_act = 1 if twin.physical_activity.lower() in ["moderate", "high", "active"] else 0

    heart_in = HeartInput(
        age=twin.age,
        sex=twin.gender,
        cp="non-anginal" if twin.systolic_bp < 140 else "atypical angina",
        trestbps=twin.systolic_bp,
        chol=twin.cholesterol or 200.0,
        fbs="TRUE" if twin.glucose > 120 else "FALSE",
        restecg="normal",
        thalch=150.0 if twin.heart_rate < 85 else 130.0,
        exang="FALSE",
        oldpeak=0.0,
        slope="upsloping",
    )

    diab_in = DiabetesInput(
        HighBP=is_high_bp,
        HighChol=is_high_chol,
        CholCheck=1,
        BMI=bmi,
        Smoker=is_smoker,
        Stroke=0,
        HeartDiseaseorAttack=1 if twin.family_history_heart else 0,
        PhysActivity=phys_act,
        Fruits=1,
        Veggies=1,
        HvyAlcoholConsump=0,
        GenHlth=2 if is_high_bp == 0 else 3,
        MentHlth=1,
        PhysHlth=1,
        DiffWalk=0,
        Sex=1 if twin.gender.lower() == "male" else 0,
        Age=age_cat,
    )

    hyp_in = HypertensionInput(
        Age=twin.age,
        BMI=bmi,
        Systolic_BP=twin.systolic_bp,
        Diastolic_BP=twin.diastolic_bp,
        Heart_Rate=twin.heart_rate,
        Glucose=twin.glucose,
        Cholesterol=twin.cholesterol or 190.0,
        Sleep_Duration=twin.sleep_duration,
        Smoking_Status="Current" if is_smoker else "Non-Smoker",
        Alcohol_Intake="None",
        Physical_Activity_Level="Moderate" if phys_act else "Low",
        Family_History="Yes" if twin.family_history_hypertension else "No",
        Stress_Level="Moderate",
        Gender=twin.gender,
    )

    stroke_in = StrokeInput(
        gender=twin.gender,
        age=twin.age,
        hypertension=is_high_bp,
        heart_disease=1 if twin.family_history_heart else 0,
        ever_married="Yes" if twin.age >= 25 else "No",
        work_type="Private",
        Residence_type="Urban",
        avg_glucose_level=twin.glucose,
        bmi=bmi,
        smoking_status="smokes" if is_smoker else "never smoked",
    )

    kidney_in = KidneyInput(
        age=twin.age,
        bp=twin.diastolic_bp,
        sg=1.020,
        al=0.0,
        su=0.0,
        bgr=twin.glucose,
        bu=30.0,
        sc=1.0,
        sod=138.0,
        pot=4.2,
        hemo=14.5,
        pcv=42.0,
        wc=7500.0,
        rc=5.0,
        htn="yes" if is_high_bp else "no",
        dm="yes" if twin.family_history_diabetes or twin.glucose > 140 else "no",
        cad="no",
        appet="good",
        pe="no",
        ane="no",
    )

    obesity_in = ObesityInput(
        Gender=twin.gender,
        Age=twin.age,
        Height=round(twin.height_cm / 100.0, 2),
        Weight=twin.weight_kg,
        family_history_with_overweight="yes" if bmi >= 25 else "no",
        FAVC="yes" if bmi >= 25 else "no",
        FCVC=2.0,
        NCP=3.0,
        CAEC="Sometimes",
        SMOKE="yes" if is_smoker else "no",
        CH2O=2.0,
        SCC="no",
        FAF=2.0 if phys_act else 0.5,
        TUE=1.0,
        CALC="Sometimes",
        MTRANS="Public_Transportation",
    )

    return {
        "heart": predict_heart(heart_in),
        "diabetes": predict_diabetes(diab_in),
        "hypertension": predict_hypertension(hyp_in),
        "stroke": predict_stroke(stroke_in),
        "kidney": predict_kidney(kidney_in),
        "obesity": predict_obesity(obesity_in),
    }
