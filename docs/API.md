# VitaTwin — API Specification

## 1. Authentication Endpoints (`/api/auth`)
- `POST /register`: Register new patient account and initialize baseline health profile.
- `POST /login`: Authenticate and issue secure HTTP-only session cookie.
- `POST /logout`: Invalidate session cookie.
- `GET /me`: Return authenticated user and current health profile.

## 2. Health Profile Endpoints (`/api/profile`)
- `GET /`: Retrieve the authenticated user's physiological profile.
- `PUT /`: Update height, weight (with automatic BMI recalculation), vitals, and medical history.

## 3. Health Measurement Endpoints (`/api/measurements`)
- `GET /`: Retrieve user measurements with query filters (`type`, `startDate`, `endDate`, `limit`, `page`).
- `POST /`: Record a new biomarker reading.
- `PUT /:id`: Update an existing measurement (enforces ownership).
- `DELETE /:id`: Delete an existing measurement (enforces ownership).
- `GET /export/csv`: Stream user's measurements as a formatted CSV download.

## 4. Prediction Endpoints (`/api/predictions`)
- `POST /heart`: Coronary heart disease risk.
- `POST /diabetes`: Type 2 diabetes risk.
- `POST /hypertension`: Arterial hypertension risk.
- `POST /kidney`: Chronic kidney disease risk.
- `POST /stroke`: Cerebrovascular stroke risk.
- `POST /obesity`: Multi-class obesity phenotype prediction.
- `POST /all`: Unified batch screening. Supply model-specific input objects under `heart`, `diabetes`, `hypertension`, `stroke`, `kidney`, and/or `obesity`. A model runs only when every feature it requires is explicitly provided; otherwise its result is `{ "status": "insufficient_data", "missing_fields": [...] }`. Only completed predictions are saved to assessment history.
- `GET /history`: Historical assessment records associated with the authenticated user.

## 5. Educational Recommendations (`/api/recommendations`)
- `GET /`: Retrieve active rule-based educational guidelines.
- `POST /generate`: Re-evaluate guidelines against latest twin vitals.

## 6. Longitudinal Forecasting (`/api/forecast/:metric`)
- `GET /:metric?horizonDays=30`: Computes OLS trajectory regression with 95% confidence intervals. Returns an informative empty state if fewer than 3 historical points exist.

## 7. Digital Twin Summary (`/api/summary`)
- `GET /?days=30`: Aggregates profile completeness, health readiness index, 5-pillar scores, recent vitals, and assessments.
