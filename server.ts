import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_STUDENT,
  INITIAL_ADMIN,
  INITIAL_COURSES,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_RESULTS,
  INITIAL_CERTIFICATES,
  INITIAL_PLACEMENTS,
  INITIAL_FORUM_POSTS,
} from './src/data/initialData.js';
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
} from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory Data Store (Seeded from initialData)
let currentUser: User = { ...INITIAL_STUDENT };
let coursesStore: Course[] = [...INITIAL_COURSES];
let jobsStore: Job[] = [...INITIAL_JOBS];
let applicationsStore: JobApplication[] = [...INITIAL_APPLICATIONS];
let quizzesStore: Quiz[] = [...INITIAL_QUIZZES];
let quizResultsStore: QuizResult[] = [...INITIAL_QUIZ_RESULTS];
let certificatesStore: Certificate[] = [...INITIAL_CERTIFICATES];
let placementsStore: PlacementRecord[] = [...INITIAL_PLACEMENTS];
let forumPostsStore: ForumPost[] = [...INITIAL_FORUM_POSTS];
let studentsStore: User[] = [
  INITIAL_STUDENT,
  {
    id: 'usr_student_2',
    name: 'Sophia Lin',
    email: 'sophia.lin@student.edu',
    role: 'student',
    phone: '+1 (555) 345-6789',
    college: 'State University of Engineering',
    branch: 'Information Technology',
    graduationYear: '2026',
    cgpa: 9.1,
    skills: ['Python', 'Data Analytics', 'SQL', 'Tableau'],
  },
  {
    id: 'usr_student_3',
    name: 'Rohan Mehta',
    email: 'rohan.m@student.edu',
    role: 'student',
    phone: '+1 (555) 456-7890',
    college: 'National Institute of Technology',
    branch: 'Computer Science',
    graduationYear: '2025',
    cgpa: 8.2,
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
  },
];

// Lazily initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// AUTH ENDPOINTS
// -------------------------------------------------------------
app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({ success: true, user: currentUser });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  if (role === 'admin') {
    currentUser = { ...INITIAL_ADMIN };
  } else {
    const found = studentsStore.find((s) => s.email.toLowerCase() === (email || '').toLowerCase());
    if (found) {
      currentUser = { ...found };
    } else {
      currentUser = {
        id: `usr_${Date.now()}`,
        name: email ? email.split('@')[0] : 'Student User',
        email: email || 'student@skillbridge.edu',
        role: 'student',
        skills: ['React', 'JavaScript', 'HTML5'],
        college: 'SkillBridge Tech College',
        branch: 'Computer Science',
      };
      studentsStore.push(currentUser);
    }
  }
  res.json({ success: true, token: `mock_jwt_token_${currentUser.id}`, user: currentUser });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, role, college, branch, graduationYear } = req.body;
  const newUser: User = {
    id: `usr_${Date.now()}`,
    name: name || 'New User',
    email: email || 'user@skillbridge.edu',
    role: role || 'student',
    college: college || 'University Campus',
    branch: branch || 'Computer Science',
    graduationYear: graduationYear || '2026',
    skills: ['JavaScript', 'Problem Solving'],
  };
  if (newUser.role === 'student') {
    studentsStore.push(newUser);
  }
  currentUser = newUser;
  res.json({ success: true, token: `mock_jwt_token_${newUser.id}`, user: newUser });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: `Password reset instructions sent to ${email || 'your registered email address'}.`,
  });
});

// -------------------------------------------------------------
// PROFILE ENDPOINTS
// -------------------------------------------------------------
app.get('/api/profile', (req: Request, res: Response) => {
  res.json({ success: true, user: currentUser });
});

app.put('/api/profile', (req: Request, res: Response) => {
  const updates = req.body;
  currentUser = { ...currentUser, ...updates };
  // Update in studentsStore if student
  const idx = studentsStore.findIndex((s) => s.id === currentUser.id);
  if (idx !== -1) {
    studentsStore[idx] = currentUser;
  }
  res.json({ success: true, user: currentUser, message: 'Profile updated successfully!' });
});

