import React, { useState, useEffect } from 'react';
import { User, Job, Course, Quiz, JobApplication, Certificate, ForumPost, PlacementRecord } from './types';
import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AICareerChatModal } from './components/AICareerChatModal';
import { QRVerificationModal } from './components/QRVerificationModal';

import { StudentDashboard } from './components/StudentDashboard';
import { CourseSection } from './components/CourseSection';
import { JobPortal } from './components/JobPortal';
import { ResumeBuilder } from './components/ResumeBuilder';
import { QuizSection } from './components/QuizSection';
import { PlacementTracker } from './components/PlacementTracker';
import { DiscussionForum } from './components/DiscussionForum';
import { CertificatesSection } from './components/CertificatesSection';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedCertForVerify, setSelectedCertForVerify] = useState<Certificate | null>(null);

  // Data lists from backend API
  const [jobs, setJobs] = useState<Job[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);

  // Dark mode effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load Initial Data from Express API
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const userRes = await api.getCurrentUser();
      if (userRes.user) setCurrentUser(userRes.user);

      const [jobsRes, coursesRes, quizRes, certRes, forumRes, plcRes] = await Promise.all([
        api.getJobs(),
        api.getCourses(),
        api.getQuizzes(),
        api.getCertificates(),
        api.getForumPosts(),
        api.getPlacements(),
      ]);

      if (jobsRes.jobs) setJobs(jobsRes.jobs);
      if (coursesRes.courses) setCourses(coursesRes.courses);
      if (quizRes.quizzes) setQuizzes(quizRes.quizzes);
      if (certRes.certificates) setCertificates(certRes.certificates);
      if (forumRes.posts) setForumPosts(forumRes.posts);
      if (plcRes.placements) setPlacements(plcRes.placements);

      if (userRes.user?.role === 'student') {
        const appRes = await api.getMyApplications();
        if (appRes.applications) setApplications(appRes.applications);
      }
    } catch (err) {
      console.error('Error fetching portal data:', err);
    }
  };

  const handleRefreshApplications = async () => {
    if (!currentUser) return;
    const appRes = await api.getMyApplications();
    if (appRes.applications) setApplications(appRes.applications);
  };

  const handleRefreshForum = async () => {
    const forumRes = await api.getForumPosts();
    if (forumRes.posts) setForumPosts(forumRes.posts);
  };

  const handleRefreshAllData = async () => {
    fetchInitialData();
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleRoleSwitch = async (role: 'student' | 'admin') => {
    try {
      // Demo login preset depending on role
      const email = role === 'admin' ? 'admin@skillbridge.edu' : 'alex.rivera@student.edu';
      const res = await api.login(email, role);
      if (res.user) {
        setCurrentUser(res.user);
        setActiveTab(role === 'admin' ? 'admin-analytics' : 'dashboard');
        handleRefreshApplications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCertificateVerify = (cert?: Certificate) => {
    setSelectedCertForVerify(cert || null);
    setIsVerifyModalOpen(true);
  };

  const handleCertificateEarned = (cert: Certificate) => {
    setCertificates((prev) => [cert, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Main Navigation Header */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAIChat={() => setIsAiChatOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onSwitchRole={handleRoleSwitch}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Body View Switching Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentUser ? (
          /* Unauthenticated Landing / Demo Prompt View */
          <div className="text-center py-16 space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
              🚀 Welcome to SkillBridge Portal
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-slate-100 leading-tight">
              Student Skill Development & Placement Portal
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Learn in-demand technical skills, create ATS-optimised resumes with Gemini AI, take assessment quizzes, and apply directly for top campus recruitment drives.
            </p>

            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all"
              >
                Get Started / Login
              </button>
              <button
                onClick={() => handleRoleSwitch('student')}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm rounded-2xl transition-all"
              >
                Instant Student Demo
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Views */
          <div>
            {/* Student Views */}
            {currentUser.role === 'student' && (
              <>
                {activeTab === 'dashboard' && (
                  <StudentDashboard
                    user={currentUser}
                    jobs={jobs}
                    courses={courses}
                    applications={applications}
                    certificates={certificates}
                    onNavigateTab={setActiveTab}
                    onOpenAIChat={() => setIsAiChatOpen(true)}
                  />
                )}

                {activeTab === 'courses' && (
                  <CourseSection
                    courses={courses}
                    user={currentUser}
                    onOpenQuiz={(qId) => setActiveTab('quizzes')}
                    onVerifyCertificate={handleOpenCertificateVerify}
                  />
                )}

                {activeTab === 'jobs' && (
                  <JobPortal
                    jobs={jobs}
                    applications={applications}
                    user={currentUser}
                    onRefreshApplications={handleRefreshApplications}
                  />
                )}

                {activeTab === 'resume-builder' && (
                  <ResumeBuilder
                    user={currentUser}
                    onUpdateUserResume={(resName) => setCurrentUser({ ...currentUser, resumeName: resName })}
                  />
                )}

                {activeTab === 'quizzes' && (
                  <QuizSection
                    quizzes={quizzes}
                    user={currentUser}
                    onCertificateEarned={handleCertificateEarned}
                  />
                )}

                {activeTab === 'placement-tracker' && (
                  <PlacementTracker placements={placements} studentCGPA={currentUser.cgpa} />
                )}

                {activeTab === 'forum' && (
                  <DiscussionForum posts={forumPosts} user={currentUser} onRefresh={handleRefreshForum} />
                )}

                {activeTab === 'certificates' && (
                  <CertificatesSection
                    certificates={certificates}
                    onOpenVerifyModal={handleOpenCertificateVerify}
                  />
                )}
              </>
            )}

            {/* Admin Views */}
            {currentUser.role === 'admin' && (
              <AdminDashboard
                adminUser={currentUser}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                jobs={jobs}
                courses={courses}
                placements={placements}
                onRefreshData={handleRefreshAllData}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigateTab={setActiveTab} />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => {
          setCurrentUser(u);
          setIsAuthOpen(false);
          handleRefreshApplications();
        }}
      />

      {currentUser && (
        <AICareerChatModal
          isOpen={isAiChatOpen}
          onClose={() => setIsAiChatOpen(false)}
          user={currentUser}
        />
      )}

      <QRVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => {
          setIsVerifyModalOpen(false);
          setSelectedCertForVerify(null);
        }}
        initialCertificate={selectedCertForVerify}
      />
    </div>
  );
}
