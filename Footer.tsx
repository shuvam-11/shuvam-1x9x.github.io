import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                SkillBridge
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students with industry-relevant skill courses, AI-driven resume optimization, placement readiness tracking, and direct campus recruitment opportunities.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded text-teal-400 font-semibold border border-slate-700">
                100% Verified Placements
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wide uppercase">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#courses" className="hover:text-blue-400 transition-colors">Curated Skill Courses</a></li>
              <li><a href="#jobs" className="hover:text-blue-400 transition-colors">Campus Jobs & Internships</a></li>
              <li><a href="#resume" className="hover:text-blue-400 transition-colors">AI Resume Reviewer</a></li>
              <li><a href="#quizzes" className="hover:text-blue-400 transition-colors">MCQ Quizzes & Leaderboard</a></li>
              <li><a href="#placement" className="hover:text-blue-400 transition-colors">Campus Placement Drive Tracker</a></li>
            </ul>
          </div>

          {/* Technology & Certification */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wide uppercase">Core Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>JWT Authenticated Student Profiles</li>
              <li>QR Code Certificate Verification</li>
              <li>AI Career Roadmap & Advice Engine</li>
              <li>PDF Resume Generator in One Click</li>
              <li>Real-time Application Tracker</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wide uppercase">Placement Office Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>placements@skillbridge.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>+1 (800) 555-SKILL</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>SkillBridge Center, Campus Block A</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SkillBridge Student Portal. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Campus Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
