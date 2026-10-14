# VitaTwin — AI-Powered Digital Twin for Preventive Healthcare

[![Full Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20FastAPI-teal.svg)](#)
[![ML Models](https://img.shields.io/badge/ML%20Pipelines-6%20Trained%20Models-blue.svg)](#)
[![Tests](https://img.shields.io/badge/Tests-All%20Passing-success.svg)](#)

VitaTwin bridges computational machine learning and preventive healthcare by continuously modeling a patient's physiological digital twin, screening for six chronic disease risks, generating transparent educational interventions, and forecasting longitudinal biomarker trajectories.

---

## 1. System Architecture

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Recharts, Lucide Icons, React Router DOM, React Hook Form.
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT HTTP-only cookies, bcrypt, validation & security middleware.
- **AI/ML Service**: Python 3, FastAPI, scikit-learn, pandas, NumPy, joblib.
- **Database**: MongoDB 8.0 (localhost:27017).

---

## 2. Prerequisites (Windows / Linux / macOS)

1. **Node.js**: v18+ (tested on Node v22.21.0)
2. **Python**: 3.10+ (tested on Python 3.13.1)
3. **MongoDB**: Local MongoDB community service or MongoDB Atlas URI running on port 27017.

---

## 3. Quick Start & Execution on Windows

### Step A. ML Service Setup & Model Training
Open **Terminal 1**:
```powershell
# Navigate to ML service
cd c:\vitatwin_ag\ml-service

# Install dependencies
pip install -r requirements.txt

# (Optional) Re-train all 6 models from the datasets in data/
python training\train_all.py

# Run ML unit tests
python -m pytest tests\test_inference.py -v

# Start FastAPI inference service on port 8000
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Step B. Express Backend Setup
Open **Terminal 2**:
```powershell
# Navigate to backend
cd c:\vitatwin_ag\server

# Install dependencies
npm install

# Run backend integration tests (Jest + Supertest)
npm test

# Start Express server on port 5000
npm run dev
```

### Step C. React Frontend Setup
Open **Terminal 3**:
```powershell
# Navigate to client
cd c:\vitatwin_ag\client

# Install dependencies
npm install

# Build client for validation
npm run build

# Start Vite dev server on port 5173
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 4. Environment Variables Configuration

### Server (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/vitatwin
JWT_SECRET=vitatwin_dev_jwt_secret_key_secure_2026_xyz987
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ML_SERVICE_URL=http://127.0.0.1:8000
```

---

## 5. Machine Learning Models Summary

VitaTwin includes 6 independent clinical pipelines trained on real observational cohorts:

1. **Coronary Heart Disease**: Random Forest (ROC-AUC: 0.9242, F1: 0.8558)
2. **Type 2 Diabetes**: Random Forest (ROC-AUC: 0.8123, F1: 0.7456)
3. **Arterial Hypertension**: Balanced Logistic Regression (F1: 0.5124)
4. **Chronic Kidney Disease (CKD)**: Random Forest (F1: 1.0000, ROC-AUC: 1.0000)
5. **Cerebrovascular Stroke**: Balanced Logistic Regression (Recall: 0.8000, ROC-AUC: 0.8393)
6. **Obesity Phenotype**: Random Forest (7-class accuracy: 93.6%, Macro F1: 0.9364)

---

## 6. Testing Verification

All tests run locally and verify complete end-to-end functionality:
- **ML Inference Tests**: `pytest ml-service/tests/test_inference.py` (9 tests passing)
- **Backend API Tests**: `npm test` in `server/` (14 integration tests passing)
- **Frontend Type & Bundle Check**: `npm run build` in `client/` (TypeScript + Vite passing)

---

## 7. Troubleshooting

- **MongoDB connection refused**:
  Verify MongoDB service is running via PowerShell:
  `Get-Service -Name '*mongo*' | Start-Service`
- **Port 5000 / 8000 in use**:
  Ensure other applications are not occupying ports 5000 or 8000.
- **CORS or Cookie Issues in Dev**:
  Ensure cookies are allowed in the browser and both backend (`localhost:5000`) and frontend (`localhost:5173`) are running.
