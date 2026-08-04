import React, { useState } from 'react';
import { Certificate } from '../types';
import { ShieldCheck, Award, Download, Search, CheckCircle, ExternalLink, Calendar } from 'lucide-react';

interface CertificatesSectionProps {
  certificates: Certificate[];
  onOpenVerifyModal: (cert?: Certificate) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates,
  onOpenVerifyModal,
}) => {
  const [lookupCode, setLookupCode] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" /> Verifiable Certificates Registry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            All SkillBridge certificates feature cryptographic QR verification codes accepted by top recruiters.
          </p>
        </div>

        <button
          onClick={() => onOpenVerifyModal()}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" /> Verify Any Code
        </button>
      </div>

      {/* List of Earned Certificates */}
      {certificates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
          No certificates earned yet. Complete course modules or score 80%+ on quizzes to unlock certificates!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-teal-500/30 p-6 shadow-sm space-y-4 relative overflow-hidden group hover:border-teal-500 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                      Verified Credentials
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mt-0.5">
                      {cert.courseTitle}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Awarded To:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{cert.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Grade Honors:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{cert.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issue Date:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{cert.issueDate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-slate-400 font-bold">{cert.verificationCode}</span>

                <button
                  onClick={() => onOpenVerifyModal(cert)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View QR Verification
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