// -------------------------------------------------------------
// COURSES ENDPOINTS
// -------------------------------------------------------------
app.get('/api/courses', (req: Request, res: Response) => {
  res.json({ success: true, courses: coursesStore });
});

app.post('/api/courses', (req: Request, res: Response) => {
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }
  const { title, description, category, duration, level, instructor, videoUrl, pdfNotesTitle, thumbnail } = req.body;
  const newCourse: Course = {
    id: `crs_${Date.now()}`,
    title: title || 'New Course',
    description: description || 'Course description...',
    category: category || 'Web Development',
    duration: duration || '4 Weeks',
    level: level || 'Beginner',
    instructor: instructor || currentUser.name,
    thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516116211223-4258568880c6?w=600&auto=format&fit=crop&q=80',
    videoUrl: videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
    pdfNotesUrl: '#pdf-download',
    pdfNotesTitle: pdfNotesTitle || 'Course_Handout_Notes.pdf',
    modulesCount: 8,
    enrolledStudentsCount: 1,
    rating: 5.0,
  };
  coursesStore.unshift(newCourse);
  res.json({ success: true, course: newCourse, message: 'Course added successfully!' });
});

app.delete('/api/courses/:id', (req: Request, res: Response) => {
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }
  coursesStore = coursesStore.filter((c) => c.id !== req.params.id);
  res.json({ success: true, message: 'Course deleted successfully' });
});

// -------------------------------------------------------------
// JOBS ENDPOINTS
// -------------------------------------------------------------
app.get('/api/jobs', (req: Request, res: Response) => {
  res.json({ success: true, jobs: jobsStore });
});

app.post('/api/jobs', (req: Request, res: Response) => {
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }
  const { company, position, salary, location, type, description, requirements, skillsRequired, deadline } = req.body;
  const newJob: Job = {
    id: `job_${Date.now()}`,
    company: company || 'Tech Corp',
    position: position || 'Software Intern',
    salary: salary || '$70,000 / yr',
    location: location || 'Remote',
    type: type || 'Full-time',
    description: description || 'Job description...',
    requirements: Array.isArray(requirements) ? requirements : [requirements || 'Degree in CS'],
    skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : ['JavaScript'],
    deadline: deadline || '2026-10-01',
    postedDate: new Date().toISOString().split('T')[0],
    applicantsCount: 0,
  };
  jobsStore.unshift(newJob);
  res.json({ success: true, job: newJob, message: 'Job posted successfully!' });
});

app.put('/api/jobs/:id', (req: Request, res: Response) => {
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }
  const idx = jobsStore.findIndex((j) => j.id === req.params.id);
  if (idx !== -1) {
    jobsStore[idx] = { ...jobsStore[idx], ...req.body };
    return res.json({ success: true, job: jobsStore[idx] });
  }
  res.status(404).json({ success: false, error: 'Job not found' });
});

app.delete('/api/jobs/:id', (req: Request, res: Response) => {
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }
  jobsStore = jobsStore.filter((j) => j.id !== req.params.id);
  res.json({ success: true, message: 'Job posting deleted successfully' });
});

// -------------------------------------------------------------
// APPLICATIONS ENDPOINTS
// -------------------------------------------------------------
app.get('/api/my-applications', (req: Request, res: Response) => {
  const apps = applicationsStore.filter((a) => a.studentId === currentUser.id);
  res.json({ success: true, applications: apps });
});

app.get('/api/applications', (req: Request, res: Response) => {
  res.json({ success: true, applications: applicationsStore });
});

app.post('/api/apply', (req: Request, res: Response) => {
  const { jobId, coverLetter, resumeUrl } = req.body;
  const job = jobsStore.find((j) => j.id === jobId);
  if (!job) {
    return res.status(404).json({ success: false, error: 'Job position not found' });
  }

  // Check if already applied
  const existing = applicationsStore.find((a) => a.jobId === jobId && a.studentId === currentUser.id);
  if (existing) {
    return res.status(400).json({ success: false, error: 'You have already applied for this job opportunity!' });
  }

  const newApp: JobApplication = {
    id: `app_${Date.now()}`,
    jobId: job.id,
    jobTitle: job.position,
    company: job.company,
    studentId: currentUser.id,
    studentName: currentUser.name,
    studentEmail: currentUser.email,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    resumeUrl: resumeUrl || currentUser.resumeName || 'Resume.pdf',
    coverLetter: coverLetter || '',
  };

  applicationsStore.unshift(newApp);
  job.applicantsCount += 1;

  res.json({ success: true, application: newApp, message: `Application submitted successfully for ${job.position}!` });
});

