import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Download,
  Key,
  User,
  CheckCircle,
  Database,
  Lock,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { measurementService } from '../services/measurementService';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await measurementService.downloadCSV();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch {
      alert('Failed to download CSV export.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Account & Platform Settings</h1>
        <p className="text-xs text-slate-500">
          Manage your personal health twin preferences, privacy controls, and data exports.
        </p>
      </div>

      {/* Account Info */}
      <div className="card-premium p-6 space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <User className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold text-navy-900">User Profile Identity</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="block text-slate-500 mb-1">Full Name</span>
            <span className="font-semibold text-slate-800 text-sm">{user?.name}</span>
          </div>
          <div>
            <span className="block text-slate-500 mb-1">Registered Email</span>
            <span className="font-semibold text-slate-800 text-sm">{user?.email}</span>
          </div>
          <div>
            <span className="block text-slate-500 mb-1">Access Role</span>
            <span className="font-semibold text-slate-800 capitalize">{user?.role}</span>
          </div>
          <div>
            <span className="block text-slate-500 mb-1">Account Created</span>
            <span className="font-semibold text-slate-800">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Data Export & Portability */}
      <div className="card-premium p-6 space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <Database className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-navy-900">Data Portability & Export</h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Download a complete CSV archive of all your physiological measurements, timestamps, and clinical notes. You maintain full ownership of your records.
        </p>

        <div className="pt-2 flex items-center space-x-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating CSV...' : 'Download Complete Health CSV'}</span>
          </button>
          {exportSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Export downloaded successfully!</span>
            </span>
          )}
        </div>
      </div>

      {/* Privacy & Responsible AI Policies */}
      <div className="card-premium p-6 space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <Shield className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold text-navy-900">Privacy Safeguards & Tenant Isolation</h2>
        </div>

        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Strict Tenant Isolation:</strong> Every measurement, disease assessment, and forecast is partitioned strictly by your unique user identification key on MongoDB. Cross-tenant access is structurally prohibited on the Express middleware layer.
          </p>
          <p>
            <strong>Stateless Inference Architecture:</strong> The Python FastAPI ML service evaluates inference pipelines statelessly without caching or retaining unauthenticated patient records.
          </p>
          <p>
            <strong>Cryptographic Security:</strong> Passwords are encrypted with salted bcrypt hashing, and sessions utilize secure HTTP-only cookie headers.
          </p>
        </div>
      </div>
    </div>
  );
};
