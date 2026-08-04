import React, { useState } from 'react';
import { ResumeData, User } from '../types';
import { api } from '../services/api';
import jsPDF from 'jspdf';
import {
  FileText,
  Download,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Briefcase,
  GraduationCap,
  User as UserIcon,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface ResumeBuilderProps {
  user: User;
  onUpdateUserResume: (resumeName: string) => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ user, onUpdateUserResume }) => {
  const [resume, setResume] = useState<ResumeData>({
    personalInfo: {
      fullName: user.name || 'Alex Rivera',
      email: user.email || 'alex.rivera@student.edu',
      phone: user.phone || '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexrivera-tech',
      github: 'github.com/alexrivera-dev',
      summary:
        'Motivated Computer Science undergraduate with hands-on experience in Full Stack Web Development, RESTful API design, and Data Structures. Passionate about engineering high-performance cloud applications.',
    },
    education: [
      {
        id: 'edu_1',
        institution: user.college || 'National Institute of Technology',
        degree: 'Bachelor of Technology',
        fieldOfStudy: user.branch || 'Computer Science & Engineering',
        startYear: '2022',
        endYear: '2026',
        grade: `CGPA: ${user.cgpa || 8.8}/10.0`,
      },
    ],
    experience: [
      {
        id: 'exp_1',
        company: 'Apex Software Labs',
        role: 'Full Stack Development Intern',
        location: 'Remote',
        startDate: 'Jun 2025',
        endDate: 'Aug 2025',
        description:
          'Developed responsive React UI components and integrated Express REST endpoints. Reduced client payload sizes by 28% through memoization and route lazy loading.',
      },
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'SkillBridge Student Portal',
        techStack: 'React 19, Express, TypeScript, Tailwind CSS, Gemini AI',
        link: 'https://skillbridge-portal.edu',
        description:
          'Built an end-to-end placement portal featuring AI resume reviews, course video modules, MCQ quizzes with automated PDF certificates, and recruitment tracking.',
      },
      {
        id: 'proj_2',
        title: 'Distributed Analytics Dashboard',
        techStack: 'Node.js, PostgreSQL, Recharts, Docker',
        link: 'https://github.com/alexrivera-dev/analytics-dash',
        description:
          'Designed high-throughput SQL database indexing strategy processing 50,000+ daily events with sub-100ms response times.',
      },
    ],
    skills: user.skills.length > 0 ? user.skills : ['React.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'SQL', 'Python'],
    certifications: [
      'AWS Certified Cloud Practitioner',
      'SkillBridge Full Stack Development Mastery (A+ Grade)',
    ],
  });

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  // Handle PDF Download via jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'letter',
    });

    let y = 40;

    // Name & Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235); // Blue 600
    doc.text(resume.personalInfo.fullName, 40, y);

    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const contactLine = `${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location} | ${resume.personalInfo.linkedin}`;
    doc.text(contactLine, 40, y);

    y += 20;
    doc.setDrawColor(226, 232, 240);
    doc.line(40, y, 570, y);
    y += 15;

    // Professional Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('PROFESSIONAL SUMMARY', 40, y);
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const summaryLines = doc.splitTextToSize(resume.personalInfo.summary, 530);
    doc.text(summaryLines, 40, y);
    y += summaryLines.length * 12 + 10;

    // Education
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('EDUCATION', 40, y);
    y += 12;

    resume.education.forEach((edu) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`${edu.degree} in ${edu.fieldOfStudy}`, 40, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`${edu.startYear} - ${edu.endYear}`, 500, y);

      y += 12;
      doc.setTextColor(71, 85, 105);
      doc.text(`${edu.institution} • ${edu.grade}`, 40, y);
      y += 16;
    });

    // Technical Skills
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('TECHNICAL SKILLS', 40, y);
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Core Competencies: ${resume.skills.join(', ')}`, 40, y);
    y += 20;

    // Work Experience
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('WORK EXPERIENCE', 40, y);
    y += 12;

    resume.experience.forEach((exp) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`${exp.role} — ${exp.company}`, 40, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`${exp.startDate} - ${exp.endDate}`, 500, y);

      y += 12;
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const descLines = doc.splitTextToSize(exp.description, 530);
      doc.text(descLines, 40, y);
      y += descLines.length * 11 + 12;
    });

    // Projects
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('KEY PROJECTS', 40, y);
    y += 12;

    resume.projects.forEach((proj) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235);
      doc.text(proj.title, 40, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Stack: ${proj.techStack}`, 220, y);

      y += 12;
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const projLines = doc.splitTextToSize(proj.description, 530);
      doc.text(projLines, 40, y);
      y += projLines.length * 11 + 10;
    });

    const fileName = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    doc.save(fileName);
    onUpdateUserResume(fileName);
  };

  const handleAIReview = async () => {
    setAnalyzing(true);
    setAiAnalysis(null);
    try {
      const res = await api.getAIResumeReview(resume);
      setAiAnalysis(res.analysis);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setResume((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    setNewSkill('');
  };

  const removeSkill = (idx: number) => {
    setResume((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
  };

  const addCert = () => {
    if (!newCert.trim()) return;
    setResume((prev) => ({ ...prev, certifications: [...prev.certifications, newCert.trim()] }));
    setNewCert('');
  };

  const removeCert = (idx: number) => {
    setResume((prev) => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Interactive Resume Builder
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              ATS Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build your professional resume, perform 1-click AI ATS scanning, and export ready-to-submit PDFs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-ai-resume-scan"
            onClick={handleAIReview}
            disabled={analyzing}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{analyzing ? 'Scanning Resume...' : 'AI Resume Review'}</span>
          </button>

          <button
            id="btn-download-resume-pdf"
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* AI Analysis Modal / Card Results */}
      {aiAnalysis && (
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-blue-500/30 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">Gemini AI ATS Evaluation</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">ATS Match Score:</span>
              <span className="text-lg font-extrabold px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-xl">
                {aiAnalysis.atsScore} / 100
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 italic">{aiAnalysis.overallVerdict}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Strengths */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-emerald-500/30">
              <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Strong Highlights
              </h4>
              <ul className="space-y-1 list-disc list-inside text-slate-300">
                {aiAnalysis.strengths?.map((s: string, idx: number) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Missing Keywords */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-amber-500/30">
              <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> High Priority ATS Keywords to Add
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {aiAnalysis.missingKeywords?.map((kw: string, idx: number) => (
                  <span key={idx} className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono text-[11px]">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Line by line improvements */}
          {aiAnalysis.bulletPointImprovements && (
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <h4 className="font-bold text-blue-400 text-xs">Recommended Bullet Point Improvements:</h4>
              {aiAnalysis.bulletPointImprovements.map((bp: any, idx: number) => (
                <div key={idx} className="text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <p className="text-slate-400 line-through">Original: {bp.originalOrSection}</p>
                  <p className="text-emerald-300 font-medium">✨ Enhanced: {bp.enhancedSuggestion}</p>
                  <p className="text-[10px] text-slate-500">Why: {bp.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Form Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Personal Info */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-600" /> Personal & Contact Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.personalInfo.fullName}
                  onChange={(e) =>
                    setResume((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={(e) =>
                    setResume((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Phone</label>
                <input
                  type="text"
                  value={resume.personalInfo.phone}
                  onChange={(e) =>
                    setResume((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Location</label>
                <input
                  type="text"
                  value={resume.personalInfo.location}
                  onChange={(e) =>
                    setResume((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-500 text-xs mb-1">Professional Summary</label>
              <textarea
                rows={3}
                value={resume.personalInfo.summary}
                onChange={(e) =>
                  setResume((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, summary: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Education
            </h3>
            {resume.education.map((edu, idx) => (
              <div key={edu.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[idx].institution = e.target.value;
                      setResume({ ...resume, education: updated });
                    }}
                    className="px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[idx].degree = e.target.value;
                      setResume({ ...resume, education: updated });
                    }}
                    className="px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={edu.fieldOfStudy}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[idx].fieldOfStudy = e.target.value;
                      setResume({ ...resume, education: updated });
                    }}
                    className="px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Years (2022-2026)"
                    value={`${edu.startYear}-${edu.endYear}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('-');
                      const updated = [...resume.education];
                      updated[idx].startYear = parts[0] || '2022';
                      updated[idx].endYear = parts[1] || '2026';
                      setResume({ ...resume, education: updated });
                    }}
                    className="px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Grade / CGPA"
                    value={edu.grade}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[idx].grade = e.target.value;
                      setResume({ ...resume, education: updated });
                    }}
                    className="px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Technical Skills */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" /> Skills & Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((sk, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-lg font-medium border border-blue-200 dark:border-blue-800 flex items-center gap-1"
                >
                  {sk}
                  <button onClick={() => removeSkill(idx)} className="hover:text-rose-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 text-xs">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add new skill (e.g. Docker, GraphQL)"
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
              <button
                onClick={addSkill}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Right Live Resume Card Preview (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-lg space-y-4 text-slate-800 dark:text-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-500">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs uppercase tracking-wider">Live Document Preview</span>
              </div>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                A4 Format
              </span>
            </div>

            {/* Document Surface */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 font-sans">
              <div>
                <h2 className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                  {resume.personalInfo.fullName}
                </h2>
                <p className="text-[10px] text-slate-500">
                  {resume.personalInfo.email} • {resume.personalInfo.phone} • {resume.personalInfo.location}
                </p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
                <h4 className="font-extrabold text-[11px] text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
                  Summary
                </h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {resume.personalInfo.summary}
                </p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
                <h4 className="font-extrabold text-[11px] text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
                  Education
                </h4>
                {resume.education.map((edu) => (
                  <div key={edu.id} className="text-[10px] mb-1">
                    <p className="font-bold">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-slate-500">{edu.institution} ({edu.startYear}-{edu.endYear}) • {edu.grade}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
                <h4 className="font-extrabold text-[11px] text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
                  Skills
                </h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-300">
                  {resume.skills.join(' • ')}
                </p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
                <h4 className="font-extrabold text-[11px] text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
                  Projects
                </h4>
                {resume.projects.map((p) => (
                  <div key={p.id} className="text-[10px] mb-2">
                    <p className="font-bold text-blue-600 dark:text-blue-400">{p.title}</p>
                    <p className="text-slate-500 leading-tight">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
