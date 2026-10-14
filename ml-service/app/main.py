import os
import sys
import json
import logging
from typing import Dict, Any

# Ensure current directory is on python path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
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
from inference import (
    predict_heart,
    predict_diabetes,
    predict_hypertension,
    predict_stroke,
    predict_kidney,
    predict_obesity,
    predict_all_from_twin,
    MODEL_DIR,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vitatwin-ml")

app = FastAPI(
    title="VitaTwin AI Inference Service",
    description="Machine Learning Disease Risk Prediction Pipelines for Preventive Healthcare",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "VitaTwin ML Inference Engine",
        "version": "1.0.0",
        "available_models": [
            "heart_disease",
            "diabetes",
            "hypertension",
            "stroke",
            "kidney_disease",
            "obesity",
        ],
    }


@app.get("/api/models/metadata")
def get_models_metadata():
    summary_path = os.path.join(MODEL_DIR, "evaluation_summary.json")
    if os.path.exists(summary_path):
        with open(summary_path, "r") as f:
            return json.load(f)
    return {"message": "Evaluation summary not yet generated"}


@app.post("/api/predict/heart", response_model=RiskPredictionResult)
def api_predict_heart(data: HeartInput):
    try:
        return predict_heart(data)
    except Exception as e:
        logger.error(f"Heart prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/diabetes", response_model=RiskPredictionResult)
def api_predict_diabetes(data: DiabetesInput):
    try:
        return predict_diabetes(data)
    except Exception as e:
        logger.error(f"Diabetes prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/hypertension", response_model=RiskPredictionResult)
def api_predict_hypertension(data: HypertensionInput):
    try:
        return predict_hypertension(data)
    except Exception as e:
        logger.error(f"Hypertension prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/stroke", response_model=RiskPredictionResult)
def api_predict_stroke(data: StrokeInput):
    try:
        return predict_stroke(data)
    except Exception as e:
        logger.error(f"Stroke prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/kidney", response_model=RiskPredictionResult)
def api_predict_kidney(data: KidneyInput):
    try:
        return predict_kidney(data)
    except Exception as e:
        logger.error(f"Kidney prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/obesity", response_model=RiskPredictionResult)
def api_predict_obesity(data: ObesityInput):
    try:
        return predict_obesity(data)
    except Exception as e:
        logger.error(f"Obesity prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/all", response_model=Dict[str, Any])
def api_predict_all(data: UnifiedTwinAssessmentInput):
    try:
        return predict_all_from_twin(data)
    except Exception as e:
        logger.error(f"Unified prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
