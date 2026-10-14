import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { forecastService } from '../services/forecastService';
import { ForecastResult } from '../types';

export const ForecastingPage: React.FC = () => {
  const [metric, setMetric] = useState<string>('blood_pressure');
  const [horizonDays, setHorizonDays] = useState<number>(30);
  const [data, setData] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await forecastService.getForecast(metric, horizonDays);
      setData(res);
    } catch (err) {
      console.error('Failed to load forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [metric, horizonDays]);

  // Combine historical and forecast points into continuous chart timeline
  const chartPoints: any[] = [];

  if (data?.sufficientData) {
    (data.historicalPoints || []).forEach((h) => {
      chartPoints.push({
        date: new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        actual: h.value,
        predicted: null,
        lowerBound: null,
        upperBound: null,
      });
    });

    (data.forecastPoints || []).forEach((f) => {
      chartPoints.push({
        date: new Date(f.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        actual: null,
        predicted: f.predictedValue,
        lowerBound: f.lowerBound,
        upperBound: f.upperBound,
      });
    });
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            Longitudinal Health Forecasting
          </h1>
          <p className="text-xs text-slate-500">
            Explainable trajectory projections with 95% statistical confidence intervals.
          </p>
        </div>

        {/* Metric & Horizon Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="blood_pressure">Systolic Blood Pressure (mmHg)</option>
            <option value="glucose">Blood Glucose (mg/dL)</option>
            <option value="weight">Body Weight (kg)</option>
            <option value="heart_rate">Resting Heart Rate (bpm)</option>
            <option value="sleep_duration">Sleep Duration (hrs)</option>
          </select>

          <select
            value={horizonDays}
            onChange={(e) => setHorizonDays(parseInt(e.target.value))}
            className="text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value={14}>14-Day Horizon</option>
            <option value={30}>30-Day Horizon</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card-premium p-12 text-center text-xs text-slate-400 animate-pulse">
          Calculating longitudinal trajectory...
        </div>
      ) : !data?.sufficientData ? (
        /* Informative Empty State for Insufficient Longitudinal History */
        <div className="card-premium p-10 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-navy-900">
            Insufficient Longitudinal History
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {data?.message ||
              'At least 3 distinct historical readings recorded across different days are required to calculate an explainable trajectory regression without fabricating data.'}
          </p>
          <div className="pt-2">
            <Link
              to="/measurements"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Measurements for this Metric</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Trajectory Forecast Chart and Explanation */
        <div className="space-y-6">
          <div className="card-premium p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-navy-900 capitalize">
                  {metric.replace('_', ' ')} Trajectory Projection
                </h3>
                <span className="text-xs text-slate-500">
                  Methodology: {data.methodology}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <span className="text-slate-500">Historical Samples: <strong>{data.historicalCount}</strong></span>
                <span className="text-slate-500">Projected Trend: <strong className="capitalize">{data.trendDirection}</strong></span>
              </div>
            </div>

            {/* Recharts Multi-Line with Prediction Interval */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartPoints} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual Historical Measurement"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0d9488' }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="Projected Value"
                    stroke="#6366f1"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#6366f1' }}
                    connectNulls={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="upperBound"
                    name="95% Upper Bound"
                    stroke="#cbd5e1"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    dot={false}
                    connectNulls={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="lowerBound"
                    name="95% Lower Bound"
                    stroke="#cbd5e1"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    dot={false}
                    connectNulls={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Rationale & Transparency Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Slope Per Day
              </span>
              <span className="text-lg font-bold text-navy-900">
                {data.slopePerDay !== undefined ? `${data.slopePerDay > 0 ? '+' : ''}${data.slopePerDay} / day` : '--'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Standard Error
              </span>
              <span className="text-lg font-bold text-navy-900">
                ± {data.residualStandardError || 0}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Forecast Horizon
              </span>
              <span className="text-lg font-bold text-teal-700">
                Next {data.horizonDays || 30} Days
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
