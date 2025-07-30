export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface ExamAttempt {
  id: string;
  courseId: string;
  userId: string;
  questions: ExamQuestion[];
  answers: Record<string, number>;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  timeSpent: number; // in minutes
}

export interface ExamResult {
  attempt: ExamAttempt;
  certificateEligible: boolean;
  canRetake: boolean;
}