import React from 'react';
import { User } from '../types';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Award,
  FileText,
  BarChart2,
  Users,
  MessageSquare,
  Sparkles,
  User as UserIcon,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  Building2,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  currentUser?: User | null;
  user?: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenAIChat: () => void;
  onLogout?: () => void;
  onSwitchRole: (role: 'student' | 'admin') => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  user,
  activeTab,
  setActiveTab,
  theme,
  onToggleTheme,
  darkMode,
  setDarkMode,
  onOpenAuth,
  onOpenAIChat,
  onLogout,
  onSwitchRole,
}) => {
  const userObj = currentUser !== undefined ? currentUser : user;
  const isStudent = !userObj || userObj.role === 'student';

  const isDark = theme ? theme === 'dark' : Boolean(darkMode);
  const handleToggleTheme = () => {
    if (onToggleTheme) onToggleTheme();
    else if (setDarkMode) setDarkMode(!darkMode);
  };

  const studentTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'jobs', label: 'Job Portal', icon: Briefcase },
    { id: 'resume-builder', label: 'Resume Builder', icon: FileText },
    { id: 'quizzes', label: 'Quizzes', icon: Award },
    { id: 'placement-tracker', label: 'Placement Tracker', icon: Building2 },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'certificates', label: 'Certificates', icon: ShieldCheck },
  ];

  const adminTabs = [
    { id: 'admin-analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'admin-students', label: 'Students', icon: Users },
    { id: 'admin-jobs', label: 'Manage Jobs', icon: Briefcase },
    { id: 'admin-courses', label: 'Manage Courses', icon: BookOpen },
    { id: 'admin-placements', label: 'Placement Drives', icon: Building2 },
  ];

  const tabsToDisplay = isStudent ? studentTabs : adminTabs;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>SkillBridge Placement Portal 2026: 120+ Top Tech Companies Active</span>
        <span className="hidden md:inline-block bg-white/20 px-2 py-0.5 rounded text-[10px]">
          94% Placement Rate
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(isStudent ? 'dashboard' : 'admin-analytics')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-bold text-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 bg-clip-text text-transparent">
                  SkillBridge
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isStudent
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                      : 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'
                  }`}
                >
                  {isStudent ? 'Student Portal' : 'Admin Portal'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Skill Development & Placement Gateway
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-2">
            {tabsToDisplay.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Role Switcher Pill */}
            <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 hidden sm:flex items-center">
              <button
                id="btn-switch-student"
                onClick={() => onSwitchRole('student')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  isStudent
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Student
              </button>
              <button
                id="btn-switch-admin"
                onClick={() => onSwitchRole('admin')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  !isStudent
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Admin
              </button>
            </div>

            {/* AI Advisor Button */}
            <button
              id="btn-ai-advisor-nav"
              onClick={onOpenAIChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white text-xs font-semibold shadow-md shadow-blue-500/10 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="btn-darkmode-toggle"
              onClick={handleToggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Profile Avatar / Login */}
            <div className="pl-2 border-l border-slate-200 dark:border-slate-800 flex items-center gap-2">
              {userObj ? (
                <>
                  <button
                    id="btn-profile-trigger"
                    onClick={() => {
                      if (isStudent) setActiveTab('dashboard');
                      else setActiveTab('admin-analytics');
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {userObj.name ? userObj.name.charAt(0) : 'U'}
                    </div>
                    <div className="hidden xl:block">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[110px]">
                        {userObj.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize truncate">
                        {userObj.role}
                      </p>
                    </div>
                  </button>

                  <button
                    id="btn-auth-logout"
                    onClick={onLogout || onOpenAuth}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Logout / Switch Account"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  id="btn-auth-open"
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Secondary Row */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
          {tabsToDisplay.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
