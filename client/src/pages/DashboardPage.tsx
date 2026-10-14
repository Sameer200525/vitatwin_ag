import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Heart,
  Droplets,
  Zap,
  TrendingUp,
  Brain,
  Scale,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { summaryService, DashboardData } from '../services/summaryService';
import { useAuth } from '../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90' | 'all'>('30');
  const [selectedChartMetric, setSelectedChartMetric] = useState<'blood_pressure' | 'glucose' | 'heart_rate' | 'weight'>('blood_pressure');

  const fetchDashboard = async (days: string) => {
    setLoading(true);
    try {
      const res = await summaryService.getDashboardSummary(days);
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(timeFilter);
  }, [timeFilter]);

  // Format chart data from historical measurements
  const chartData = (data?.historicalMeasurements || [])
    .filter((m) => m.type === selectedChartMetric)
    .map((m) => ({
      date: new Date(m.recordedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: m.value,
      secondary: m.secondaryValue,
    }));

  const getRiskBadge = (riskLevel?: string, percentage?: number) => {
    if (!riskLevel) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
          Not Assessed
        </span>
      );
    }
    const level = riskLevel.toLowerCase();
    if (level.includes('high') || level.includes('obese')) {
      return <span className="badge-high">High Risk ({percentage}%)</span>;
    }
    if (level.includes('mod') || level.includes('overweight')) {
      return <span className="badge-moderate">Moderate ({percentage}%)</span>;
    }
    return <span className="badge-low">Low Risk ({percentage}%)</span>;
  };

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const twin = data?.twinSummary;
  const assessments = twin?.latestAssessments || {};

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Welcome & Completeness Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-navy-900 via-slate-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Digital Twin Active State</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Patient'}
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Your physiological twin is synchronized. Track daily biomarkers and run calibrated AI assessments to proactively prevent chronic illnesses.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/measurements"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-xl shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Measurement</span>
              </Link>
              <Link
                to="/assessments"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs rounded-xl transition-all"
              >
                <Activity className="w-4 h-4" />
                <span>Run Disease Screening</span>
              </Link>
            </div>
          </div>

          {/* Completeness & Readiness Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-xl shrink-0 min-w-[260px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-300 font-medium">Profile Completeness</span>
              <span className="text-sm font-bold text-teal-300">{twin?.completenessPercentage || 0}%</span>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-2 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-400 to-teal-300 h-2 rounded-full transition-all duration-500"
                style={{ width: `${twin?.completenessPercentage || 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div>
                <span className="block text-[11px] text-slate-400">Health Readiness Index</span>
                <span className="text-lg font-bold text-white leading-none">
                  {twin?.healthReadinessIndex || 85} / 100
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {twin?.readinessTier || 'Optimal'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Six Machine Learning Disease Risk Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-navy-900 tracking-tight">
              Calibrated Disease Risk Profiles
            </h2>
            <p className="text-xs text-slate-500">
              Generated by independent machine learning pipelines trained on observational cohorts.
            </p>
          </div>
          <Link
            to="/assessments"
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center space-x-1"
          >
            <span>Assessments Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Heart Disease */}
          <div className="card-premium p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">Heart Disease</h3>
                    <span className="text-[11px] text-slate-400">Cardiovascular Risk</span>
                  </div>
                </div>
                {getRiskBadge(assessments.heart?.riskLevel, assessments.heart?.riskPercentage)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Resting pressure, ST-segment depression, and cholesterol profile.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Model: Random Forest</span>
              <Link to="/assessments?disease=heart" className="font-semibold text-teal-600 hover:underline">
                Recalculate →
              </Link>
            </div>
          </div>

          {/* Diabetes */}
          <div className="card-premium p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">Type 2 Diabetes</h3>
                    <span className="text-[11px] text-slate-400">Metabolic Risk</span>
                  </div>
                </div>
                {getRiskBadge(assessments.diabetes?.riskLevel, assessments.diabetes?.riskPercentage)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Glycaemic indicators, body mass index, and lifestyle activity.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Model: Random Forest</span>
              <Link to="/assessments?disease=diabetes" className="font-semibold text-teal-600 hover:underline">
                Recalculate →
              </Link>
            </div>
          </div>

          {/* Hypertension */}
          <div className="card-premium p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">Hypertension</h3>
                    <span className="text-[11px] text-slate-400">Vascular Pressure</span>
                  </div>
                </div>
                {getRiskBadge(assessments.hypertension?.riskLevel, assessments.hypertension?.riskPercentage)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Systolic/diastolic hemodynamics, sleep length, and stress factors.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Model: Logistic Regression</span>
              <Link to="/assessments?disease=hypertension" className="font-semibold text-teal-600 hover:underline">
                Recalculate →
              </Link>
            </div>
          </div>

          {/* Chronic Kidney Disease */}
          <div className="card-premium p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">Kidney Disease</h3>
                    <span className="text-[11px] text-slate-400">Renal Filtration</span>
                  </div>
                </div>
                {getRiskBadge(assessments.kidney?.riskLevel, assessments.kidney?.riskPercentage)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Serum creatinine, specific gravity, urine albumin, and blood urea.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Model: Random Forest</span>
              <Link to="/assessments?disease=kidney" className="font-semibold text-teal-600 hover:underline">
                Recalculate →
              </Link>
            </div>
          </div>

          {/* Stroke */}
          <div className="card-premium p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">Stroke Risk</h3>
                    <span className="text-[11px] text-slate-400">Cerebrovascular Index</span>
                  </div>
                </div>
                {getRiskBadge(assessments.stroke?.riskLevel, assessments.stroke?.riskPercentage)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Age stratification, serum glucose levels, and smoking status.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Model: Logistic Regression</span>
              <Link to="/assessments?disease=stroke" className="font-semibold text-teal-600 hover:underline">
                Recalculate →
              </Link>
            </div>
          </div>

          {/* Obesity */}
          <div className="card-premium p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">Obesity Level</h3>
                    <span className="text-[11px] text-slate-400">Body Phenotype</span>
                  </div>
                </div>
                {getRiskBadge(assessments.obesity?.riskLevel, assessments.obesity?.riskPercentage)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Multi-class weight category based on dietary calories and movement.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Model: Random Forest (7-class)</span>
              <Link to="/assessments?disease=obesity" className="font-semibold text-teal-600 hover:underline">
                Recalculate →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Physiological Biomarkers & Historical Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Physiological Measurements Panel */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-navy-900">Latest Vital Biomarkers</h3>
            <Link to="/profile" className="text-xs font-semibold text-teal-600 hover:underline">
              Edit Profile
            </Link>
          </div>

          <div className="space-y-3.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="block text-xs text-slate-500">Blood Pressure</span>
                <span className="text-base font-bold text-navy-900">{twin?.latestVitals?.bloodPressure || '120/80 mmHg'}</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="block text-xs text-slate-500">Fasting Glucose</span>
                <span className="text-base font-bold text-navy-900">{twin?.latestVitals?.glucose || '95 mg/dL'}</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="block text-xs text-slate-500">Resting Heart Rate</span>
                <span className="text-base font-bold text-navy-900">{twin?.latestVitals?.heartRate || '72 bpm'}</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="block text-xs text-slate-500">Calculated BMI</span>
                <span className="text-base font-bold text-navy-900">{twin?.latestVitals?.bmi || '23.5 kg/m²'}</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="block text-xs text-slate-500">Sleep Duration</span>
                <span className="text-base font-bold text-navy-900">{twin?.latestVitals?.sleep || '7.0 hrs/night'}</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            </div>
          </div>
        </div>

        {/* Historical Health Trends Recharts Area Chart */}
        <div className="card-premium p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-navy-900">Historical Health Trends</h3>
                <p className="text-xs text-slate-500">Longitudinal physiological biomarker tracking</p>
              </div>

              {/* Metric and Time Range Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedChartMetric}
                  onChange={(e) => setSelectedChartMetric(e.target.value as any)}
                  className="text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="blood_pressure">Blood Pressure</option>
                  <option value="glucose">Glucose (mg/dL)</option>
                  <option value="heart_rate">Heart Rate (bpm)</option>
                  <option value="weight">Weight (kg)</option>
                </select>

                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
                  {(['7', '30', '90', 'all'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        timeFilter === filter
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filter === 'all' ? 'All' : `${filter}d`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recharts Chart Area */}
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0d9488"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#metricGrad)"
                      name="Primary Value"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <TrendingUp className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No chart data in this date range</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                    Log new measurements on the Tracking page to build your historical trend line.
                  </p>
                  <Link
                    to="/measurements"
                    className="mt-3 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    + Add Measurement
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Filtered time window: {timeFilter === 'all' ? 'Complete history' : `Last ${timeFilter} days`}</span>
            <Link to="/forecasting" className="font-semibold text-teal-600 hover:underline">
              View Future 30-Day Forecast →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Active Recommendations & Quick Actions */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-navy-900">Educational Guidance & Lifestyle Interventions</h3>
            <p className="text-xs text-slate-500">
              Rule-based recommendations triggered directly by your recorded health factors.
            </p>
          </div>
          <Link
            to="/recommendations"
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center space-x-1"
          >
            <span>All Recommendations</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recommendations && data.recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.recommendations.slice(0, 4).map((rec) => (
              <div
                key={rec._id}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {rec.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Trigger: {rec.triggeredBy}</span>
                </div>
                <h4 className="text-sm font-bold text-navy-900 mb-1">{rec.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{rec.message}</p>
                <p className="text-[11px] text-slate-500 italic">Rationale: {rec.rationale}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500">
            No active triggers. Update your health profile or log measurements to generate lifestyle guidance.
          </div>
        )}
      </div>
    </div>
  );
};