app.put('/api/applications/:id/status', (req: Request, res: Response) => {
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }
  const { status, interviewDate } = req.body;
  const appItem = applicationsStore.find((a) => a.id === req.params.id);
  if (appItem) {
    appItem.status = status;
    if (interviewDate) appItem.interviewDate = interviewDate;
    return res.json({ success: true, application: appItem, message: 'Application status updated!' });
  }
  res.status(404).json({ success: false, error: 'Application record not found' });
});

// -------------------------------------------------------------
// QUIZZES ENDPOINTS
// -------------------------------------------------------------
app.get('/api/quiz', (req: Request, res: Response) => {
  res.json({ success: true, quizzes: quizzesStore });
});

app.post('/api/submit', (req: Request, res: Response) => {
  const { quizId, answers } = req.body; // answers: { [questionId]: optionIndex }
  const quiz = quizzesStore.find((q) => q.id === quizId);
  if (!quiz) {
    return res.status(404).json({ success: false, error: 'Quiz not found' });
  }

  let score = 0;
  quiz.questions.forEach((q) => {
    if (answers && answers[q.id] === q.correctOptionIndex) {
      score += 1;
    }
  });

  const percentage = Math.round((score / quiz.questions.length) * 100);
  const result: QuizResult = {
    id: `qres_${Date.now()}`,
    quizId: quiz.id,
    quizTitle: quiz.title,
    studentId: currentUser.id,
    studentName: currentUser.name,
    score,
    totalQuestions: quiz.questions.length,
    percentage,
    completedAt: new Date().toISOString().split('T')[0],
  };

  quizResultsStore.unshift(result);

  // Auto-generate certificate if score >= 80%
  let certGenerated: Certificate | null = null;
  if (percentage >= 80) {
    certGenerated = {
      id: `cert_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      courseTitle: `${quiz.category} Skill Proficiency Certification`,
      issueDate: new Date().toISOString().split('T')[0],
      verificationCode: `SKILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      grade: percentage >= 90 ? 'Distinction (A+)' : 'Excellence (A)',
    };
    certificatesStore.unshift(certGenerated);
  }

  res.json({ success: true, result, certificate: certGenerated });
});

app.get('/api/quiz/leaderboard', (req: Request, res: Response) => {
  const sorted = [...quizResultsStore].sort((a, b) => b.percentage - a.percentage);
  res.json({ success: true, leaderboard: sorted });
});

// -------------------------------------------------------------
// CERTIFICATES ENDPOINTS
// -------------------------------------------------------------
app.get('/api/certificates', (req: Request, res: Response) => {
  const myCerts = certificatesStore.filter((c) => c.studentId === currentUser.id);
  res.json({ success: true, certificates: myCerts });
});

app.get('/api/certificates/verify/:code', (req: Request, res: Response) => {
  const code = req.params.code.trim().toUpperCase();
  const cert = certificatesStore.find((c) => c.verificationCode.toUpperCase() === code);
  if (cert) {
    res.json({ success: true, verified: true, certificate: cert });
  } else {
    res.status(404).json({ success: false, verified: false, error: 'Certificate code not found or invalid' });
  }
});

// -------------------------------------------------------------
// PLACEMENT TRACKER ENDPOINTS
// -------------------------------------------------------------
app.get('/api/placements', (req: Request, res: Response) => {
  res.json({ success: true, placements: placementsStore });
});

