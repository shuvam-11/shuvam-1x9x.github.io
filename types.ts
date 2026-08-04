export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  college?: string;
  branch?: string;
  graduationYear?: string;
  skills: string[];
  resumeUrl?: string;
  resumeName?: string;
  profileImage?: string;
  bio?: string;
  cgpa?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  thumbnail: string;
  videoUrl: string;
  pdfNotesUrl?: string;
  pdfNotesTitle?: string;
  modulesCount: number;
  enrolledStudentsCount: number;
  rating: number;
  quizId?: string;
}

export interface Job {
  id: string;
  company: string;
  companyLogo?: string;
  position: string;
  salary: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Part-time' | 'Remote';
  description: string;
  requirements: string[];
  skillsRequired: string[];
  deadline: string;
  postedDate: string;
  applicantsCount: number;
}

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Offered' | 'Rejected';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  appliedDate: string;
  status: ApplicationStatus;
  resumeUrl?: string;
  coverLetter?: string;
  interviewDate?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: 'HTML' | 'CSS' | 'JavaScript' | 'Python' | 'SQL' | 'Aptitude';
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId?: string;
  courseTitle: string;
  issueDate: string;
  verificationCode: string;
  grade: string;
}

export interface PlacementRecord {
  id: string;
  company: string;
  visitDate: string;
  rolesOffered: string;
  packageLPA: number;
  totalSelected: number;
  eligibilityCGPA: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  interviewProcess: string;
}

export interface ForumComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
  likes: number;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  likes: number;
  likedBy: string[];
  comments: ForumComment[];
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    summary: string;
  };
  education: {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear: string;
    grade: string;
  }[];
  experience: {
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  projects: {
    id: string;
    title: string;
    techStack: string;
    link: string;
    description: string;
  }[];
  skills: string[];
  certifications: string[];
}
