import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Course, Lesson, User, UserProgress } from '@/types/course';
import { ExamAttempt } from '@/types/exam';
import { useNotifications } from '@/contexts/NotificationContext';

interface LearningState {
  user: User | null;
  enrolledCourses: Course[];
  courseProgress: Record<string, UserProgress>;
  currentLesson: {
    courseId: string;
    lessonId: string;
    lesson: Lesson | null;
  } | null;
  bookmarks: string[];
  recentActivity: ActivityItem[];
  settings: UserSettings;
  examAttempts: Record<string, ExamAttempt[]>; // courseId -> attempts
  isLoading: boolean;
  error: string | null;
}

interface ActivityItem {
  id: string;
  type: 'lesson_started' | 'lesson_completed' | 'course_enrolled' | 'certificate_earned';
  courseId: string;
  lessonId?: string;
  timestamp: string;
  data?: any;
}

interface UserSettings {
  videoQuality: 'auto' | '360p' | '720p' | '1080p';
  playbackSpeed: number;
  autoPlay: boolean;
  skipIntro: boolean;
  enableCaptions: boolean;
  language: 'ar' | 'en';
  notifications: {
    lessonReminders: boolean;
    courseUpdates: boolean;
    achievements: boolean;
  };
}

type LearningAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ENROLL_COURSE'; payload: Course }
  | { type: 'UPDATE_PROGRESS'; payload: { courseId: string; progress: UserProgress } }
  | { type: 'SET_CURRENT_LESSON'; payload: { courseId: string; lessonId: string; lesson: Lesson } }
  | { type: 'COMPLETE_LESSON'; payload: { courseId: string; lessonId: string } }
  | { type: 'ADD_BOOKMARK'; payload: string }
  | { type: 'REMOVE_BOOKMARK'; payload: string }
  | { type: 'ADD_ACTIVITY'; payload: ActivityItem }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'ADD_EXAM_ATTEMPT'; payload: { courseId: string; attempt: ExamAttempt } }
  | { type: 'LOAD_STATE'; payload: Partial<LearningState> };

const initialState: LearningState = {
  user: null,
  enrolledCourses: [],
  courseProgress: {},
  currentLesson: null,
  bookmarks: [],
  recentActivity: [],
  settings: {
    videoQuality: 'auto',
    playbackSpeed: 1,
    autoPlay: false,
    skipIntro: false,
    enableCaptions: true,
    language: 'ar',
    notifications: {
      lessonReminders: true,
      courseUpdates: true,
      achievements: true,
    }
  },
  examAttempts: {},
  isLoading: false,
  error: null
};

