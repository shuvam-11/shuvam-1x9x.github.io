import React, { useState } from 'react';
import { PlacementRecord } from '../types';
import { Building2, Calendar, DollarSign, Users, Award, CheckCircle2, ChevronRight, Search, Clock } from 'lucide-react';

interface PlacementTrackerProps {
  placements: PlacementRecord[];
  studentCGPA?: number;
}

export const PlacementTracker: React.FC<PlacementTrackerProps> = ({ placements, studentCGPA = 8.8 }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = placements.filter((p) => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesSearch = p.company.toLowerCase().includes(search.toLowerCase()) || p.rolesOffered.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" /> Campus Placement Drive Tracker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track visiting companies, salary packages (LPA), selection statistics, and eligibility criteria.
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-3">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Your Academic CGPA</p>
              <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{studentCGPA} / 10.0</p>
            </div>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Eligible for 100% Campus Drives
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {['All', 'Upcoming', 'Ongoing', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Campus Drives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => {
          const isEligible = studentCGPA >= item.eligibilityCGPA;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        item.status === 'Upcoming'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : item.status === 'Ongoing'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 animate-pulse'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}
                    >
                      {item.status} Drive
                    </span>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mt-2">{item.company}</h3>
                    <p className="text-xs text-slate-500 font-medium">{item.rolesOffered}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {item.packageLPA} LPA
                    </p>
                    <p className="text-[10px] text-slate-400">Annual CTC</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Visit Date</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{item.visitDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Selected</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{item.totalSelected} Students</span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Interview Process Rounds:</span>
                  <p className="text-slate-500 text-[11px] leading-relaxed">{item.interviewProcess}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span
                  className={`font-bold flex items-center gap-1 text-[11px] ${
                    isEligible ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isEligible ? 'Eligible (Min CGPA ' + item.eligibilityCGPA + ')' : 'Requires CGPA ≥ ' + item.eligibilityCGPA}
                </span>

                <button
                  onClick={() => alert(`Registered for ${item.company} placement updates!`)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm text-xs"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
