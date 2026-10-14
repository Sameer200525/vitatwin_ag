from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


# Prediction Response Schema
class RiskPredictionResult(BaseModel):
    disease: str
    risk_level: str  # "Low", "Moderate", "High", or Category Name
    probability: float  # 0.0 to 1.0
    risk_percentage: float  # 0.0 to 100.0%
    confidence_tier: str  # e.g., "High Confidence", "Moderate Confidence"
    predicted_class: int | str
    top_contributing_factors: List[str] = []
    clinical_note: str
    limitations_disclaimer: str
    model_version: str = "1.0.0"


# 1. Heart Disease Input
class HeartInput(BaseModel):
    age: float = Field(..., ge=1, le=120, description="Age in years")
    sex: str = Field("Male", description="'Male' or 'Female'")
    cp: str = Field("typical angina", description="Chest pain type: 'typical angina', 'atypical angina', 'non-anginal', 'asymptomatic'")
    trestbps: Optional[float] = Field(120.0, ge=60, le=260, description="Resting blood pressure (mm Hg)")
    chol: Optional[float] = Field(200.0, ge=80, le=600, description="Serum cholesterol (mg/dl)")
    fbs: Optional[str] = Field("FALSE", description="Fasting blood sugar > 120 mg/dl ('TRUE' or 'FALSE')")
    restecg: Optional[str] = Field("normal", description="Resting ECG: 'normal', 'st-t abnormality', 'lv hypertrophy'")
    thalch: Optional[float] = Field(150.0, ge=50, le=220, description="Maximum heart rate achieved")
    exang: Optional[str] = Field("FALSE", description="Exercise induced angina ('TRUE' or 'FALSE')")
    oldpeak: Optional[float] = Field(0.0, ge=0.0, le=10.0, description="ST depression induced by exercise relative to rest")
    slope: Optional[str] = Field("upsloping", description="Slope of peak exercise ST segment: 'upsloping', 'flat', 'downsloping'")


# 2. Diabetes Input
class DiabetesInput(BaseModel):
    HighBP: int = Field(0, ge=0, le=1, description="High Blood Pressure (0=No, 1=Yes)")
    HighChol: int = Field(0, ge=0, le=1, description="High Cholesterol (0=No, 1=Yes)")
    CholCheck: int = Field(1, ge=0, le=1, description="Cholesterol checked in past 5 years (0=No, 1=Yes)")
    BMI: float = Field(25.0, ge=10.0, le=70.0, description="Body Mass Index")
    Smoker: int = Field(0, ge=0, le=1, description="Smoked at least 100 cigarettes (0=No, 1=Yes)")
    Stroke: int = Field(0, ge=0, le=1, description="History of Stroke (0=No, 1=Yes)")
    HeartDiseaseorAttack: int = Field(0, ge=0, le=1, description="Coronary Heart Disease or Myocardial Infarction (0=No, 1=Yes)")
    PhysActivity: int = Field(1, ge=0, le=1, description="Physical activity in past 30 days (0=No, 1=Yes)")
    Fruits: int = Field(1, ge=0, le=1, description="Consumes fruit 1+ times per day (0=No, 1=Yes)")
    Veggies: int = Field(1, ge=0, le=1, description="Consumes vegetables 1+ times per day (0=No, 1=Yes)")
    HvyAlcoholConsump: int = Field(0, ge=0, le=1, description="Heavy alcohol consumption (0=No, 1=Yes)")
    GenHlth: int = Field(2, ge=1, le=5, description="General health rating (1=Excellent, 5=Poor)")
    MentHlth: int = Field(0, ge=0, le=30, description="Days of poor mental health in past 30 days")
    PhysHlth: int = Field(0, ge=0, le=30, description="Days of poor physical health in past 30 days")
    DiffWalk: int = Field(0, ge=0, le=1, description="Difficulty walking or climbing stairs (0=No, 1=Yes)")
    Sex: int = Field(1, ge=0, le=1, description="0=Female, 1=Male")
    Age: int = Field(5, ge=1, le=13, description="Age category (1=18-24, ..., 9=60-64, 13=80+)")


# 3. Hypertension Input
class HypertensionInput(BaseModel):
    Age: float = Field(..., ge=18, le=100)
    BMI: float = Field(24.5, ge=12.0, le=60.0)
    Systolic_BP: float = Field(120.0, ge=70.0, le=240.0)
    Diastolic_BP: float = Field(80.0, ge=40.0, le=150.0)
    Heart_Rate: float = Field(72.0, ge=40.0, le=180.0)
    Glucose: float = Field(95.0, ge=50.0, le=400.0)
    Cholesterol: float = Field(190.0, ge=100.0, le=450.0)
    Sleep_Duration: float = Field(7.0, ge=2.0, le=16.0)
    Smoking_Status: str = Field("Never", description="'Never', 'Former', or 'Current'")
    Alcohol_Intake: float = Field(0.0, ge=0.0, le=30.0, description="Dataset alcohol-intake value (0-30)")
    Physical_Activity_Level: str = Field("Moderate", description="'Low', 'Moderate', 'High'")
    Family_History: str = Field("No", description="'Yes' or 'No'")
    Stress_Level: float = Field(5.0, ge=1.0, le=9.0, description="Dataset stress level (1-9)")
    Gender: str = Field("Male", description="'Male' or 'Female'")


