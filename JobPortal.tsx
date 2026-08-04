import React, { useState } from 'react';
import { Job, JobApplication, User } from '../types';
import { api } from '../services/api';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Send,
  Bookmark,
  BookmarkCheck,
  FileText,
  X,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface JobPortalProps {
  jobs: Job[];
  applications: JobApplication[];
  user: User;
  onRefreshApplications: () => void;
}

export const JobPortal: React.FC<JobPortalProps> = ({
  jobs,
  applications,
  user,
  onRefreshApplications,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job_1']);
  const [activeTab, setActiveTab] = useState<'explore' | 'applied' | 'saved'>('explore');
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applyMsg, setApplyMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const jobTypes = ['All', 'Full-time', 'Internship', 'Remote'];

  const toggleSaveJob = (id: string) => {
    setSavedJobIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || j.type === selectedType || (selectedType === 'Remote' && j.location.includes('Remote'));
    return matchesSearch && matchesType;
  });

  const savedJobsList = jobs.filter((j) => savedJobIds.includes(j.id));

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    setSubmitting(true);
    setApplyMsg(null);
    try {
      const res = await api.applyForJob(applyingJob.id, coverLetter, user.resumeName || 'Resume.pdf');
      setApplyMsg({ text: res.message, type: 'success' });
      onRefreshApplications();
      setTimeout(() => {
        setApplyingJob(null);
        setCoverLetter('');
        setApplyMsg(null);
      }, 1200);
    } catch (err: any) {
      setApplyMsg({ text: err.message || 'Application failed', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      case 'Shortlisted':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300';
      case 'Interview Scheduled':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 animate-pulse';
      case 'Offered':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-extrabold';
      case 'Rejected':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" /> Job Portal & Application Tracker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Apply for campus hiring drives, track recruitment stages, and save target positions.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'explore'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Explore Jobs ({filteredJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applied')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'applied'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              My Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'saved'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Saved ({savedJobIds.length})
            </button>
          </div>
        </div>

        {activeTab === 'explore' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Position, company, or skill..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
              {jobTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedType === t
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Explore Tab View */}
      {activeTab === 'explore' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => {
            const hasApplied = applications.some((a) => a.jobId === job.id);
            const isSaved = savedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 text-lg">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{job.position}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job.company}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                      title={isSaved ? 'Remove from saved' : 'Save job'}
                    >
                      {isSaved ? <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Details Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                    </span>
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg font-bold">
                      {job.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills required */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skillsRequired?.map((sk, sIdx) => (
                      <span key={sIdx} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Deadline: {job.deadline}
                  </span>

                  {hasApplied ? (
                    <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-extrabold rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                    </span>
                  ) : (
                    <button
                      id={`btn-apply-job-${job.id}`}
                      onClick={() => setApplyingJob(job)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" /> Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Applied Jobs Tab View */}
      {activeTab === 'applied' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
              No active job applications found. Explore open roles and apply today!
            </div>
          ) : (
            applications.map((appItem) => (
              <div
                key={appItem.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{appItem.jobTitle}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{appItem.company} • Applied on {appItem.appliedDate}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-xl font-bold self-start sm:self-center ${getStatusBadge(appItem.status)}`}>
                    {appItem.status}
                  </span>
                </div>

                {appItem.interviewDate && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Interview Scheduled Date: <strong className="font-bold">{appItem.interviewDate}</strong></span>
                  </div>
                )}

                {/* Recruitment Progress Timeline Bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                    <span>Applied</span>
                    <span>Review</span>
                    <span>Shortlisted</span>
                    <span>Interview</span>
                    <span>Offer</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-teal-500 h-full transition-all duration-500"
                      style={{
                        width:
                          appItem.status === 'Applied'
                            ? '20%'
                            : appItem.status === 'Under Review'
                            ? '40%'
                            : appItem.status === 'Shortlisted'
                            ? '60%'
                            : appItem.status === 'Interview Scheduled'
                            ? '80%'
                            : appItem.status === 'Offered'
                            ? '100%'
                            : '15%',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Saved Jobs Tab */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobsList.map((job) => (
            <div key={job.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{job.position}</h3>
              <p className="text-xs text-slate-500">{job.company} • {job.location}</p>
              <button
                onClick={() => setApplyingJob(job)}
                className="px-3.5 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Application Submit Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Apply for {applyingJob.position}</h3>
                <p className="text-xs text-blue-100">{applyingJob.company} • {applyingJob.location}</p>
              </div>
              <button onClick={() => setApplyingJob(null)} className="p-1 rounded-full hover:bg-white/10">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4 text-xs">
              {applyMsg && (
                <div className={`p-3 rounded-xl flex items-center gap-2 ${applyMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                  {applyMsg.text}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Attached Resume</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                  <span className="font-medium">{user.resumeName || 'Alex_Rivera_Resume.pdf'}</span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold">Attached</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cover Letter / Note to Recruiter</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain briefly why you are a great fit for this campus hiring position..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
