import React, { useState, useEffect } from 'react';
import { User, Job, Course, JobApplication, PlacementRecord } from '../types';
import { api } from '../services/api';
import {
  BarChart2,
  Users,
  Briefcase,
  BookOpen,
  Building2,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Search,
  Check,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Calendar,
} from 'lucide-react';

interface AdminDashboardProps {
  adminUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  jobs: Job[];
  courses: Course[];
  placements: PlacementRecord[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  activeTab,
  setActiveTab,
  jobs,
  courses,
  placements,
  onRefreshData,
}) => {
  const [students, setStudents] = useState<User[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [studentSearch, setStudentSearch] = useState('');

  // Add Job Form state
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [newJob, setNewJob] = useState({
    company: '',
    position: '',
    salary: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    skillsRequired: '',
    deadline: '2026-09-30',
  });

  // Add Course Form state
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    duration: '6 Weeks',
    level: 'Beginner',
    instructor: adminUser.name,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    pdfNotesTitle: 'Official_Handout_Notes.pdf',
  });

  // Add Placement Drive state
  const [isAddingPlacement, setIsAddingPlacement] = useState(false);
  const [newPlc, setNewPlc] = useState({
    company: '',
    visitDate: '2026-10-15',
    rolesOffered: 'SDE, Frontend Engineer',
    packageLPA: '11.5',
    totalSelected: '10',
    eligibilityCGPA: '7.0',
    status: 'Upcoming',
    interviewProcess: 'Aptitude Test -> Tech Round -> HR',
  });

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const loadAdminData = async () => {
    try {
      const [stRes, appRes, anRes] = await Promise.all([
        api.getStudents(),
        api.getAllApplications(),
        api.getAdminAnalytics(),
      ]);
      if (stRes.students) setStudents(stRes.students);
      if (appRes.applications) setApplications(appRes.applications);
      if (anRes.analytics) setAnalytics(anRes.analytics);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student record?')) return;
    await api.deleteStudent(id);
    loadAdminData();
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    await api.deleteJob(id);
    onRefreshData();
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    await api.deleteCourse(id);
    onRefreshData();
  };

  const handleUpdateAppStatus = async (appId: string, newStatus: string) => {
    let dateInput: string | undefined = undefined;
    if (newStatus === 'Interview Scheduled') {
      dateInput = prompt('Enter Interview Date & Time:', '2026-08-20 11:00 AM') || undefined;
    }
    await api.updateApplicationStatus(appId, newStatus, dateInput);
    loadAdminData();
  };

  const handleAddJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addJob({
      ...newJob,
      requirements: newJob.requirements.split(',').map((s) => s.trim()),
      skillsRequired: newJob.skillsRequired.split(',').map((s) => s.trim()),
    } as any);
    setIsAddingJob(false);
    onRefreshData();
  };

  const handleAddCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addCourse(newCourse as any);
    setIsAddingCourse(false);
    onRefreshData();
  };

  const handleAddPlacementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addPlacement({
      company: newPlc.company,
      visitDate: newPlc.visitDate,
      rolesOffered: newPlc.rolesOffered,
      packageLPA: Number(newPlc.packageLPA),
      totalSelected: Number(newPlc.totalSelected),
      eligibilityCGPA: Number(newPlc.eligibilityCGPA),
      status: newPlc.status as any,
      interviewProcess: newPlc.interviewProcess,
    });
    setIsAddingPlacement(false);
    onRefreshData();
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.college || '').toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Analytics Overview Tab */}
      {activeTab === 'admin-analytics' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-teal-600" /> Admin Analytics & Placement Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Real-time portal performance, recruitment statistics, and course engagement.
              </p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Registered Students</p>
                <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                  {analytics?.totalStudents || students.length}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Active Job Postings</p>
                <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{jobs.length}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Placement Rate</p>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {analytics?.placementRate || '94'}%
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Average Salary Package</p>
                <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">10.5 LPA</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Students Tab */}
      {activeTab === 'admin-students' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Registered Students List ({filteredStudents.length})
            </h3>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search student or email..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">College & Branch</th>
                  <th className="p-3">CGPA</th>
                  <th className="p-3">Skills</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{st.name}</td>
                    <td className="p-3">{st.email}</td>
                    <td className="p-3">{st.college || 'NIT'} ({st.branch || 'CSE'})</td>
                    <td className="p-3 font-bold text-blue-600">{st.cgpa || 8.8}</td>
                    <td className="p-3 max-w-[200px] truncate">{st.skills?.join(', ')}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteStudent(st.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded"
                        title="Remove Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manage Jobs Tab */}
      {activeTab === 'admin-jobs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-600" /> Manage Job Postings & Applications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Post new campus opportunities and update candidate recruitment pipeline statuses.
              </p>
            </div>

            <button
              id="btn-add-job-posting"
              onClick={() => setIsAddingJob(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Job Listing
            </button>
          </div>

          {/* Applications list */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Candidate Job Applications ({applications.length})
            </h4>

            <div className="space-y-3">
              {applications.map((appItem) => (
                <div
                  key={appItem.id}
                  className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {appItem.studentName} ({appItem.studentEmail})
                    </p>
                    <p className="text-slate-500">
                      Applied for <strong className="text-blue-600">{appItem.jobTitle}</strong> at {appItem.company} on {appItem.appliedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-500">Status:</span>
                    <select
                      value={appItem.status}
                      onChange={(e) => handleUpdateAppStatus(appItem.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Offered">Offered</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Job */}
      {isAddingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Post New Campus Job / Internship</h3>
            <form onSubmit={handleAddJobSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Company Name"
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border"
              />
              <input
                type="text"
                required
                placeholder="Position Title"
                value={newJob.position}
                onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Salary (e.g. $80,000 / yr)"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border"
                />
                <input
                  type="text"
                  placeholder="Location (e.g. San Francisco / Remote)"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Job Description..."
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border"
              />
              <input
                type="text"
                placeholder="Required Skills (comma separated: React, SQL, Python)"
                value={newJob.skillsRequired}
                onChange={(e) => setNewJob({ ...newJob, skillsRequired: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingJob(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl">
                  Post Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Courses Tab */}
      {activeTab === 'admin-courses' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" /> Manage Skill Courses & Video Modules
            </h3>
            <button
              onClick={() => setIsAddingCourse(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((crs) => (
              <div key={crs.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">{crs.title}</h4>
                  <p className="text-slate-500">{crs.category} • {crs.duration} • Instructor: {crs.instructor}</p>
                </div>
                <button onClick={() => handleDeleteCourse(crs.id)} className="p-1 text-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Course */}
      {isAddingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Add New Skill Development Course</h3>
            <form onSubmit={handleAddCourseSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Course Title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border"
              />
              <textarea
                rows={3}
                placeholder="Course Description..."
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Duration (e.g. 6 Weeks)"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border"
                />
                <input
                  type="text"
                  placeholder="Instructor Name"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddingCourse(false)} className="px-4 py-2 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Placement Drive Manager Tab */}
      {activeTab === 'admin-placements' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" /> Manage Campus Placement Drives
            </h3>
            <button
              onClick={() => setIsAddingPlacement(true)}
              className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Schedule New Visit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {placements.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border text-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-100">{p.company} ({p.status})</p>
                <p className="text-slate-500">{p.rolesOffered} • CTC: {p.packageLPA} LPA • Date: {p.visitDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Placement */}
      {isAddingPlacement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Schedule Campus Placement Drive</h3>
            <form onSubmit={handleAddPlacementSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Company Name"
                value={newPlc.company}
                onChange={(e) => setNewPlc({ ...newPlc, company: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newPlc.visitDate}
                  onChange={(e) => setNewPlc({ ...newPlc, visitDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border"
                />
                <input
                  type="text"
                  placeholder="CTC in LPA (e.g. 12.5)"
                  value={newPlc.packageLPA}
                  onChange={(e) => setNewPlc({ ...newPlc, packageLPA: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border"
                />
              </div>
              <input
                type="text"
                placeholder="Roles Offered"
                value={newPlc.rolesOffered}
                onChange={(e) => setNewPlc({ ...newPlc, rolesOffered: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddingPlacement(false)} className="px-4 py-2 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl">
                  Schedule Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
