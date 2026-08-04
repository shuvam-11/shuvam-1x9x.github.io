import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { Sparkles, X, Send, Bot, User as UserIcon, CheckCircle2, BookOpen, HelpCircle, ArrowRight } from 'lucide-react';

interface AICareerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const AICareerChatModal: React.FC<AICareerChatModalProps> = ({ isOpen, onClose, user }) => {
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [loading, setLoading] = useState(false);
  const [adviceData, setAdviceData] = useState<any>(null);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; data?: any }>>([
    {
      sender: 'ai',
      text: `Hello ${user?.name || 'Student'}! I am your AI Placement & Career Advisor. I analyze your current skills (${(user?.skills || []).join(
        ', '
      )}) and branch (${user?.branch || 'CSE'}) to build personalized preparation roadmaps for top tech companies. What position are you aiming for?`,
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    setMessages((prev) => [...prev, { sender: 'user', text: `Generate career preparation roadmap for: ${targetRole}` }]);
    try {
      const res = await api.getAICareerAdvice(user?.skills || [], user?.branch || 'CSE', targetRole);
      setAdviceData(res.advice);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Here is your custom AI Career Analysis for **${res.advice.targetRole}**. Your estimated readiness score is **${res.advice.readinessScore}%**.`,
          data: res.advice,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'I faced a transient issue connecting to the AI model. Please retry.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const query = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setLoading(true);

    try {
      const res = await api.getAICareerAdvice([...user.skills, query], user.branch, targetRole);
      setAdviceData(res.advice);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Based on your question regarding "${query}", I've refreshed your recommended roadmap and key interview technical questions below!`,
          data: res.advice,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Unable to process query at the moment. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">AI Placement & Career Advisor</h3>
              <p className="text-xs text-blue-100">Powered by Gemini AI • Personalized for {user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Input Controls Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Target Position:</span>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. SDE-1, Data Analyst, Cloud Intern"
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            id="btn-ai-generate-roadmap"
            onClick={handleGenerateRoadmap}
            disabled={loading}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Roadmap</span>
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[85%] text-xs rounded-2xl p-3.5 space-y-3 ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
              }`}>
                <p className="leading-relaxed">{m.text}</p>

                {m.data && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3 text-slate-800 dark:text-slate-200">
                    {/* Readiness score pill */}
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="font-bold">Career Readiness Score</span>
                      <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-extrabold rounded-lg">
                        {m.data.readinessScore}% Ready
                      </span>
                    </div>

                    {/* Top Recommended Skills */}
                    <div>
                      <h5 className="font-bold mb-1.5 flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> High-Impact Skills to Acquire:
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {m.data.topRecommendedSkills?.map((sk: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-medium border border-blue-200 dark:border-blue-800"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Weekly Roadmap */}
                    {m.data.weeklyRoadmap && (
                      <div>
                        <h5 className="font-bold mb-1.5 flex items-center gap-1 text-teal-600 dark:text-teal-400">
                          <BookOpen className="w-3.5 h-3.5" /> Step-by-Step Preparation Roadmap:
                        </h5>
                        <div className="space-y-2">
                          {m.data.weeklyRoadmap.map((step: any, stIdx: number) => (
                            <div
                              key={stIdx}
                              className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-extrabold text-blue-600 dark:text-blue-400">{step.week}</span>
                                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{step.focusArea}</span>
                              </div>
                              <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                                {step.actionItems?.map((act: string, aIdx: number) => (
                                  <li key={aIdx}>{act}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Technical Interview Questions */}
                    {m.data.keyInterviewQuestions && (
                      <div>
                        <h5 className="font-bold mb-1.5 flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                          <HelpCircle className="w-3.5 h-3.5" /> Frequent Campus Interview Questions:
                        </h5>
                        <ul className="space-y-1 text-[11px]">
                          {m.data.keyInterviewQuestions.map((q: string, qIdx: number) => (
                            <li
                              key={qIdx}
                              className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-medium"
                            >
                              ❓ {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-xs text-blue-600 dark:text-blue-400 animate-pulse">
              <Bot className="w-4 h-4" />
              <span>AI is analyzing your skills and generating custom recommendations...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleCustomQuestion} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything about your placement preparation..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
