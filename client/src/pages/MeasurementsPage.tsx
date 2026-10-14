import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Plus,
  Download,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { measurementService } from '../services/measurementService';
import { HealthMeasurement, MeasurementType } from '../types';

export const MeasurementsPage: React.FC = () => {
  const [measurements, setMeasurements] = useState<HealthMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HealthMeasurement | null>(null);

  // Form State
  const [formType, setFormType] = useState<MeasurementType>('blood_pressure');
  const [formValue, setFormValue] = useState<string>('');
  const [formSecondary, setFormSecondary] = useState<string>('');
  const [formUnit, setFormUnit] = useState<string>('mmHg');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const data = await measurementService.getMeasurements({
        type: selectedType !== 'all' ? selectedType : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setMeasurements(data.measurements);
    } catch (err: any) {
      console.error('Error fetching measurements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, [selectedType, startDate, endDate]);

  const quickTrackingCards = [
    { type: 'blood_pressure' as MeasurementType, label: 'Blood Pressure', unit: 'mmHg', icon: '❤️' },
    { type: 'glucose' as MeasurementType, label: 'Glucose', unit: 'mg/dL', icon: '🩸' },
    { type: 'heart_rate' as MeasurementType, label: 'Heart Rate', unit: 'bpm', icon: '💓' },
    { type: 'weight' as MeasurementType, label: 'Weight', unit: 'kg', icon: '⚖️' },
    { type: 'sleep_duration' as MeasurementType, label: 'Sleep', unit: 'hours', icon: '😴' },
    { type: 'steps' as MeasurementType, label: 'Steps', unit: 'steps', icon: '👟' },
    { type: 'smoking' as MeasurementType, label: 'Smoking', unit: 'cigarettes', icon: '🚬' },
    { type: 'alcohol_intake' as MeasurementType, label: 'Alcohol', unit: 'drinks', icon: '🍷' },
  ];

  const handleTypeSelection = (t: MeasurementType) => {
    setFormType(t);
    switch (t) {
      case 'blood_pressure':
        setFormUnit('mmHg');
        break;
      case 'heart_rate':
        setFormUnit('bpm');
        break;
      case 'glucose':
        setFormUnit('mg/dL');
        break;
      case 'weight':
        setFormUnit('kg');
        break;
      case 'height':
        setFormUnit('cm');
        break;
      case 'bmi':
        setFormUnit('kg/m²');
        break;
      case 'sleep_duration':
        setFormUnit('hours');
        break;
      case 'activity':
        setFormUnit('minutes');
        break;
      case 'cholesterol':
        setFormUnit('mg/dL');
        break;
      case 'steps':
        setFormUnit('steps');
        break;
      case 'smoking':
        setFormUnit('cigarettes');
        break;
      case 'alcohol_intake':
        setFormUnit('drinks');
        break;
      case 'water_intake':
        setFormUnit('L');
        break;
      case 'body_temperature':
        setFormUnit('°C');
        break;
      case 'oxygen_saturation':
        setFormUnit('%');
        break;
      case 'stress_level':
        setFormUnit('/10');
        break;
      case 'mood':
        setFormUnit('rating');
        break;
      case 'calories_burned':
        setFormUnit('kcal');
        break;
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormType('blood_pressure');
    setFormValue('');
    setFormSecondary('');
    setFormUnit('mmHg');
    setFormNotes('');
    setFormDate(new Date().toISOString().slice(0, 16));
    setModalOpen(true);
  };

  const openEditModal = (item: HealthMeasurement) => {
    setEditingItem(item);
    setFormType(item.type);
    setFormValue(item.value.toString());
    setFormSecondary(item.secondaryValue !== undefined ? item.secondaryValue.toString() : '');
    setFormUnit(item.unit);
    setFormNotes(item.notes || '');
    setFormDate(new Date(item.recordedAt).toISOString().slice(0, 16));
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this recorded measurement?')) return;
    try {
      await measurementService.deleteMeasurement(id);
      setStatusMessage({ type: 'success', text: 'Measurement successfully deleted.' });
      fetchMeasurements();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to delete measurement.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const payload = {
        type: formType,
        value: parseFloat(formValue),
        secondaryValue: formType === 'blood_pressure' && formSecondary ? parseFloat(formSecondary) : undefined,
        unit: formUnit,
        notes: formNotes,
        recordedAt: new Date(formDate).toISOString(),
      };

      if (editingItem) {
        await measurementService.updateMeasurement(editingItem._id, payload);
        setStatusMessage({ type: 'success', text: 'Measurement updated successfully.' });
      } else {
        await measurementService.createMeasurement(payload);
        setStatusMessage({ type: 'success', text: 'Measurement recorded successfully.' });
      }

      setModalOpen(false);
      fetchMeasurements();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save measurement. Check values.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      await measurementService.downloadCSV();
    } catch (err: any) {
      alert('Failed to export CSV. Please check network connection.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Biomarker & Vital Tracking</h1>
          <p className="text-xs text-slate-500">
            Log, filter, and export continuous longitudinal health data.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Measurement</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl flex items-center space-x-2.5 text-xs font-medium border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="card-premium p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-navy-900">Daily Check-In</h2>
            <p className="text-[11px] text-slate-500">Log the most important daily health markers in one place.</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-white bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Entry</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {quickTrackingCards.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => {
                setFormType(item.type);
                setFormValue('');
                setFormSecondary('');
                setFormUnit(item.unit);
                setFormNotes('');
                setFormDate(new Date().toISOString().slice(0, 16));
                setEditingItem(null);
                setModalOpen(true);
              }}
              className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-3 text-left transition-all hover:border-teal-300 hover:bg-teal-50/40"
            >
              <div className="text-lg mb-2">{item.icon}</div>
              <div className="text-[11px] font-semibold text-slate-700">{item.label}</div>
              <div className="mt-1 text-[10px] text-slate-500">{item.unit}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card-premium p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Type:</span>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Measurements</option>
            <option value="blood_pressure">Blood Pressure</option>
            <option value="glucose">Blood Glucose</option>
            <option value="heart_rate">Heart Rate</option>
            <option value="weight">Weight</option>
            <option value="height">Height</option>
            <option value="bmi">BMI</option>
            <option value="sleep_duration">Sleep Duration</option>
            <option value="activity">Physical Activity</option>
            <option value="cholesterol">Cholesterol</option>
            <option value="steps">Daily Steps</option>
            <option value="smoking">Smoking</option>
            <option value="alcohol_intake">Alcohol Intake</option>
            <option value="water_intake">Water Intake</option>
            <option value="body_temperature">Body Temperature</option>
            <option value="oxygen_saturation">Oxygen Saturation</option>
            <option value="stress_level">Stress Level</option>
            <option value="mood">Mood Score</option>
            <option value="calories_burned">Calories Burned</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-2 py-1 text-slate-700 bg-white"
          />
          <span className="text-slate-500">To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-2 py-1 text-slate-700 bg-white"
          />
          {(startDate || endDate || selectedType !== 'all') && (
            <button
              onClick={() => {
                setSelectedType('all');
                setStartDate('');
                setEndDate('');
              }}
              className="text-teal-600 hover:underline font-semibold ml-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Measurements Table / Cards */}
      <div className="card-premium overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading measurements...</div>
        ) : measurements.length === 0 ? (
          <div className="p-12 text-center">
            <HeartPulse className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-navy-900 mb-1">No measurements found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              You haven't recorded any measurements matching your filter criteria yet. Click below to add your first reading.
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700"
            >
              <Plus className="w-4 h-4" />
              <span>Record Biomarker</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3 px-4">Biomarker / Type</th>
                  <th className="py-3 px-4">Value Recorded</th>
                  <th className="py-3 px-4">Unit</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Clinical Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {measurements.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800 capitalize">
                      {m.type.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 font-bold text-navy-900">
                      {m.type === 'blood_pressure'
                        ? `${m.value} / ${m.secondaryValue || '--'}`
                        : m.value}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{m.unit}</td>
                    <td className="py-3 px-4 text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(m.recordedAt).toLocaleDateString()}</span>
                        <span className="text-slate-400">({new Date(m.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {m.notes || <span className="text-slate-300 italic">None</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(m)}
                          className="p-1 text-slate-400 hover:text-teal-600 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-900">
                {editingItem ? 'Edit Biomarker Reading' : 'Log New Health Measurement'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Measurement Type
                </label>
                <select
                  value={formType}
                  onChange={(e) => handleTypeSelection(e.target.value as MeasurementType)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="blood_pressure">Blood Pressure (Systolic & Diastolic)</option>
                  <option value="glucose">Blood Glucose</option>
                  <option value="heart_rate">Heart Rate</option>
                  <option value="weight">Body Weight</option>
                  <option value="height">Height</option>
                  <option value="bmi">Body Mass Index (BMI)</option>
                  <option value="sleep_duration">Sleep Duration</option>
                  <option value="activity">Physical Activity</option>
                  <option value="cholesterol">Serum Cholesterol</option>
                  <option value="steps">Daily Steps</option>
                  <option value="smoking">Smoking (cigarettes)</option>
                  <option value="alcohol_intake">Alcohol Intake (drinks)</option>
                  <option value="water_intake">Water Intake</option>
                  <option value="body_temperature">Body Temperature</option>
                  <option value="oxygen_saturation">Oxygen Saturation</option>
                  <option value="stress_level">Stress Level</option>
                  <option value="mood">Mood Score</option>
                  <option value="calories_burned">Calories Burned</option>
                </select>
              </div>

              {formType === 'blood_pressure' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Systolic (mmHg)
                    </label>
                    <input
                      type="number"
                      required
                      step="any"
                      placeholder="120"
                      value={formValue}
                      onChange={(e) => setFormValue(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Diastolic (mmHg)
                    </label>
                    <input
                      type="number"
                      required
                      step="any"
                      placeholder="80"
                      value={formSecondary}
                      onChange={(e) => setFormSecondary(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Value</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formValue}
                      onChange={(e) => setFormValue(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                    <input
                      type="text"
                      required
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recorded Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Taken post morning walk, fasted state"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Measurement' : 'Record Measurement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
