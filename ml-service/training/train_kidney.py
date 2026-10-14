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
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "kidney_disease.csv")


def clean_string_series(series):
    return series.astype(str).str.strip().str.replace("\t", "", regex=False)


def train_kidney_model():
    print("=== Training Chronic Kidney Disease (CKD) Model ===")
    os.makedirs(MODEL_DIR, exist_ok=True)

    df = pd.read_csv(DATA_PATH)
    print(f"Loaded raw dataset shape: {df.shape}")

    # Clean target
    clean_target = clean_string_series(df["classification"])
    df["target"] = (clean_target == "ckd").astype(int)

    # Clean numeric columns with potential string anomalies
    numeric_features = [
        "age",
        "bp",
        "sg",
        "al",
        "su",
        "bgr",
        "bu",
        "sc",
        "sod",
        "pot",
        "hemo",
        "pcv",
        "wc",
        "rc",
    ]

    for col in numeric_features:
        if col in df.columns:
            df[col] = pd.to_numeric(clean_string_series(df[col]), errors="coerce")

    # Categorical features
    categorical_features = [
        "rbc",
        "pc",
        "pcc",
        "ba",
        "htn",
        "dm",
        "cad",
        "appet",
        "pe",
        "ane",
    ]

    for col in categorical_features:
        if col in df.columns:
            df[col] = clean_string_series(df[col])
            df[col] = df[col].replace({"nan": np.nan, "?": np.nan})

    feature_cols = numeric_features + categorical_features
    X = df[feature_cols].copy()
    y = df["target"].values

    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features),
        ]
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    models = {
        "LogisticRegression": LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42),
        "DecisionTree": DecisionTreeClassifier(max_depth=5, class_weight="balanced", random_state=42),
        "RandomForest": RandomForestClassifier(n_estimators=100, max_depth=6, class_weight="balanced", random_state=42),
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

    artifact_path = os.path.join(MODEL_DIR, "kidney_disease_model.joblib")
    joblib.dump(best_pipeline, artifact_path)

    metadata = {
        "disease": "Chronic Kidney Disease",
        "model_version": "1.0.0",
        "selected_algorithm": best_model_name,
        "features": {
            "numeric": numeric_features,
            "categorical": categorical_features,
            "all": feature_cols,
        },
        "target": "classification (0: No CKD, 1: CKD Present)",
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "evaluation_metrics": results[best_model_name],
        "baseline_comparison": results,
    }

    meta_path = os.path.join(MODEL_DIR, "kidney_disease_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Model saved to {artifact_path}")
    print(f"Metadata saved to {meta_path}")
    return metadata


if __name__ == "__main__":
    train_kidney_model()
