import React, { useState } from 'react';
import { Certificate } from '../types';
import { api } from '../services/api';
import { X, ShieldCheck, CheckCircle, AlertCircle, Search, Award, Calendar, GraduationCap } from 'lucide-react';

interface QRVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCertificate?: Certificate | null;
}

export const QRVerificationModal: React.FC<QRVerificationModalProps> = ({
  isOpen,
  onClose,
  initialCertificate,
}) => {
  const [code, setCode] = useState(initialCertificate?.verificationCode || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(initialCertificate || null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.verifyCertificate(code.trim());
      if (res.verified && res.certificate) {
        setResult(res.certificate);
      } else {
        setError(res.error || 'Certificate not found in SkillBridge register.');
      }
    } catch (err: any) {
      setError('Certificate code is invalid or not registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">QR Certificate Verification</h3>
              <p className="text-xs text-blue-100">Verify SkillBridge credentials instantly</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleVerify} className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter Code e.g. SKILL-2026-9812-781A"
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </form>

          {loading && (
            <p className="text-xs text-center text-slate-500 animate-pulse">Checking cryptographic register...</p>
          )}

          {error && (
            <div className="p-3 bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="bg-slate-50 dark:bg-slate-800/90 border border-emerald-300 dark:border-emerald-700/50 rounded-2xl p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                <CheckCircle className="w-4 h-4" /> Official Authenticated Certificate
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Awarded To</p>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{result.studentName}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Course / Certification Title</p>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{result.courseTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-[10px] text-slate-500">Grade Honors</p>
                  <p className="font-bold text-slate-700 dark:text-slate-300">{result.grade}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Issue Date</p>
                  <p className="font-bold text-slate-700 dark:text-slate-300">{result.issueDate}</p>
                </div>
              </div>

              <div className="pt-2 text-[10px] font-mono text-slate-400 break-all border-t border-slate-200 dark:border-slate-700">
                VERIFICATION ID: {result.verificationCode}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
