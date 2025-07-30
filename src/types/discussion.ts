export interface Question {
  id: string;
  lessonId: string;
  courseId: string;
  userId: string;
  userType: 'student' | 'instructor' | 'admin';
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isResolved: boolean;
  answersCount: number;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  tags: string[];
  user: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  userType: 'student' | 'instructor' | 'admin';
  content: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  isAccepted: boolean;
  isInstructorAnswer: boolean;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
}

export interface DiscussionStats {
  totalQuestions: number;
  resolvedQuestions: number;
  totalAnswers: number;
  userQuestions: number;
  userAnswers: number;
}