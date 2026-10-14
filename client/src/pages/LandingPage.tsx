import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Heart,
  Droplets,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Brain,
  Scale,
  Lock,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const diseases = [
    {
      title: 'Coronary Heart Disease',
      desc: 'Evaluates resting BP, cholesterol, ECG, ST depression, and exertion metrics.',
      icon: Heart,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      title: 'Type 2 Diabetes',
      desc: 'Monitors glycaemic indicators, high blood pressure, physical activity, and BMI.',
      icon: Droplets,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      title: 'Arterial Hypertension',
      desc: 'Predicts high vascular pressure from hemodynamics, sleep, stress, and lifestyle.',
      icon: Zap,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Chronic Kidney Disease',
      desc: 'Screens renal filtration biomarkers, specific gravity, albuminuria, and serum creatinine.',
      icon: Activity,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
    },
    {
      title: 'Cerebrovascular Stroke',
      desc: 'Analyzes age distribution, glucose levels, vascular history, and tobacco habits.',
      icon: Brain,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      title: 'Obesity & Body Phenotype',
      desc: 'Predicts 7 body mass categories from nutritional caloric density and physical activity.',
      icon: Scale,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Continuous Biomarker Ingestion',
      desc: 'Log clinical measurements including blood pressure, glucose, heart rate, sleep, and lifestyle habits.',
    },
    {
      step: '02',
      title: 'Digital Twin Synchronisation',
      desc: 'Your virtual twin continuously maps multi-dimensional physiological signals to population epidemiological baselines.',
    },
    {
      step: '03',
      title: 'Multi-Disease Risk Inference',
      desc: 'Six dedicated machine learning models compute calibrated probability tiers and identify primary risk drivers.',
    },
    {
      step: '04',
      title: 'Actionable Preventive Interventions',
      desc: 'Receive transparent, rule-based lifestyle guidelines and longitudinal forecasting to prevent chronic onset.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center shadow-md shadow-teal-700/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-navy-900 tracking-tight">VitaTwin</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-semibold bg-teal-50 text-teal-700 rounded-full border border-teal-200">
                Preventive Health AI
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-teal-700 px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-teal-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <Stethoscope className="w-4 h-4" />
              <span>Next-Generation Preventive Medicine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
              Understand Your Health. <br />
              <span className="text-teal-600">Predict Risks.</span> Take Control.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              VitaTwin creates a dynamic, data-driven virtual health replica using your vital measurements and lifestyle biomarkers. Powered by 6 trained machine learning pipelines, it forecasts chronic disease risks before clinical symptoms develop.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>Create Your Digital Twin</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all"
              >
                Explore Live Demo
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-xs font-medium text-slate-700">6 Specialized ML Models</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-xs font-medium text-slate-700">Zero Fabricated Numbers</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-xs font-medium text-slate-700">Longitudinal Trend Forecaster</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-xs font-medium text-slate-700">Strict Data Privacy & Isolation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disease Prediction Categories */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-navy-900 tracking-tight">
              Six Independent Clinical Prediction Pipelines
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Each pipeline is independently trained on real population health cohorts with dedicated preprocessing, validation, and explainability metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diseases.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.title}
                  className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-teal-300 hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${d.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-teal-700 transition-colors">
                    {d.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How the Digital Twin Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-widest block mb-2">
              Architecture Overview
            </span>
            <h2 className="text-3xl font-bold text-navy-900 tracking-tight">
              How Your Digital Twin Works
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              A continuous feedback loop linking your physiological measurements with calibrated machine learning pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm relative">
                <span className="text-3xl font-extrabold text-teal-500/20 block mb-3">{s.step}</span>
                <h4 className="text-base font-bold text-navy-900 mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy and Responsible AI */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-6 text-teal-400">
              <Lock className="w-7 h-7" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Privacy-First & Responsible AI Architecture
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-8">
              Healthcare data is deeply personal. VitaTwin enforces strict tenant isolation, cryptographic bcrypt hashing, and secure HTTP-only cookies. Model predictions provide probability-calibrated lifestyle insights, never false reassurance or automated clinical prescriptions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <h4 className="font-semibold text-teal-300 text-sm mb-1">Zero Data Bleed</h4>
                <p className="text-xs text-slate-400">
                  Every database operation explicitly scopes ownership to the verified user token.
                </p>
              </div>
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <h4 className="font-semibold text-teal-300 text-sm mb-1">Explainable Reasoning</h4>
                <p className="text-xs text-slate-400">
                  Transparent feature contributions and clinical indicators accompany every inference score.
                </p>
              </div>
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <h4 className="font-semibold text-teal-300 text-sm mb-1">Clinical Disclaimers</h4>
                <p className="text-xs text-slate-400">
                  Clearly distinguished educational guidance designed to augment, not replace, doctor consultations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              VT
            </div>
            <span className="font-semibold text-white">VitaTwin Platform</span>
          </div>

          <p className="text-xs text-slate-500 text-center md:text-left">
            VitaTwin — AI-Powered Digital Twin for Preventive Healthcare. Built with MERN + FastAPI ML inference.
          </p>

          <div className="flex items-center space-x-6 text-xs">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
