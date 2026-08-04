import {
  User,
  Course,
  Job,
  JobApplication,
  Quiz,
  QuizResult,
  Certificate,
  PlacementRecord,
  ForumPost,
  ResumeData,
} from '../types';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  async getCurrentUser(): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/me');
    return handleResponse(res);
  },

  async login(email: string, role: 'student' | 'admin'): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    return handleResponse(res);
  },

  async register(data: Partial<User>): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  // Profile
  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; user: User; message: string }> {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  // Courses
  async getCourses(): Promise<{ success: boolean; courses: Course[] }> {
    const res = await fetch('/api/courses');
    return handleResponse(res);
  },

  async addCourse(course: Partial<Course>): Promise<{ success: boolean; course: Course; message: string }> {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    return handleResponse(res);
  },

  async deleteCourse(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Jobs
  async getJobs(): Promise<{ success: boolean; jobs: Job[] }> {
    const res = await fetch('/api/jobs');
    return handleResponse(res);
  },

  async addJob(job: Partial<Job>): Promise<{ success: boolean; job: Job; message: string }> {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    return handleResponse(res);
  },

  async deleteJob(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Applications
  async getMyApplications(): Promise<{ success: boolean; applications: JobApplication[] }> {
    const res = await fetch('/api/my-applications');
    return handleResponse(res);
  },

  async getAllApplications(): Promise<{ success: boolean; applications: JobApplication[] }> {
    const res = await fetch('/api/applications');
    return handleResponse(res);
  },

  async applyForJob(jobId: string, coverLetter?: string, resumeUrl?: string): Promise<{ success: boolean; application: JobApplication; message: string }> {
    const res = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, coverLetter, resumeUrl }),
    });
    return handleResponse(res);
  },

  async updateApplicationStatus(id: string, status: string, interviewDate?: string): Promise<{ success: boolean; application: JobApplication; message: string }> {
    const res = await fetch(`/api/applications/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, interviewDate }),
    });
    return handleResponse(res);
  },

  // Quizzes
  async getQuizzes(): Promise<{ success: boolean; quizzes: Quiz[] }> {
    const res = await fetch('/api/quiz');
    return handleResponse(res);
  },

  async submitQuiz(quizId: string, answers: Record<string, number>): Promise<{ success: boolean; result: QuizResult; certificate?: Certificate }> {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId, answers }),
    });
    return handleResponse(res);
  },

  async getLeaderboard(): Promise<{ success: boolean; leaderboard: QuizResult[] }> {
    const res = await fetch('/api/quiz/leaderboard');
    return handleResponse(res);
  },

  // Certificates
  async getCertificates(): Promise<{ success: boolean; certificates: Certificate[] }> {
    const res = await fetch('/api/certificates');
    return handleResponse(res);
  },

  async verifyCertificate(code: string): Promise<{ success: boolean; verified: boolean; certificate?: Certificate; error?: string }> {
    const res = await fetch(`/api/certificates/verify/${encodeURIComponent(code)}`);
    return handleResponse(res);
  },

  // Placements
  async getPlacements(): Promise<{ success: boolean; placements: PlacementRecord[] }> {
    const res = await fetch('/api/placements');
    return handleResponse(res);
  },

  async addPlacement(record: Partial<PlacementRecord>): Promise<{ success: boolean; placement: PlacementRecord; message: string }> {
    const res = await fetch('/api/placements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return handleResponse(res);
  },

  // Forum
  async getForumPosts(): Promise<{ success: boolean; posts: ForumPost[] }> {
    const res = await fetch('/api/forum');
    return handleResponse(res);
  },

  async createForumPost(title: string, content: string, tags: string[]): Promise<{ success: boolean; post: ForumPost; message: string }> {
    const res = await fetch('/api/forum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags }),
    });
    return handleResponse(res);
  },

  async addForumComment(postId: string, content: string): Promise<{ success: boolean; comment: any }> {
    const res = await fetch(`/api/forum/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return handleResponse(res);
  },

  async likeForumPost(postId: string): Promise<{ success: boolean; likes: number; likedBy: string[] }> {
    const res = await fetch(`/api/forum/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
  },

  // Admin Users
  async getStudents(): Promise<{ success: boolean; students: User[] }> {
    const res = await fetch('/api/admin/students');
    return handleResponse(res);
  },

  async deleteStudent(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  async getAdminAnalytics(): Promise<{ success: boolean; analytics: any }> {
    const res = await fetch('/api/admin/analytics');
    return handleResponse(res);
  },

  // AI Gemini Features
  async getAIResumeReview(resumeData: ResumeData): Promise<{ success: boolean; analysis: any }> {
    const res = await fetch('/api/ai/resume-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData }),
    });
    return handleResponse(res);
  },

  async getAICareerAdvice(skills: string[], branch?: string, targetRole?: string): Promise<{ success: boolean; advice: any }> {
    const res = await fetch('/api/ai/career-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills, branch, targetRole }),
    });
    return handleResponse(res);
  },
};
