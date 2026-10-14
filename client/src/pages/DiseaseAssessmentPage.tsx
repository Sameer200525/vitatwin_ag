import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Stethoscope,
  Heart,
  Droplets,
  Zap,
  Activity,
  Brain,
  Scale,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { predictionService } from '../services/predictionService';
import { profileService } from '../services/profileService';
import { DiseaseAssessment, HealthProfile } from '../types';

export const DiseaseAssessmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialDisease = searchParams.get('disease') || 'heart';

  const [selectedDisease, setSelectedDisease] = useState<string>(initialDisease);
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [history, setHistory] = useState<DiseaseAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [result, setResult] = useState<any | null>(null);
  const [unifiedResults, setUnifiedResults] = useState<Record<string, any> | null>(null);

  // Form Fields customized by disease
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const p = await profileService.getProfile();
        setProfile(p);
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    loadProfile();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await predictionService.getHistory();
      setHistory(data.history);
    } catch (err) {
      console.error('Failed to load assessment history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const diseases = [
    { id: 'heart', name: 'Coronary Heart Disease', icon: Heart, color: 'text-rose-600 bg-rose-50' },
    { id: 'diabetes', name: 'Type 2 Diabetes', icon: Droplets, color: 'text-amber-600 bg-amber-50' },
    { id: 'hypertension', name: 'Hypertension', icon: Zap, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'kidney', name: 'Kidney Disease (CKD)', icon: Activity, color: 'text-teal-600 bg-teal-50' },
    { id: 'stroke', name: 'Cerebrovascular Stroke', icon: Brain, color: 'text-purple-600 bg-purple-50' },
    { id: 'obesity', name: 'Obesity & Body Phenotype', icon: Scale, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'all', name: 'Unified Twin Screening (All 6)', icon: Sparkles, color: 'text-sky-600 bg-sky-50' },
  ];

  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setUnifiedResults(null);

    try {
      if (selectedDisease === 'all') {
        const res = await predictionService.predictAll();
        setUnifiedResults(res.results);
      } else if (selectedDisease === 'heart') {
        const res = await predictionService.predictHeart(formData);
        setResult(res.result);
      } else if (selectedDisease === 'diabetes') {
        const res = await predictionService.predictDiabetes(formData);
        setResult(res.result);
      } else if (selectedDisease === 'hypertension') {
        const res = await predictionService.predictHypertension(formData);
        setResult(res.result);
      } else if (selectedDisease === 'kidney') {
        const res = await predictionService.predictKidney(formData);
        setResult(res.result);
      } else if (selectedDisease === 'stroke') {
        const res = await predictionService.predictStroke(formData);
        setResult(res.result);
      } else if (selectedDisease === 'obesity') {
        const res = await predictionService.predictObesity(formData);
        setResult(res.result);
      }
      fetchHistory();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error executing ML inference pipeline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Disease Risk Assessments Hub</h1>
        <p className="text-xs text-slate-500">
          Run machine-learning inference pipelines utilizing validated observational health indicators.
        </p>
      </div>

      {/* Disease Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {diseases.map((d) => {
          const Icon = d.icon;
          const isSelected = selectedDisease === d.id;
          return (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDisease(d.id);
                setResult(null);
                setUnifiedResults(null);
              }}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-1 ring-teal-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${d.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-semibold leading-tight ${isSelected ? 'text-teal-900' : 'text-slate-700'}`}>
                {d.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Run Assessment */}
        <div className="card-premium p-6 lg:col-span-1 space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-navy-900">
              {selectedDisease === 'all'
                ? 'Batch Twin Screening'
                : `${diseases.find((d) => d.id === selectedDisease)?.name} Model`}
            </h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            {selectedDisease === 'all'
              ? 'Automatically executes all 6 disease pipelines using your saved digital health twin profile.'
              : 'Biomarkers are pre-populated from your saved health profile. Adjust parameters below or run immediate inference.'}
          </p>

          <form onSubmit={handleRunAssessment} className="space-y-4">
            {profile && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Age:</span> <strong className="text-slate-800">{profile.age} yrs</strong>
                </div>
                <div className="flex justify-between">
                  <span>BMI:</span> <strong className="text-slate-800">{profile.bmi || 24} kg/m²</strong>
                </div>
                <div className="flex justify-between">
                  <span>Blood Pressure:</span> <strong className="text-slate-800">{profile.systolicBP || 120}/{profile.diastolicBP || 80} mmHg</strong>
                </div>
                <div className="flex justify-between">
                  <span>Glucose:</span> <strong className="text-slate-800">{profile.bloodGlucose || 95} mg/dL</strong>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Evaluating ML Pipeline...' : 'Run Risk Inference'}</span>
            </button>
          </form>

          {/* Model Ethics & Limitations */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong>Preventive Education Only:</strong> Model predictions reflect population risk probability based on trained datasets. Not a clinical diagnosis.
            </div>
          </div>
        </div>

        {/* Center / Right: Result Card */}
        <div className="card-premium p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-navy-900">Inference Output & Clinical Insights</h3>
            {result && (
              <span className="text-[11px] text-slate-400">Model Version: {result.model_version}</span>
            )}
          </div>

          {result ? (
            <div className="space-y-5">
              {/* Risk Score Hero */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-navy-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-teal-400 font-semibold uppercase tracking-wider block mb-1">
                    {result.disease} Assessment
                  </span>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-extrabold">{result.risk_percentage}%</span>
                    <span className="text-sm font-medium text-slate-300">Statistical Risk Tier:</span>
                    <span
                      className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${
                        result.risk_level.toLowerCase().includes('high') || result.risk_level.toLowerCase().includes('obese')
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : result.risk_level.toLowerCase().includes('mod') || result.risk_level.toLowerCase().includes('overweight')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {result.risk_level}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Certainty Metric</span>
                  <span className="text-xs font-semibold text-teal-300">{result.confidence_tier}</span>
                </div>
              </div>

              {/* Contributing Factors */}
              <div>
                <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Primary Contributing Biomarkers & Factors
                </h4>
                <div className="space-y-1.5">
                  {result.top_contributing_factors.map((factor: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-center space-x-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Note & Limitations */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p className="text-slate-800">
                  <strong>Clinical Note:</strong> {result.clinical_note}
                </p>
                <p className="text-slate-500 italic text-[11px]">
                  <strong>Disclaimer:</strong> {result.limitations_disclaimer}
                </p>
              </div>
            </div>
          ) : unifiedResults ? (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-navy-900">Multi-Model Screening Complete</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.keys(unifiedResults).map((k) => {
                  const r = unifiedResults[k];
                  return (
                    <div key={k} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-navy-900">{r.disease}</span>
                        <span className="text-xs font-extrabold text-teal-700">{r.risk_percentage}%</span>
                      </div>
                      <span className="text-[11px] text-slate-500 capitalize">{r.risk_level}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              <Activity className="w-10 h-10 mx-auto mb-2 opacity-40 text-teal-600" />
              <p>Select a disease and run inference to view calibrated predictions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Past Assessment History */}
      <div className="card-premium p-6">
        <h3 className="text-base font-bold text-navy-900 mb-4">Historical Risk Assessments</h3>
        {historyLoading ? (
          <div className="text-xs text-slate-400">Loading assessment history...</div>
        ) : history.length === 0 ? (
          <div className="text-xs text-slate-500 py-4 text-center">
            No previous assessments recorded yet. Run your first assessment above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4">Disease Assessed</th>
                  <th className="py-2.5 px-4">Calculated Risk</th>
                  <th className="py-2.5 px-4">Confidence Tier</th>
                  <th className="py-2.5 px-4">Model Version</th>
                  <th className="py-2.5 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((h) => (
                  <tr key={h._id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 capitalize">{h.disease}</td>
                    <td className="py-2.5 px-4 font-bold text-navy-900">
                      {h.riskPercentage}% ({h.riskLevel})
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{h.confidenceTier}</td>
                    <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">{h.modelVersion}</td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {new Date(h.createdAt).toLocaleDateString()} {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