function learningReducer(state: LearningState, action: LearningAction): LearningState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'ENROLL_COURSE':
      return {
        ...state,
        enrolledCourses: [...state.enrolledCourses, action.payload],
        courseProgress: {
          ...state.courseProgress,
          [action.payload.id]: {
            courseId: action.payload.id,
            completedLessons: [],
            progressPercentage: 0,
            enrollmentDate: new Date().toISOString(),
            certificateIssued: false
          }
        }
      };

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        courseProgress: {
          ...state.courseProgress,
          [action.payload.courseId]: action.payload.progress
        }
      };

    case 'SET_CURRENT_LESSON':
      return {
        ...state,
        currentLesson: {
          courseId: action.payload.courseId,
          lessonId: action.payload.lessonId,
          lesson: action.payload.lesson
        }
      };

    case 'COMPLETE_LESSON':
      const currentProgress = state.courseProgress[action.payload.courseId];
      if (!currentProgress) return state;

      const updatedLessons = [...currentProgress.completedLessons];
      if (!updatedLessons.includes(action.payload.lessonId)) {
        updatedLessons.push(action.payload.lessonId);
      }

      const course = state.enrolledCourses.find(c => c.id === action.payload.courseId);
      const totalLessons = course?.lessons.length || 1;
      const progressPercentage = (updatedLessons.length / totalLessons) * 100;

      return {
        ...state,
        courseProgress: {
          ...state.courseProgress,
          [action.payload.courseId]: {
            ...currentProgress,
            completedLessons: updatedLessons,
            progressPercentage,
            lastAccessedLesson: action.payload.lessonId,
            ...(progressPercentage === 100 && {
              completionDate: new Date().toISOString(),
              certificateIssued: true
            })
          }
        },
        recentActivity: [
          {
            id: `${action.payload.courseId}-${action.payload.lessonId}-${Date.now()}`,
            type: 'lesson_completed',
            courseId: action.payload.courseId,
            lessonId: action.payload.lessonId,
            timestamp: new Date().toISOString()
          },
          ...state.recentActivity.slice(0, 9) // Keep last 10 activities
        ]
      };

    case 'ADD_BOOKMARK':
      return {
        ...state,
        bookmarks: [...state.bookmarks, action.payload]
      };

    case 'REMOVE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.filter(id => id !== action.payload)
      };

    case 'ADD_ACTIVITY':
      return {
        ...state,
        recentActivity: [action.payload, ...state.recentActivity.slice(0, 9)]
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'ADD_EXAM_ATTEMPT':
      const courseAttempts = state.examAttempts[action.payload.courseId] || [];
      const newAttempt = action.payload.attempt;
      
      // Update course progress if exam passed
      let updatedCourseProgress = state.courseProgress;
      if (newAttempt.passed) {
        const currentProgress = state.courseProgress[action.payload.courseId];
        if (currentProgress) {
          updatedCourseProgress = {
            ...state.courseProgress,
            [action.payload.courseId]: {
              ...currentProgress,
              certificateIssued: true,
              completionDate: new Date().toISOString()
            }
          };
        }
      }
      
      return {
        ...state,
        examAttempts: {
          ...state.examAttempts,
          [action.payload.courseId]: [...courseAttempts, newAttempt]
        },
        courseProgress: updatedCourseProgress,
        recentActivity: [
          {
            id: `exam-${action.payload.courseId}-${Date.now()}`,
            type: newAttempt.passed ? 'certificate_earned' : 'lesson_completed',
            courseId: action.payload.courseId,
            timestamp: new Date().toISOString(),
            data: { 
              examScore: newAttempt.percentage,
              passed: newAttempt.passed 
            }
          },
          ...state.recentActivity.slice(0, 9)
        ]
      };

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

interface LearningContextType {
  state: LearningState;
  dispatch: React.Dispatch<LearningAction>;
  // Helper functions
  enrollInCourse: (course: Course) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  updateProgress: (courseId: string, progress: UserProgress) => void;
  setCurrentLesson: (courseId: string, lessonId: string, lesson: Lesson) => void;
  toggleBookmark: (lessonId: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  getCourseProgress: (courseId: string) => UserProgress | null;
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;
  getCompletionRate: (courseId: string) => number;
  // Exam functions
  addExamAttempt: (courseId: string, attempt: ExamAttempt) => void;
  getExamAttempts: (courseId: string) => ExamAttempt[];
  getLatestExamAttempt: (courseId: string) => ExamAttempt | null;
  canTakeExam: (courseId: string) => boolean;
  hasPassed: (courseId: string) => boolean;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};

interface LearningProviderProps {
  children: ReactNode;
}

export const LearningProvider: React.FC<LearningProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(learningReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const loadStoredState = () => {
      try {
        const storedState = localStorage.getItem('learning_state');
        if (storedState) {
          const parsed = JSON.parse(storedState);
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        }
      } catch (error) {
        console.error('Error loading stored state:', error);
      }
    };

    loadStoredState();
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const saveState = () => {
      try {
        const stateToSave = {
          user: state.user,
          enrolledCourses: state.enrolledCourses,
          courseProgress: state.courseProgress,
          bookmarks: state.bookmarks,
          recentActivity: state.recentActivity,
          settings: state.settings,
          examAttempts: state.examAttempts
        };
        localStorage.setItem('learning_state', JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Error saving state:', error);
      }
    };

    // Debounce saving
    const timeoutId = setTimeout(saveState, 1000);
    return () => clearTimeout(timeoutId);
  }, [state]);

  // Helper functions
  const enrollInCourse = (course: Course) => {
    dispatch({ type: 'ENROLL_COURSE', payload: course });
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: `enroll-${course.id}-${Date.now()}`,
        type: 'course_enrolled',
        courseId: course.id,
        timestamp: new Date().toISOString(),
        data: { courseName: course.title }
      }
    });
  };

  const completeLesson = (courseId: string, lessonId: string) => {
    dispatch({ type: 'COMPLETE_LESSON', payload: { courseId, lessonId } });
  };

  const updateProgress = (courseId: string, progress: UserProgress) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: { courseId, progress } });
  };

  const setCurrentLesson = (courseId: string, lessonId: string, lesson: Lesson) => {
    dispatch({ type: 'SET_CURRENT_LESSON', payload: { courseId, lessonId, lesson } });
  };

  const toggleBookmark = (lessonId: string) => {
    if (state.bookmarks.includes(lessonId)) {
      dispatch({ type: 'REMOVE_BOOKMARK', payload: lessonId });
    } else {
      dispatch({ type: 'ADD_BOOKMARK', payload: lessonId });
    }
  };

  const updateSettings = (settings: Partial<UserSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const getCourseProgress = (courseId: string): UserProgress | null => {
    return state.courseProgress[courseId] || null;
  };

  const isLessonCompleted = (courseId: string, lessonId: string): boolean => {
    const progress = getCourseProgress(courseId);
    return progress?.completedLessons.includes(lessonId) || false;
  };

  const getCompletionRate = (courseId: string): number => {
    const progress = getCourseProgress(courseId);
    return progress?.progressPercentage || 0;
  };

  // Exam functions
  const addExamAttempt = (courseId: string, attempt: ExamAttempt) => {
    dispatch({ type: 'ADD_EXAM_ATTEMPT', payload: { courseId, attempt } });
  };

  const getExamAttempts = (courseId: string): ExamAttempt[] => {
    return state.examAttempts[courseId] || [];
  };

  const getLatestExamAttempt = (courseId: string): ExamAttempt | null => {
    const attempts = getExamAttempts(courseId);
    return attempts.length > 0 ? attempts[attempts.length - 1] : null;
  };

  const canTakeExam = (courseId: string): boolean => {
    const progress = getCourseProgress(courseId);
    return progress?.progressPercentage === 100 || false;
  };

  const hasPassed = (courseId: string): boolean => {
    const latestAttempt = getLatestExamAttempt(courseId);
    return latestAttempt?.passed || false;
  };

  const contextValue: LearningContextType = {
    state,
    dispatch,
    enrollInCourse,
    completeLesson,
    updateProgress,
    setCurrentLesson,
    toggleBookmark,
    updateSettings,
    getCourseProgress,
    isLessonCompleted,
    getCompletionRate,
    addExamAttempt,
    getExamAttempts,
    getLatestExamAttempt,
    canTakeExam,
    hasPassed
  };

  return (
    <LearningContext.Provider value={contextValue}>
      {children}
    </LearningContext.Provider>
  );
};