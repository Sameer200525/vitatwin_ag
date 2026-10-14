import os
import sys
from fastapi.testclient import TestClient

# Add app directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app")))

from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert len(data["available_models"]) == 6


def test_models_metadata():
    response = client.get("/api/models/metadata")
    assert response.status_code == 200
    data = response.json()
    assert "heart" in data
    assert "diabetes" in data
    assert "hypertension" in data
    assert "stroke" in data
    assert "kidney" in data
    assert "obesity" in data


def test_heart_prediction():
    payload = {
        "age": 55,
        "sex": "Male",
        "cp": "typical angina",
        "trestbps": 140,
        "chol": 240,
        "fbs": "FALSE",
        "restecg": "normal",
        "thalch": 130,
        "exang": "TRUE",
        "oldpeak": 2.0,
        "slope": "flat",
    }
    response = client.post("/api/predict/heart", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Heart Disease"
    assert "probability" in data
    assert 0.0 <= data["probability"] <= 1.0
    assert data["risk_level"] in ["Low", "Moderate", "High"]
    assert len(data["top_contributing_factors"]) > 0


def test_diabetes_prediction():
    payload = {
        "HighBP": 1,
        "HighChol": 1,
        "CholCheck": 1,
        "BMI": 32.5,
        "Smoker": 1,
        "Stroke": 0,
        "HeartDiseaseorAttack": 0,
        "PhysActivity": 0,
        "Fruits": 0,
        "Veggies": 0,
        "HvyAlcoholConsump": 0,
        "GenHlth": 4,
        "MentHlth": 5,
        "PhysHlth": 10,
        "DiffWalk": 1,
        "Sex": 1,
        "Age": 9,
    }
    response = client.post("/api/predict/diabetes", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Diabetes"
    assert 0.0 <= data["probability"] <= 1.0


def test_hypertension_prediction():
    payload = {
        "Age": 58,
        "BMI": 29.0,
        "Systolic_BP": 145,
        "Diastolic_BP": 92,
        "Heart_Rate": 80,
        "Glucose": 110,
        "Cholesterol": 220,
        "Sleep_Duration": 5.5,
        "Smoking_Status": "Current",
        "Alcohol_Intake": "Moderate",
        "Physical_Activity_Level": "Low",
        "Family_History": "Yes",
        "Stress_Level": "High",
        "Gender": "Male",
    }
    response = client.post("/api/predict/hypertension", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Hypertension"
    assert 0.0 <= data["probability"] <= 1.0


def test_stroke_prediction():
    payload = {
        "gender": "Female",
        "age": 67,
        "hypertension": 1,
        "heart_disease": 0,
        "ever_married": "Yes",
        "work_type": "Private",
        "Residence_type": "Urban",
        "avg_glucose_level": 160.0,
        "bmi": 31.0,
        "smoking_status": "formerly smoked",
    }
    response = client.post("/api/predict/stroke", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Stroke"
    assert 0.0 <= data["probability"] <= 1.0


def test_kidney_prediction():
    payload = {
        "age": 60,
        "bp": 90,
        "sg": 1.010,
        "al": 3.0,
        "su": 1.0,
        "rbc": "abnormal",
        "pc": "abnormal",
        "pcc": "present",
        "ba": "notpresent",
        "bgr": 180.0,
        "bu": 60.0,
        "sc": 2.5,
        "sod": 130.0,
        "pot": 5.2,
        "hemo": 9.5,
        "pcv": 30.0,
        "wc": 11000.0,
        "rc": 3.5,
        "htn": "yes",
        "dm": "yes",
        "cad": "no",
        "appet": "poor",
        "pe": "yes",
        "ane": "yes",
    }
    response = client.post("/api/predict/kidney", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Chronic Kidney Disease"
    assert 0.0 <= data["probability"] <= 1.0


def test_obesity_prediction():
    payload = {
        "Gender": "Female",
        "Age": 28,
        "Height": 1.62,
        "Weight": 92.0,
        "family_history_with_overweight": "yes",
        "FAVC": "yes",
        "FCVC": 2.0,
        "NCP": 3.0,
        "CAEC": "Sometimes",
        "SMOKE": "no",
        "CH2O": 1.5,
        "SCC": "no",
        "FAF": 0.5,
        "TUE": 2.0,
        "CALC": "no",
        "MTRANS": "Public_Transportation",
    }
    response = client.post("/api/predict/obesity", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease"] == "Obesity"
    assert "predicted_class" in data


def test_unified_twin_prediction():
    payload = {
        "age": 45,
        "gender": "Male",
        "height_cm": 178,
        "weight_kg": 82,
        "systolic_bp": 132,
        "diastolic_bp": 84,
        "heart_rate": 74,
        "glucose": 105,
        "cholesterol": 210,
        "sleep_duration": 6.5,
        "smoking_status": "non-smoker",
        "physical_activity": "moderate",
        "family_history_heart": True,
        "family_history_diabetes": False,
        "family_history_hypertension": True,
    }
    response = client.post("/api/predict/all", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "heart" in data
    assert "diabetes" in data
    assert "hypertension" in data
    assert "stroke" in data
    assert "kidney" in data
    assert "obesity" in data
