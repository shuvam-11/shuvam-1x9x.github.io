import React from 'react';
import { User, Job, Course, JobApplication, Certificate } from '../types';
import {
  Sparkles,
  Briefcase,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  User as UserIcon,
  Bot,
  GraduationCap,
} from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  jobs: Job[];
  courses: Course[];
  applications: JobApplication[];
  certificates: Certificate[];
  onNavigateTab: (tab: string) => void;
  onOpenAIChat: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  jobs,
  courses,
  applications,
  certificates,
  onNavigateTab,
  onOpenAIChat,
}) => {
  const profileCompletion = 85;

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SkillBridge Placement Portal • Active Term 2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
              {user.college || 'National Institute of Technology'} • {user.branch || 'Computer Science Engineering'} (CGPA: {user.cgpa || 8.8})
            </p>
          </div>

          <button
            id="btn-hero-ai-advisor"
            onClick={onOpenAIChat}
            className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0 group"
          >
            <Bot className="w-5 h-5 text-teal-600 group-hover:rotate-12 transition-transform" />
            <span>Ask Gemini AI Career Advisor</span>
          </button>
        </div>

        {/* Profile Readiness Bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold">
              {profileCompletion}%
            </div>
            <div>
              <p className="text-blue-100 font-medium">Placement Profile Readiness</p>
              <div className="w-32 bg-white/20 h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-amber-300 h-full rounded-full" style={{ width: `${profileCompletion}%` }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-teal-300">
              {applications.length}
            </div>
            <div>
              <p className="text-blue-100 font-medium">Active Applications</p>
              <p className="text-[11px] text-teal-200 font-bold">In recruitment pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-amber-300">
              {certificates.length}
            </div>
            <div>
              <p className="text-blue-100 font-medium">Earned Certificates</p>
              <p className="text-[11px] text-amber-200 font-bold">Verifiable QR Credentials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('resume-builder')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs text-slate-800 dark:text-slate-100">Resume Builder</span>
          <span className="text-[10px] text-slate-400">ATS AI Scanner & PDF</span>
        </button>

        <button
          onClick={() => onNavigateTab('courses')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs text-slate-800 dark:text-slate-100">Course Hub</span>
          <span className="text-[10px] text-slate-400">Videos & PDF Notes</span>
        </button>

        <button
          onClick={() => onNavigateTab('jobs')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs text-slate-800 dark:text-slate-100">Campus Jobs</span>
          <span className="text-[10px] text-slate-400">Track Applications</span>
        </button>

        <button
          onClick={() => onNavigateTab('quizzes')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <span className="font-bold text-xs text-slate-800 dark:text-slate-100">Skill Quizzes</span>
          <span className="text-[10px] text-slate-400">Earn Certificates</span>
        </button>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Jobs Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" /> Recommended Hiring Opportunities
            </h3>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">{job.position}</h4>
                    <p className="text-[11px] text-slate-500">{job.company} • {job.location}</p>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{job.salary}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('jobs')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm shrink-0"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Applications & Enrolled Courses (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Applications Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" /> Active Applications
              </h3>
              <button onClick={() => onNavigateTab('jobs')} className="text-[11px] text-blue-600 font-bold hover:underline">
                Manage
              </button>
            </div>

            <div className="space-y-2">
              {applications.slice(0, 2).map((app) => (
                <div key={app.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-800 dark:text-slate-100">{app.jobTitle}</span>
                    <span className="text-teal-600 dark:text-teal-400">{app.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{app.company} • Applied on {app.appliedDate}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Courses Progress */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Skill Courses Progress
              </h3>
              <button onClick={() => onNavigateTab('courses')} className="text-[11px] text-blue-600 font-bold hover:underline">
                Explore
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {courses.slice(0, 2).map((crs) => (
                <div key={crs.id} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-800 dark:text-slate-200">{crs.title}</span>
                    <span className="text-slate-500 font-bold">75%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
