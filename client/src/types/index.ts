export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface MedicalHistory {
  familyHeartDisease: boolean;
  familyDiabetes: boolean;
  familyHypertension: boolean;
  diagnosedConditions: string[];
  allergies: string[];
  currentMedications: string[];
}

export interface HealthProfile {
  _id?: string;
  userId: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  heightCm: number;
  weightKg: number;
  bmi?: number;
  systolicBP?: number;
  diastolicBP?: number;
  bloodGlucose?: number;
  heartRate?: number;
  cholesterol?: number;
  smokingStatus: 'never' | 'former' | 'current';
  physicalActivity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  sleepDurationHours: number;
  dietaryHabits: string;
  medicalHistory?: MedicalHistory;
  updatedAt?: string;
}

export type MeasurementType =
  | 'blood_pressure'
  | 'heart_rate'
  | 'glucose'
  | 'weight'
  | 'height'
  | 'bmi'
  | 'sleep_duration'
  | 'activity'
  | 'cholesterol'
  | 'steps'
  | 'smoking'
  | 'alcohol_intake'
  | 'water_intake'
  | 'body_temperature'
  | 'oxygen_saturation'
  | 'stress_level'
  | 'mood'
  | 'calories_burned';

export interface HealthMeasurement {
  _id: string;
  userId: string;
  type: MeasurementType;
  value: number;
  secondaryValue?: number;
  unit: string;
  notes?: string;
  recordedAt: string;
}

export interface DiseaseAssessment {
  _id: string;
  userId: string;
  disease: 'heart' | 'diabetes' | 'hypertension' | 'kidney' | 'stroke' | 'obesity';
  riskLevel: string;
  probability: number;
  riskPercentage: number;
  confidenceTier: string;
  predictedClass?: string | number;
  topContributingFactors: string[];
  clinicalNote: string;
  limitationsDisclaimer: string;
  modelVersion: string;
  createdAt: string;
}

export interface Recommendation {
  _id: string;
  category: 'physical_activity' | 'nutrition' | 'sleep' | 'weight_management' | 'routine_monitoring' | 'medical_consultation';
  title: string;
  message: string;
  rationale: string;
  triggeredBy: string;
  priority: 'info' | 'moderate' | 'high' | 'urgent';
  isDismissed: boolean;
  createdAt: string;
}

export interface ForecastPoint {
  targetDate: string;
  daysAhead: number;
  predictedValue: number;
  lowerBound: number;
  upperBound: number;
}

export interface ForecastResult {
  sufficientData: boolean;
  message?: string;
  historicalCount?: number;
  historicalPoints: Array<{
    date: string;
    value: number;
    secondaryValue?: number;
    unit?: string;
  }>;
  forecastPoints: ForecastPoint[];
  trendDirection: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data';
  slopePerDay?: number;
  residualStandardError?: number;
  methodology: string;
  horizonDays?: number;
}

export interface TwinSummary {
  completenessPercentage: number;
  completenessBreakdown: Array<{ name: string; present: boolean }>;
  healthReadinessIndex: number;
  readinessTier: string;
  pillars: Array<{ name: string; score: number; status: string }>;
  latestVitals: {
    bloodPressure: string;
    glucose: string;
    heartRate: string;
    bmi: string;
    sleep: string;
  };
  latestAssessments: Record<string, {
    disease: string;
    riskLevel: string;
    probability: number;
    riskPercentage: number;
    assessedAt: string;
  }>;
  evaluatedAt: string;
}
