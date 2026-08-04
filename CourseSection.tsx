import React, { useState } from 'react';
import { Course, User, Certificate } from '../types';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  PlayCircle,
  FileText,
  Download,
  Award,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Search,
  Video,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface CourseSectionProps {
  courses: Course[];
  user: User;
  onOpenQuiz: (quizId: string) => void;
  onVerifyCertificate: (cert: Certificate) => void;
}

export const CourseSection: React.FC<CourseSectionProps> = ({
  courses,
  user,
  onOpenQuiz,
  onVerifyCertificate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'quiz'>('video');
  const [claimedCert, setClaimedCert] = useState<Certificate | null>(null);

  const categories = ['All', 'Web Development', 'Computer Science', 'Data Science', 'Database'];

  const filteredCourses = courses.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleClaimCertificate = (course: Course) => {
    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      studentId: user.id,
      studentName: user.name,
      courseId: course.id,
      courseTitle: course.title,
      issueDate: new Date().toISOString().split('T')[0],
      verificationCode: `SKILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`,
      grade: 'Mastery (A+)',
    };
    setClaimedCert(newCert);
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" /> Course & Skill Learning Hub
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Watch video lectures, read curated PDF notes, pass skill tests, and earn verifiable certificates.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses or topics..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
          >
            {/* Thumbnail */}
            <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-4">
                <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {course.category}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Users className="w-3.5 h-3.5 text-teal-500" />
                  <span className="text-[11px]">{course.enrolledStudentsCount} Enrolled</span>
                </div>

                <button
                  id={`btn-open-course-${course.id}`}
                  onClick={() => {
                    setActiveCourse(course);
                    setActiveTab('video');
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-sm"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Start Course</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Course Learning Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                  {activeCourse.category} • {activeCourse.duration}
                </span>
                <h3 className="text-base font-bold text-white line-clamp-1">{activeCourse.title}</h3>
              </div>
              <button
                onClick={() => {
                  setActiveCourse(null);
                  setClaimedCert(null);
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'video'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" /> Video Lesson
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'notes'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Handout Notes & PDFs
                </button>
              </div>

              <button
                id="btn-claim-cert"
                onClick={() => handleClaimCertificate(activeCourse)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold rounded-xl flex items-center gap-1 shadow-sm text-xs"
              >
                <Award className="w-3.5 h-3.5" /> Claim Certificate
              </button>
            </div>

            {/* Main Learning Canvas */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {claimedCert && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-extrabold text-emerald-800 dark:text-emerald-200 text-sm">
                        Congratulations! Certificate Earned
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-300">
                        Verification Code: <span className="font-mono font-bold">{claimedCert.verificationCode}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onVerifyCertificate(claimedCert)}
                    className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl shrink-0"
                  >
                    View Official Certificate
                  </button>
                </div>
              )}

              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg flex items-center justify-center relative">
                    <video
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      src={activeCourse.videoUrl}
                    >
                      Your browser does not support HTML video playback.
                    </video>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
                      Instructor: {activeCourse.instructor}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {activeCourse.description}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {activeCourse.pdfNotesTitle || 'Complete_Course_Handout.pdf'}
                        </p>
                        <p className="text-[11px] text-slate-500">Official instructor notes & code snippets (PDF, 4.2 MB)</p>
                      </div>
                    </div>
                    <a
                      href={activeCourse.pdfNotesUrl || '#'}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading ${activeCourse.pdfNotesTitle || 'Notes.pdf'}...`);
                      }}
                      className="px-3.5 py-2 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </a>
                  </div>

                  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      Module Highlights & Cheatsheet
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                      <li>Module 1: Architecture overview & environment setup</li>
                      <li>Module 2: Core syntax, component lifecycles, and state management</li>
                      <li>Module 3: REST API endpoint integration & security handling</li>
                      <li>Module 4: Performance optimization, bundle splitting, and deployment</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