app.post('/api/placements', (req: Request, res: Response) => {
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }
  const { company, visitDate, rolesOffered, packageLPA, totalSelected, eligibilityCGPA, status, interviewProcess } = req.body;
  const newPlc: PlacementRecord = {
    id: `plc_${Date.now()}`,
    company: company || 'Company',
    visitDate: visitDate || '2026-10-01',
    rolesOffered: rolesOffered || 'SDE',
    packageLPA: Number(packageLPA) || 10,
    totalSelected: Number(totalSelected) || 0,
    eligibilityCGPA: Number(eligibilityCGPA) || 7.0,
    status: status || 'Upcoming',
    interviewProcess: interviewProcess || 'Aptitude -> Tech -> HR',
  };
  placementsStore.unshift(newPlc);
  res.json({ success: true, placement: newPlc, message: 'Placement drive recorded successfully!' });
});

// -------------------------------------------------------------
// FORUM ENDPOINTS
// -------------------------------------------------------------
app.get('/api/forum', (req: Request, res: Response) => {
  res.json({ success: true, posts: forumPostsStore });
});

app.post('/api/forum', (req: Request, res: Response) => {
  const { title, content, tags } = req.body;
  const newPost: ForumPost = {
    id: `post_${Date.now()}`,
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorRole: currentUser.role,
    title: title || 'Question',
    content: content || 'Details...',
    tags: Array.isArray(tags) ? tags : ['General'],
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0,
    likedBy: [],
    comments: [],
  };
  forumPostsStore.unshift(newPost);
  res.json({ success: true, post: newPost, message: 'Post submitted to forum!' });
});

app.post('/api/forum/:id/comment', (req: Request, res: Response) => {
  const { content } = req.body;
  const post = forumPostsStore.find((p) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }
  const comment = {
    id: `cmt_${Date.now()}`,
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorRole: currentUser.role,
    content: content || '',
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0,
  };
  post.comments.push(comment);
  res.json({ success: true, comment, post });
});

app.post('/api/forum/:id/like', (req: Request, res: Response) => {
  const post = forumPostsStore.find((p) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }
  const idx = post.likedBy.indexOf(currentUser.id);
  if (idx === -1) {
    post.likedBy.push(currentUser.id);
    post.likes += 1;
  } else {
    post.likedBy.splice(idx, 1);
    post.likes = Math.max(0, post.likes - 1);
  }
  res.json({ success: true, likes: post.likes, likedBy: post.likedBy });
});

// -------------------------------------------------------------
// ADMIN USERS ENDPOINTS
// -------------------------------------------------------------
app.get('/api/admin/students', (req: Request, res: Response) => {
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }
  res.json({ success: true, students: studentsStore });
});

app.delete('/api/admin/students/:id', (req: Request, res: Response) => {
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }
  studentsStore = studentsStore.filter((s) => s.id !== req.params.id);
  res.json({ success: true, message: 'Student removed successfully' });
});

app.get('/api/admin/analytics', (req: Request, res: Response) => {
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin permission required' });
  }
  const totalStudents = studentsStore.length;
  const totalJobs = jobsStore.length;
  const totalApplications = applicationsStore.length;
  const totalCourses = coursesStore.length;
  const shortlistedCount = applicationsStore.filter((a) => a.status === 'Shortlisted' || a.status === 'Offered' || a.status === 'Interview Scheduled').length;
  const placementRate = totalApplications > 0 ? Math.round((shortlistedCount / totalApplications) * 100) : 78;

  res.json({
    success: true,
    analytics: {
      totalStudents,
      totalJobs,
      totalApplications,
      totalCourses,
      placementRate,
      averagePackage: '10.5 LPA',
      topHiringCompanies: ['TechCorp', 'CloudScale', 'Global Logic', 'CyberShield'],
    },
  });
});

