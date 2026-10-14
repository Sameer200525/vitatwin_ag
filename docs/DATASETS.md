# VitaTwin — Clinical Observational Datasets

VitaTwin trains six independent disease-risk prediction pipelines using genuine observational cohorts:

| Disease Target | Source Dataset | Rows / Columns | Target Definition | Features Used |
| :--- | :--- | :--- | :--- | :--- |
| **Heart Disease** | `heart_disease_uci.csv` | 920 rows, 16 cols | `num > 0` (0: No disease, 1: Present) | `age`, `sex`, `cp`, `trestbps`, `chol`, `fbs`, `restecg`, `thalch`, `exang`, `oldpeak`, `slope` |
| **Type 2 Diabetes** | `diabetes_012_health_indicators_BRFSS2015.csv` | 253,680 rows, 22 cols | `Diabetes_012 > 0` (0: No, 1: Prediabetes/Diabetes) | `HighBP`, `HighChol`, `BMI`, `Smoker`, `PhysActivity`, `GenHlth`, `MentHlth`, `PhysHlth`, `Age` |
| **Hypertension** | `hypertension_dataset.csv` | 174,982 rows, 23 cols | `Hypertension == High` (0: Low, 1: High) | `Age`, `BMI`, `Systolic_BP`, `Diastolic_BP`, `Heart_Rate`, `Glucose`, `Cholesterol`, `Sleep_Duration`, `Smoking_Status`, `Physical_Activity_Level`, `Family_History`, `Gender` |
| **Chronic Kidney Disease (CKD)** | `kidney_disease.csv` | 400 rows, 26 cols | `classification == 'ckd'` (0: Not CKD, 1: CKD) | `age`, `bp`, `sg`, `al`, `su`, `bgr`, `bu`, `sc`, `sod`, `pot`, `hemo`, `pcv`, `wc`, `rc`, `htn`, `dm`, `cad`, `appet`, `pe`, `ane` |
| **Stroke** | `healthcare-dataset-stroke-data.csv` | 5,110 rows, 12 cols | `stroke == 1` (0: No stroke, 1: Stroke) | `gender`, `age`, `hypertension`, `heart_disease`, `ever_married`, `work_type`, `Residence_type`, `avg_glucose_level`, `bmi`, `smoking_status` |
| **Obesity Level** | `ObesityDataSet_raw_and_data_sinthetic.csv` | 2,111 rows, 17 cols | `NObeyesdad` (7 Weight Categories) | `Gender`, `Age`, `Height`, `Weight`, `family_history_with_overweight`, `FAVC`, `FCVC`, `NCP`, `CAEC`, `SMOKE`, `CH2O`, `SCC`, `FAF`, `TUE`, `CALC`, `MTRANS` |

All six datasets are stored in `data/` and handled with missing-value imputation, one-hot encoding, and standard scaling.
