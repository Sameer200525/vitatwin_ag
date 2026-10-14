import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "diabetes_012_health_indicators_BRFSS2015.csv")


def train_diabetes_model():
    print("=== Training Diabetes Risk Model ===")
    os.makedirs(MODEL_DIR, exist_ok=True)

    df = pd.read_csv(DATA_PATH)
    print(f"Loaded raw dataset shape: {df.shape}")

    # Binary risk: 0 = No diabetes, 1 = Prediabetes/Diabetes
    df["target"] = (df["Diabetes_012"] > 0).astype(int)

    feature_cols = [
        "HighBP",
        "HighChol",
        "CholCheck",
        "BMI",
        "Smoker",
        "Stroke",
        "HeartDiseaseorAttack",
        "PhysActivity",
        "Fruits",
        "Veggies",
        "HvyAlcoholConsump",
        "GenHlth",
        "MentHlth",
        "PhysHlth",
        "DiffWalk",
        "Sex",
        "Age",
    ]

    # Sample 60,000 balanced/stratified records for fast and high-precision training
    if len(df) > 60000:
        df_sample = df.groupby("target", group_keys=False).apply(
            lambda x: x.sample(n=min(len(x), 30000), random_state=42)
        )
    else:
        df_sample = df

    X = df_sample[feature_cols].copy()
    y = df_sample["target"].values

    numeric_features = ["BMI", "GenHlth", "MentHlth", "PhysHlth", "Age"]
    binary_features = [col for col in feature_cols if col not in numeric_features]

    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    binary_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("bin", binary_transformer, binary_features),
        ]
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    models = {
        "LogisticRegression": LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42),
        "DecisionTree": DecisionTreeClassifier(max_depth=6, class_weight="balanced", random_state=42),
        "RandomForest": RandomForestClassifier(n_estimators=100, max_depth=8, class_weight="balanced", random_state=42, n_jobs=-1),
    }

    results = {}
    best_model_name = None
    best_f1 = -1
    best_pipeline = None

    for name, clf in models.items():
        pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("classifier", clf)])
        pipeline.fit(X_train, y_train)

        y_pred = pipeline.predict(X_test)
        y_prob = pipeline.predict_proba(X_test)[:, 1]

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        roc_auc = float(roc_auc_score(y_test, y_prob))
        cm = confusion_matrix(y_test, y_pred).tolist()

        results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "confusion_matrix": cm,
        }
        print(f"[{name}] Acc: {acc:.4f}, Prec: {prec:.4f}, Rec: {rec:.4f}, F1: {f1:.4f}, ROC-AUC: {roc_auc:.4f}")

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_pipeline = pipeline

    print(f"Selected Best Model: {best_model_name} (F1: {best_f1:.4f})")

    artifact_path = os.path.join(MODEL_DIR, "diabetes_model.joblib")
    joblib.dump(best_pipeline, artifact_path)

    metadata = {
        "disease": "Diabetes",
        "model_version": "1.0.0",
        "selected_algorithm": best_model_name,
        "features": {
            "numeric": numeric_features,
            "binary": binary_features,
            "all": feature_cols,
        },
        "target": "target (0: Low/No Risk, 1: High Risk)",
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "evaluation_metrics": results[best_model_name],
        "baseline_comparison": results,
    }

    meta_path = os.path.join(MODEL_DIR, "diabetes_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Model saved to {artifact_path}")
    print(f"Metadata saved to {meta_path}")
    return metadata


if __name__ == "__main__":
    train_diabetes_model()
