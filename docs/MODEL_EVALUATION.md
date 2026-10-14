# VitaTwin — Machine Learning Model Evaluation Report

All models were evaluated using chronological and stratified test splits (20% holdout). Multiple baseline architectures (Logistic Regression, Decision Tree, Random Forest) were benchmarked per disease.

## Evaluation Summary Table

| Disease Model | Selected Algorithm | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Primary Optimization Metric |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Heart Disease** | Random Forest | 83.7% | 84.0% | 87.3% | **0.8558** | **0.9242** | F1 / ROC-AUC |
| **Diabetes** | Random Forest | 73.6% | 72.0% | 77.3% | **0.7456** | **0.8123** | Recall / F1 |
| **Hypertension** | Logistic Regression | 50.3% | 50.3% | 52.3% | **0.5124** | **0.5052** | F1 Balanced |
| **Stroke Risk** | Logistic Regression | 73.9% | 13.5% | 80.0% | **0.2305** | **0.8393** | Recall & ROC-AUC (High Imbalance) |
| **Kidney Disease (CKD)** | Random Forest | 100.0% | 100.0% | 100.0% | **1.0000** | **1.0000** | F1-Score |
| **Obesity Level** | Random Forest | 93.6% | 94.2% | 93.4% | **0.9364** | N/A (Multi-class) | Macro F1-Score |

### Baseline Comparison Highlights
- **Stroke Model Imbalance**: Positive stroke prevalence is ~4.9% of observational data. Under standard thresholds, naive models predict all negative; weighted Logistic Regression maintains an 80.0% clinical screening recall and 0.8393 ROC-AUC.
- **Obesity Model**: Resolves 7 distinct weight tiers (`Insufficient_Weight`, `Normal_Weight`, `Overweight_I`, `Overweight_II`, `Obesity_I`, `Obesity_II`, `Obesity_III`) with 93.6% overall accuracy.
- **Kidney Disease Model**: Strong predictive signal from serum creatinine, hemoglobin, and urine albumin achieving robust separation.
