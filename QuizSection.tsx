import React, { useState, useEffect } from 'react';
import { Quiz, QuizResult, User, Certificate } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Award,
  Clock,
  CheckCircle2,
  Trophy,
  BarChart2,
  HelpCircle,
  X,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface QuizSectionProps {
  quizzes: Quiz[];
  user: User;
  onCertificateEarned: (cert: Certificate) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ quizzes, user, onCertificateEarned }) => {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'leaderboard'>('quizzes');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [earnedCert, setEarnedCert] = useState<Certificate | null>(null);
  const [leaderboard, setLeaderboard] = useState<QuizResult[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      api.getLeaderboard().then((res) => {
        if (res.leaderboard) setLeaderboard(res.leaderboard);
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (!selectedQuiz || quizResult) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedQuiz, quizResult]);

  const handleStartQuiz = (q: Quiz) => {
    setSelectedQuiz(q);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setTimeLeftSeconds(q.timeLimitMinutes * 60);
    setQuizResult(null);
    setEarnedCert(null);
  };

  const handleOptionSelect = (qId: string, optionIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleQuizSubmit = async () => {
    if (!selectedQuiz || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.submitQuiz(selectedQuiz.id, userAnswers);
      setQuizResult(res.result);
      if (res.certificate) {
        setEarnedCert(res.certificate);
        onCertificateEarned(res.certificate);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" /> Skill Assessment Quizzes & Leaderboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test your domain knowledge in HTML, CSS, JS, Python, SQL, and Aptitude. Score 80%+ to unlock verifiable certificates.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'quizzes'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Quizzes ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'leaderboard'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> Leaderboard
          </button>
        </div>
      </div>

      {/* Quizzes Grid View */}
      {activeTab === 'quizzes' && !selectedQuiz && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                    {quiz.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {quiz.timeLimitMinutes} Mins
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{quiz.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {quiz.questions.length} Multiple Choice Questions • Passing threshold: 80%
                </p>
              </div>

              <button
                id={`btn-start-quiz-${quiz.id}`}
                onClick={() => handleStartQuiz(quiz)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Start MCQ Test
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Live Quiz Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Quiz Top Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">{selectedQuiz.title}</h3>
                <p className="text-xs text-blue-100">Question {currentQuestionIdx + 1} of {selectedQuiz.questions.length}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {formatTime(timeLeftSeconds)}
                </div>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Quiz Canvas or Results */}
            <div className="p-6">
              {quizResult ? (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                    {quizResult.percentage >= 80 ? '🎉' : '📊'}
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                      Quiz Completed! Score: {quizResult.score} / {quizResult.totalQuestions} ({quizResult.percentage}%)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {quizResult.percentage >= 80
                        ? 'Great job! You passed with excellence.'
                        : 'Review course notes and attempt again to reach 80%+ for certification.'}
                    </p>
                  </div>

                  {earnedCert && (
                    <div className="p-4 bg-teal-50 dark:bg-teal-900/40 border border-teal-300 dark:border-teal-700 rounded-2xl text-xs text-left space-y-1">
                      <p className="font-extrabold text-teal-800 dark:text-teal-200 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-teal-600" /> Certificate Earned!
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">
                        Verification Code: <strong className="font-mono">{earnedCert.verificationCode}</strong>
                      </p>
                    </div>
                  )}

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleStartQuiz(selectedQuiz)}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retake Test
                    </button>
                    <button
                      onClick={() => setSelectedQuiz(null)}
                      className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Question */}
                  {(() => {
                    const q = selectedQuiz.questions[currentQuestionIdx];
                    if (!q) return null;
                    return (
                      <div className="space-y-4">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-snug">
                          {q.question}
                        </h4>

                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = userAnswers[q.id] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleOptionSelect(q.id, oIdx)}
                                className={`w-full p-3 text-left rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-700 dark:text-blue-300 font-bold shadow-sm'
                                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                <span>{opt}</span>
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Bottom Nav inside test */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {currentQuestionIdx < selectedQuiz.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                        className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        id="btn-submit-quiz"
                        onClick={handleQuizSubmit}
                        disabled={submitting}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        {submitting ? 'Submitting...' : 'Submit Test'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard View */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Global SkillBridge Student Leaderboard
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Quiz Topic</th>
                  <th className="p-3">Score %</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leaderboard.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold">
                      {idx === 0 && '🥇 1st'}
                      {idx === 1 && '🥈 2nd'}
                      {idx === 2 && '🥉 3rd'}
                      {idx > 2 && `#${idx + 1}`}
                    </td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{item.studentName}</td>
                    <td className="p-3">{item.quizTitle}</td>
                    <td className="p-3 font-extrabold text-emerald-600 dark:text-emerald-400">{item.percentage}%</td>
                    <td className="p-3 text-slate-400">{item.completedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
