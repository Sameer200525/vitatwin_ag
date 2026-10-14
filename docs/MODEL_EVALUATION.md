# VitaTwin — Machine Learning Model Evaluation Report

The stored metrics below come from stratified random 80/20 train/test splits (the code does not use chronological splits). Preprocessing is fitted within pipelines on training rows only. However, each training script chooses its winning algorithm by comparing metrics on that same test split, then reports those test metrics; they are therefore model-selection-biased and are not an independent final evaluation.

## Evaluation Summary Table

| Disease Model | Selected Algorithm | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Primary Optimization Metric |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Heart Disease** | Random Forest | 83.7% | 84.0% | 87.3% | **0.8558** | **0.9242** | F1 / ROC-AUC |
| **Diabetes** | Random Forest | 73.6% | 72.0% | 77.3% | **0.7456** | **0.8123** | Recall / F1 |
| **Hypertension** | Logistic Regression | 50.3% | 50.3% | 52.3% | **0.5124** | **0.5052** | F1 Balanced |
| **Stroke Risk** | Logistic Regression | 73.9% | 13.5% | 80.0% | **0.2305** | **0.8393** | Recall & ROC-AUC (High Imbalance) |
| **Kidney Disease (CKD)** | Random Forest | 100.0% | 100.0% | 100.0% | **1.0000** | **1.0000** | F1-Score |
| **Obesity Level** | Random Forest | 93.6% | 94.2% | 93.4% | **0.9364** | N/A (Multi-class) | Macro F1-Score |

These are the values recorded in the model metadata, not evidence of clinical validation or calibration. Dataset provenance, external validation, confidence intervals, and prospective performance have not been established.

### Audit cautions
- **Hypertension:** ROC-AUC 0.5052 is near chance. In the bundled dataset, the positive-label rate is nearly constant across systolic-pressure quartiles (about 71.5–72.1%), so the current labels do not show the expected relationship with this key feature. Do not use these scores as meaningful hypertension risk estimates; no relabeling or retraining is justified without a verified target definition.
- **Stroke:** the stored confusion matrix is `[[715, 257], [10, 40]]`. At the default threshold, 257 of 972 actual negatives are false positives (26.4% false-positive rate); only 40 of 297 positive predictions are true positives (13.5% precision). The high recall is traded for many false alarms on an imbalanced test set.
- **Kidney disease:** the reported perfect result is from only 80 test rows. The source file is label-sorted, but the training split is shuffled/stratified; `id` is excluded from model features and no duplicate feature rows were found in this audit. Perfect holdout metrics still require independent validation and should not be treated as proof of generalization.
- **Demonstration scope:** outputs are educational/software demonstrations only. Successful artifact loading or API inference is not evidence of clinical reliability.

### Baseline Comparison Highlights
- **Stroke Model Imbalance**: Positive stroke prevalence is ~4.9% of observational data. Under standard thresholds, naive models predict all negative; weighted Logistic Regression maintains an 80.0% clinical screening recall and 0.8393 ROC-AUC.
- **Obesity Model**: Resolves 7 distinct weight tiers (`Insufficient_Weight`, `Normal_Weight`, `Overweight_I`, `Overweight_II`, `Obesity_I`, `Obesity_II`, `Obesity_III`) with 93.6% overall accuracy.
- **Kidney Disease Model**: Strong predictive signal from serum creatinine, hemoglobin, and urine albumin achieving robust separation.