# 4. Stroke Input
class StrokeInput(BaseModel):
    gender: str = Field("Male", description="'Male' or 'Female'")
    age: float = Field(..., ge=1, le=110)
    hypertension: int = Field(0, ge=0, le=1)
    heart_disease: int = Field(0, ge=0, le=1)
    ever_married: str = Field("Yes", description="'Yes' or 'No'")
    work_type: str = Field("Private", description="'Private', 'Self-employed', 'Govt_job', 'children', 'Never_worked'")
    Residence_type: str = Field("Urban", description="'Urban' or 'Rural'")
    avg_glucose_level: float = Field(90.0, ge=40.0, le=350.0)
    bmi: Optional[float] = Field(25.0, ge=10.0, le=70.0)
    smoking_status: str = Field("never smoked", description="'formerly smoked', 'never smoked', 'smokes', 'Unknown'")


# 5. Kidney Disease Input
class KidneyInput(BaseModel):
    age: Optional[float] = Field(50.0, ge=1, le=110)
    bp: Optional[float] = Field(80.0, ge=40, le=200)
    sg: Optional[float] = Field(1.020, ge=1.000, le=1.035, description="Specific Gravity")
    al: Optional[float] = Field(0.0, ge=0.0, le=5.0, description="Albumin level")
    su: Optional[float] = Field(0.0, ge=0.0, le=5.0, description="Sugar level")
    rbc: Optional[str] = Field("normal", description="'normal' or 'abnormal'")
    pc: Optional[str] = Field("normal", description="'normal' or 'abnormal'")
    pcc: Optional[str] = Field("notpresent", description="'present' or 'notpresent'")
    ba: Optional[str] = Field("notpresent", description="'present' or 'notpresent'")
    bgr: Optional[float] = Field(110.0, ge=50, le=500, description="Blood glucose random")
    bu: Optional[float] = Field(35.0, ge=5, le=400, description="Blood urea")
    sc: Optional[float] = Field(1.0, ge=0.1, le=20.0, description="Serum creatinine")
    sod: Optional[float] = Field(138.0, ge=100, le=180, description="Sodium")
    pot: Optional[float] = Field(4.2, ge=2.0, le=10.0, description="Potassium")
    hemo: Optional[float] = Field(14.5, ge=3.0, le=20.0, description="Hemoglobin")
    pcv: Optional[float] = Field(42.0, ge=10, le=60, description="Packed cell volume")
    wc: Optional[float] = Field(7800.0, ge=1000, le=30000, description="White blood cell count")
    rc: Optional[float] = Field(5.0, ge=1.0, le=10.0, description="Red blood cell count")
    htn: Optional[str] = Field("no", description="'yes' or 'no'")
    dm: Optional[str] = Field("no", description="'yes' or 'no'")
    cad: Optional[str] = Field("no", description="'yes' or 'no'")
    appet: Optional[str] = Field("good", description="'good' or 'poor'")
    pe: Optional[str] = Field("no", description="'yes' or 'no' - pedal edema")
    ane: Optional[str] = Field("no", description="'yes' or 'no' - anemia")


# 6. Obesity Input
class ObesityInput(BaseModel):
    Gender: str = Field("Male", description="'Male' or 'Female'")
    Age: float = Field(25.0, ge=12, le=90)
    Height: float = Field(1.75, ge=1.0, le=2.5, description="Height in meters")
    Weight: float = Field(70.0, ge=30, le=250, description="Weight in kg")
    family_history_with_overweight: str = Field("yes", description="'yes' or 'no'")
    FAVC: str = Field("yes", description="Frequent consumption of high caloric food: 'yes' or 'no'")
    FCVC: float = Field(2.0, ge=1.0, le=3.0, description="Frequency of consumption of vegetables")
    NCP: float = Field(3.0, ge=1.0, le=4.0, description="Number of main meals")
    CAEC: str = Field("Sometimes", description="Consumption of food between meals: 'no', 'Sometimes', 'Frequently', 'Always'")
    SMOKE: str = Field("no", description="'yes' or 'no'")
    CH2O: float = Field(2.0, ge=1.0, le=3.0, description="Daily water consumption (liters)")
    SCC: str = Field("no", description="Calories consumption monitoring: 'yes' or 'no'")
    FAF: float = Field(1.0, ge=0.0, le=3.0, description="Physical activity frequency")
    TUE: float = Field(1.0, ge=0.0, le=2.0, description="Time using technology devices (hours)")
    CALC: str = Field("Sometimes", description="Consumption of alcohol: 'no', 'Sometimes', 'Frequently'")
    MTRANS: str = Field("Public_Transportation", description="'Automobile', 'Bike', 'Motorbike', 'Public_Transportation', 'Walking'")


# Unified Digital Twin Assessment Input
class UnifiedTwinAssessmentInput(BaseModel):
    # Nested disease-specific inputs preserve provenance: omitted fields remain missing.
    heart: Optional[HeartInput] = None
    diabetes: Optional[DiabetesInput] = None
    hypertension: Optional[HypertensionInput] = None
    stroke: Optional[StrokeInput] = None
    kidney: Optional[KidneyInput] = None
    obesity: Optional[ObesityInput] = None
