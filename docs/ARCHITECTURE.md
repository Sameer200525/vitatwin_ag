# VitaTwin — System Architecture & Design

## 1. Overview
VitaTwin is an AI-powered Digital Twin platform for preventive healthcare. It continuously models an individual patient's physiological state, evaluates multi-disease risks across six machine learning pipelines, generates transparent educational lifestyle interventions, and forecasts longitudinal health trajectories.

```
+-------------------------------------------------------------------------------+
|                           Frontend (React 18 + Vite)                          |
|   Tailwind CSS / Recharts / React Router / React Hook Form / TypeScript       |
+-------------------------------------------------------------------------------+
                                      | (HTTP / Cookies / JSON)
                                      v
+-------------------------------------------------------------------------------+
|                       Core Backend API (Node.js + Express)                    |
|   - Authentication & JWT Session Cookies                                      |
|   - Health Profile Management & Auto BMI Calculation                          |
|   - Longitudinal Biomarker Tracking (CRUD & CSV Export)                       |
|   - Transparent Rule-Based Health Recommendation Engine                       |
|   - Explainable Trajectory Forecaster (OLS with 95% Confidence Band)          |
|   - Digital Twin Summary & Completeness Scoring Engine                        |
+-------------------------------------------------------------------------------+
         | (MongoDB Driver)                             | (Axios HTTP Client)
         v                                              v
+-----------------------------+        +----------------------------------------+
|      MongoDB Database       |        |   ML Inference Service (FastAPI)       |
|  - Users                    |        |  - Heart Disease (Random Forest)       |
|  - HealthProfiles           |        |  - Diabetes (Random Forest)            |
|  - HealthMeasurements       |        |  - Hypertension (Logistic Regression)  |
|  - DiseaseAssessments       |        |  - Chronic Kidney Disease (RF)         |
|  - Recommendations          |        |  - Stroke Risk (Logistic Regression)   |
|  - Forecasts                |        |  - Obesity Phenotype (RF 7-Class)      |
+-----------------------------+        +----------------------------------------+
```

## 2. Multi-Service Decoupling
1. **Frontend (Port 5173 / Production 80)**:
   - React 18, Vite, TypeScript, Tailwind CSS, Recharts.
   - Proxies `/api` calls directly to the Express backend.
2. **Core Server (Port 5000)**:
   - Express.js, MongoDB via Mongoose.
   - Enforces user data isolation and ownership on every operation.
   - Hosts business logic: rule engine, forecasting engine, completeness score, CSV streaming.
3. **ML Inference Service (Port 8000)**:
   - Python 3 FastAPI, Pydantic, scikit-learn, joblib.
   - Dedicated microservice evaluating real-time inference without state retention.
