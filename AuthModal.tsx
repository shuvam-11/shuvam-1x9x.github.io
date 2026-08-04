import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { X, Lock, Mail, User as UserIcon, GraduationCap, Building, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: User) => void;
  onLogin?: (email: string, role: UserRole) => Promise<void>;
  onRegister?: (data: any) => Promise<void>;
  onForgotPassword?: (email: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onLogin,
  onRegister,
  onForgotPassword,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('alex.rivera@student.edu');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('National Institute of Technology');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const performLogin = async (eEmail: string, eRole: UserRole) => {
    if (onLogin) {
      await onLogin(eEmail, eRole);
    } else {
      const res = await api.login(eEmail, eRole);
      if (res.user && onAuthSuccess) {
        onAuthSuccess(res.user);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (tab === 'login') {
        await performLogin(email, role);
        setMsg({ text: 'Logged in successfully!', type: 'success' });
        setTimeout(() => onClose(), 600);
      } else if (tab === 'register') {
        const regData = {
          name: name || email.split('@')[0],
          email,
          role,
          college,
          branch,
          graduationYear: '2026',
        };
        if (onRegister) {
          await onRegister(regData);
        } else {
          const res = await api.register(regData);
          if (res.user && onAuthSuccess) {
            onAuthSuccess(res.user);
          }
        }
        setMsg({ text: 'Registration completed!', type: 'success' });
        setTimeout(() => onClose(), 600);
      } else {
        if (onForgotPassword) {
          await onForgotPassword(email);
        } else {
          await api.forgotPassword(email);
        }
        setMsg({ text: 'Password reset link sent to your email.', type: 'success' });
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'Operation failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStudentLogin = async () => {
    setLoading(true);
    try {
      await performLogin('alex.rivera@student.edu', 'student');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setLoading(true);
    try {
      await performLogin('admin@skillbridge.edu', 'admin');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">SkillBridge Portal</h3>
              <p className="text-xs text-blue-100">
                {tab === 'login' && 'Sign in to access student courses & placement tools'}
                {tab === 'register' && 'Create your student or coordinator account'}
                {tab === 'forgot' && 'Reset your SkillBridge portal password'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Demo Login Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Instant Demo Login:</span>
          <div className="flex gap-2">
            <button
              type="button"
              id="btn-demo-student"
              onClick={handleQuickStudentLogin}
              className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded font-bold hover:bg-blue-200 transition-colors flex items-center gap-1"
            >
              <UserIcon className="w-3 h-3" /> Student
            </button>
            <button
              type="button"
              id="btn-demo-admin"
              onClick={handleQuickAdminLogin}
              className="px-2.5 py-1 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded font-bold hover:bg-teal-200 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {msg && (
            <div
              className={`p-3 mb-4 text-xs rounded-lg flex items-center gap-2 ${
                msg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab !== 'forgot' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Portal Role
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('student');
                      setEmail('alex.rivera@student.edu');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                      role === 'student'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5" /> Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('admin');
                      setEmail('admin@skillbridge.edu');
                    }}
                    className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                      role === 'admin'
                        ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </button>
                </div>
              </div>
            )}

            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {tab !== 'forgot' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            {tab === 'register' && role === 'student' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    College Name
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Branch / Major
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>
                    {tab === 'login' && 'Sign In to Portal'}
                    {tab === 'register' && 'Create SkillBridge Account'}
                    {tab === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Tab Navigation */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            {tab === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Create new account
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline mx-auto"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
