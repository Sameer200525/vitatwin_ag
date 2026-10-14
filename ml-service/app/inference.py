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


def predict_all_from_twin(twin: UnifiedTwinAssessmentInput) -> Dict[str, Any]:
    model_inputs = {
        "heart": (twin.heart, predict_heart),
        "diabetes": (twin.diabetes, predict_diabetes),
        "hypertension": (twin.hypertension, predict_hypertension),
        "stroke": (twin.stroke, predict_stroke),
        "kidney": (twin.kidney, predict_kidney),
        "obesity": (twin.obesity, predict_obesity),
    }
    results: Dict[str, Any] = {}

    for disease, (input_data, predict) in model_inputs.items():
        schema_fields = list(input_data.__class__.model_fields) if input_data else []
        missing_fields = [
            field
            for field in schema_fields
            if field not in input_data.model_fields_set
            or getattr(input_data, field) is None
        ] if input_data else []

        if input_data is None:
            schema_class = {
                "heart": HeartInput,
                "diabetes": DiabetesInput,
                "hypertension": HypertensionInput,
                "stroke": StrokeInput,
                "kidney": KidneyInput,
                "obesity": ObesityInput,
            }[disease]
            missing_fields = list(schema_class.model_fields)

        if missing_fields:
            results[disease] = {
                "status": "insufficient_data",
                "missing_fields": missing_fields,
            }
            continue

        results[disease] = {
            "status": "predicted",
            "result": predict(input_data).model_dump(),
        }

    return results
