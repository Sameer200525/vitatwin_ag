import os
import json
import time
from train_heart import train_heart_model
from train_diabetes import train_diabetes_model
from train_hypertension import train_hypertension_model
from train_stroke import train_stroke_model
from train_kidney import train_kidney_model
from train_obesity import train_obesity_model


def main():
    print("==================================================")
    print("VitaTwin Machine Learning Model Training Pipeline")
    print("Training 6 Independent Clinical Disease Risk Models")
    print("==================================================")
    start_time = time.time()

    reports = {}
    reports["heart"] = train_heart_model()
    reports["diabetes"] = train_diabetes_model()
    reports["hypertension"] = train_hypertension_model()
    reports["stroke"] = train_stroke_model()
    reports["kidney"] = train_kidney_model()
    reports["obesity"] = train_obesity_model()

    summary_path = os.path.join(os.path.dirname(__file__), "..", "models", "evaluation_summary.json")
    with open(summary_path, "w") as f:
        json.dump(reports, f, indent=2)

    elapsed = time.time() - start_time
    print("==================================================")
    print(f"All 6 models trained and verified in {elapsed:.2f} seconds!")
    print(f"Summary report written to {summary_path}")
    print("==================================================")


if __name__ == "__main__":
    main()