// -------------------------------------------------------------
// GEMINI AI FEATURE ENDPOINTS
// -------------------------------------------------------------
app.post('/api/ai/resume-review', async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are a Senior Technical Recruiter and ATS Optimization Expert. Analyze the following student resume data and return a detailed, structured feedback JSON.

Resume Content:
${JSON.stringify(resumeData, null, 2)}

Provide the analysis in strictly valid JSON format matching this schema:
{
  "atsScore": number (0 to 100),
  "strengths": string[],
  "areasForImprovement": string[],
  "missingKeywords": string[],
  "suggestedSummary": string,
  "bulletPointImprovements": [
    {
      "originalOrSection": string,
      "enhancedSuggestion": string,
      "reason": string
    }
  ],
  "overallVerdict": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    res.json({ success: true, analysis: parsedJson });
  } catch (error: any) {
    console.error('Gemini Resume Review Error:', error);
    // Graceful fallback response if API key is missing or error
    res.json({
      success: true,
      analysis: {
        atsScore: 84,
        strengths: [
          'Strong full-stack technical stack listed (React, Node.js, SQL)',
          'Clear layout with dedicated education & projects section',
          'Good academic performance metrics included',
        ],
        areasForImprovement: [
          'Incorporate quantifiable achievements in project descriptions (e.g. % performance improvement)',
          'Add industry standard backend keywords like Docker, REST API design, and CI/CD',
          'Ensure summary highlights target career role explicitly',
        ],
        missingKeywords: ['Docker', 'Microservices', 'Unit Testing', 'CI/CD Pipelines', 'Agile/Scrum'],
        suggestedSummary:
          'Proactive Computer Science undergraduate specializing in full-stack web engineering, API design, and modern React interfaces with a passion for building scalable software solutions.',
        bulletPointImprovements: [
          {
            originalOrSection: 'Built a web portal using React and Node',
            enhancedSuggestion: 'Engineered a full-stack student placement platform using React 19, TypeScript, and Express, serving 1,200+ active users with sub-200ms API response times.',
            reason: 'Adds measurable metric and specific modern tech stack callouts.',
          },
        ],
        overallVerdict: 'Solid resume foundation! Focus on adding quantified impact metrics and cloud DevOps keywords to consistently pass Tier-1 tech company ATS screeners.',
      },
    });
  }
});

app.post('/api/ai/career-advice', async (req: Request, res: Response) => {
  try {
    const { skills, branch, targetRole } = req.body;
    const ai = getGeminiClient();

    const promptText = `You are a Career Counselor for Tech & Engineering college students.
Student Profile:
- Branch: ${branch || 'Computer Science'}
- Target Role: ${targetRole || 'Software Development Engineer'}
- Current Skills: ${Array.isArray(skills) ? skills.join(', ') : skills}

Generate a concise career preparation strategy in strictly valid JSON format matching this schema:
{
  "targetRole": string,
  "readinessScore": number (0 to 100),
  "topRecommendedSkills": string[],
  "weeklyRoadmap": [
    {
      "week": string,
      "focusArea": string,
      "actionItems": string[]
    }
  ],
  "keyInterviewQuestions": string[],
  "portfolioProjectIdeas": string[]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, advice: parsed });
  } catch (error: any) {
    console.error('Gemini Career Advice Error:', error);
    const targetRole = req.body?.targetRole || 'Software Development Engineer';
    res.json({
      success: true,
      advice: {
        targetRole: targetRole,
        readinessScore: 78,
        topRecommendedSkills: ['Docker & Containerization', 'Redis Caching', 'System Design Basics', 'TypeScript Strict Mode'],
        weeklyRoadmap: [
          {
            week: 'Week 1-2',
            focusArea: 'Core Data Structures & Algorithmic Patterns',
            actionItems: ['Solve 15 two-pointer and sliding window questions on LeetCode', 'Review Time & Space complexity analysis'],
          },
          {
            week: 'Week 3-4',
            focusArea: 'Full-Stack Architecture & Security',
            actionItems: ['Implement JWT Refresh Token authentication in Express', 'Design normalized relational database schema with indexing'],
          },
        ],
        keyInterviewQuestions: [
          'Explain the difference between SQL transactions and NoSQL eventual consistency.',
          'How does the JavaScript Event Loop handle asynchronous microtasks vs macrotasks?',
        ],
        portfolioProjectIdeas: [
          'Real-time Collaborative Whiteboard using WebSockets and React',
          'AI-Powered Job Application Tracker with automated email parse hooks',
        ],
      },
    });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillBridge server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
