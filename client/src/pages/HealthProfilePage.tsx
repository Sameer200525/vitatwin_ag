import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Save,
  CheckCircle,
  AlertCircle,
  Scale,
  Heart,
  Droplets,
  Activity,
  Moon,
  Utensils,
  Shield,
} from 'lucide-react';
import { profileService } from '../services/profileService';
import { HealthProfile } from '../types';
import { useAuth } from '../hooks/useAuth';

export const HealthProfilePage: React.FC = () => {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<Partial<HealthProfile>>({
    age: 30,
    gender: 'Male',
    heightCm: 175,
    weightKg: 70,
    bmi: 22.9,
    systolicBP: 120,
    diastolicBP: 80,
    bloodGlucose: 95,
    heartRate: 72,
    cholesterol: 190,
    smokingStatus: 'never',
    physicalActivity: 'moderate',
    sleepDurationHours: 7,
    dietaryHabits: 'balanced',
    medicalHistory: {
      familyHeartDisease: false,
      familyDiabetes: false,
      familyHypertension: false,
      diagnosedConditions: [],
      allergies: [],
      currentMedications: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile();
        if (data) {
          setProfile(data);
        }
      } catch (err: any) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Real-time BMI calculation
  const handleDimensionChange = (field: 'heightCm' | 'weightKg', val: number) => {
    const updated = { ...profile, [field]: val };
    if (updated.heightCm && updated.weightKg) {
      const heightMeters = updated.heightCm / 100;
      updated.bmi = parseFloat((updated.weightKg / (heightMeters * heightMeters)).toFixed(1));
    }
    setProfile(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await profileService.updateProfile(profile);
      setProfile(res.profile);
      setMessage({ type: 'success', text: 'Health profile successfully updated and synchronised with your Digital Twin!' });
      await refreshUser();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update health profile. Please check your inputs.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card-premium p-8 animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="h-10 bg-slate-200 rounded w-full" />
        <div className="h-10 bg-slate-200 rounded w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Health Twin Profile</h1>
          <p className="text-xs text-slate-500">
            Maintain your baseline physiological characteristics and family medical indicators.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Synchronising...' : 'Save Profile Changes'}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-2.5 text-xs font-medium border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Demographics & Body Dimensions */}
        <div className="card-premium p-6 space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <Scale className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-navy-900">Demographics & Body Composition</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                min="1"
                max="120"
                required
                value={profile.age || ''}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Biological Sex</label>
              <select
                value={profile.gender || 'Male'}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                min="50"
                max="250"
                required
                value={profile.heightCm || ''}
                onChange={(e) => handleDimensionChange('heightCm', parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                min="20"
                max="250"
                required
                value={profile.weightKg || ''}
                onChange={(e) => handleDimensionChange('weightKg', parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Automatic BMI Result Box */}
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-teal-900">Calculated Body Mass Index (BMI)</span>
              <span className="text-[11px] text-teal-700">Calculated automatically from height and weight</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-teal-900">{profile.bmi || '--'}</span>
              <span className="block text-[11px] font-semibold text-teal-700">
                {profile.bmi
                  ? profile.bmi < 18.5
                    ? 'Underweight'
                    : profile.bmi < 25
                    ? 'Normal Weight'
                    : profile.bmi < 30
                    ? 'Overweight'
                    : 'Obesity'
                  : ''}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Baseline Physiological Biomarkers */}
        <div className="card-premium p-6 space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <Heart className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-navy-900">Baseline Physiological Biomarkers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                min="60"
                max="240"
                value={profile.systolicBP || ''}
                onChange={(e) => setProfile({ ...profile, systolicBP: parseInt(e.target.value) || 0 })}
                placeholder="120"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                min="40"
                max="150"
                value={profile.diastolicBP || ''}
                onChange={(e) => setProfile({ ...profile, diastolicBP: parseInt(e.target.value) || 0 })}
                placeholder="80"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fasting Glucose (mg/dL)
              </label>
              <input
                type="number"
                min="40"
                max="400"
                value={profile.bloodGlucose || ''}
                onChange={(e) => setProfile({ ...profile, bloodGlucose: parseInt(e.target.value) || 0 })}
                placeholder="95"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resting Heart Rate (bpm)
              </label>
              <input
                type="number"
                min="40"
                max="200"
                value={profile.heartRate || ''}
                onChange={(e) => setProfile({ ...profile, heartRate: parseInt(e.target.value) || 0 })}
                placeholder="72"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Serum Cholesterol (mg/dL)
              </label>
              <input
                type="number"
                min="80"
                max="500"
                value={profile.cholesterol || ''}
                onChange={(e) => setProfile({ ...profile, cholesterol: parseInt(e.target.value) || 0 })}
                placeholder="190"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Lifestyle & Behavioral Factors */}
        <div className="card-premium p-6 space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <Activity className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-navy-900">Lifestyle & Behavioral Patterns</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tobacco Smoking</label>
              <select
                value={profile.smokingStatus || 'never'}
                onChange={(e) => setProfile({ ...profile, smokingStatus: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              >
                <option value="never">Never Smoked</option>
                <option value="former">Former Smoker</option>
                <option value="current">Current Smoker</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Activity</label>
              <select
                value={profile.physicalActivity || 'moderate'}
                onChange={(e) => setProfile({ ...profile, physicalActivity: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              >
                <option value="sedentary">Sedentary (&lt; 30 min/week)</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate (150 min/week)</option>
                <option value="active">Active (Vigorous)</option>
                <option value="very_active">Very Active (Athlete)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sleep Duration (hrs)</label>
              <input
                type="number"
                step="0.5"
                min="3"
                max="14"
                value={profile.sleepDurationHours || ''}
                onChange={(e) => setProfile({ ...profile, sleepDurationHours: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dietary Pattern</label>
              <select
                value={profile.dietaryHabits || 'balanced'}
                onChange={(e) => setProfile({ ...profile, dietaryHabits: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              >
                <option value="balanced">Balanced Whole Foods</option>
                <option value="mediterranean">Mediterranean Pattern</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Plant-Based / Vegan</option>
                <option value="high_sugar_fast_food">Processed / High Sugar</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Relevant Family History */}
        <div className="card-premium p-6 space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-navy-900">Family Medical Predisposition</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={Boolean(profile.medicalHistory?.familyHeartDisease)}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    medicalHistory: {
                      ...profile.medicalHistory!,
                      familyHeartDisease: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-800">Family Heart Disease History</span>
            </label>

            <label className="flex items-center space-x-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={Boolean(profile.medicalHistory?.familyDiabetes)}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    medicalHistory: {
                      ...profile.medicalHistory!,
                      familyDiabetes: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-800">Family Type 2 Diabetes History</span>
            </label>

            <label className="flex items-center space-x-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={Boolean(profile.medicalHistory?.familyHypertension)}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    medicalHistory: {
                      ...profile.medicalHistory!,
                      familyHypertension: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-800">Family Hypertension History</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
