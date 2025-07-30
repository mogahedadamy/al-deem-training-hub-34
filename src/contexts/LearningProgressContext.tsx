import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  watchedPercentage: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lastAccessed?: string;
}

interface LearningState {
  lessonProgress: { [lessonId: string]: LessonProgress };
  courseProgress: { [courseId: string]: CourseProgress };
  isLoading: boolean;
  error: string | null;
}

type LearningAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LESSON_PROGRESS'; payload: { [lessonId: string]: LessonProgress } }
  | { type: 'UPDATE_LESSON_PROGRESS'; payload: LessonProgress }
  | { type: 'SET_COURSE_PROGRESS'; payload: { [courseId: string]: CourseProgress } }
  | { type: 'UPDATE_COURSE_PROGRESS'; payload: CourseProgress };

const initialState: LearningState = {
  lessonProgress: {},
  courseProgress: {},
  isLoading: false,
  error: null
};

function learningReducer(state: LearningState, action: LearningAction): LearningState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_LESSON_PROGRESS':
      return { ...state, lessonProgress: action.payload, isLoading: false };
    case 'UPDATE_LESSON_PROGRESS':
      return {
        ...state,
        lessonProgress: {
          ...state.lessonProgress,
          [action.payload.lessonId]: action.payload
        }
      };
    case 'SET_COURSE_PROGRESS':
      return { ...state, courseProgress: action.payload, isLoading: false };
    case 'UPDATE_COURSE_PROGRESS':
      return {
        ...state,
        courseProgress: {
          ...state.courseProgress,
          [action.payload.courseId]: action.payload
        }
      };
    default:
      return state;
  }
}

interface LearningContextType {
  state: LearningState;
  updateVideoProgress: (lessonId: string, watchedPercentage: number) => Promise<boolean>;
  markLessonComplete: (lessonId: string) => Promise<boolean>;
  getLessonProgress: (lessonId: string) => LessonProgress | null;
  getCourseProgress: (courseId: string) => CourseProgress | null;
  loadUserProgress: () => Promise<void>;
  calculateCourseProgress: (courseId: string) => Promise<void>;
  clearError: () => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const useLearningProgress = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearningProgress must be used within a LearningProgressProvider');
  }
  return context;
};

interface LearningProgressProviderProps {
  children: ReactNode;
}

export const LearningProgressProvider: React.FC<LearningProgressProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(learningReducer, initialState);
  const { state: authState } = useAuth();

  // Load user progress on mount
  useEffect(() => {
    if (authState.isAuthenticated && authState.user?.id) {
      loadUserProgress();
    }
  }, [authState.isAuthenticated, authState.user?.id]);

  const loadUserProgress = async () => {
    if (!authState.user?.id) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Load lesson progress
      const { data: progressData, error: progressError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', authState.user.id);

      if (progressError) throw progressError;

      const progressMap: { [lessonId: string]: LessonProgress } = {};
      progressData?.forEach(progress => {
        progressMap[progress.lesson_id] = {
          id: progress.id,
          userId: progress.user_id,
          lessonId: progress.lesson_id,
          completed: progress.completed,
          watchedPercentage: progress.watched_percentage || 0,
          completedAt: progress.completed_at,
          createdAt: progress.created_at,
          updatedAt: progress.updated_at
        };
      });

      dispatch({ type: 'SET_LESSON_PROGRESS', payload: progressMap });

      // Load course enrollments to calculate course progress
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('user_id', authState.user.id);

      if (enrollmentError) throw enrollmentError;

      // Calculate progress for each enrolled course
      for (const enrollment of enrollments || []) {
        await calculateCourseProgress(enrollment.course_id);
      }

    } catch (error: any) {
      console.error('Error loading progress:', error);
      dispatch({ type: 'SET_ERROR', payload: 'خطأ في تحميل بيانات التقدم' });
    }
  };

  const updateVideoProgress = async (lessonId: string, watchedPercentage: number): Promise<boolean> => {
    if (!authState.user?.id) return false;

    try {
      const existingProgress = state.lessonProgress[lessonId];
      
      // Only update if new percentage is higher
      if (existingProgress && existingProgress.watchedPercentage >= watchedPercentage) {
        return true;
      }

      const isCompleted = watchedPercentage >= 90; // Consider 90% as completed

      const progressData = {
        user_id: authState.user.id,
        lesson_id: lessonId,
        watched_percentage: Math.round(watchedPercentage),
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert(progressData, { onConflict: 'user_id,lesson_id' })
        .select()
        .single();

      if (error) throw error;

      const updatedProgress: LessonProgress = {
        id: data.id,
        userId: data.user_id,
        lessonId: data.lesson_id,
        completed: data.completed,
        watchedPercentage: data.watched_percentage,
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      dispatch({ type: 'UPDATE_LESSON_PROGRESS', payload: updatedProgress });

      // Update course progress
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('course_id')
        .eq('id', lessonId)
        .single();

      if (lessonData) {
        await calculateCourseProgress(lessonData.course_id);
      }

      return true;
    } catch (error: any) {
      console.error('Error updating progress:', error);
      dispatch({ type: 'SET_ERROR', payload: 'خطأ في حفظ التقدم' });
      return false;
    }
  };

  const markLessonComplete = async (lessonId: string): Promise<boolean> => {
    return await updateVideoProgress(lessonId, 100);
  };

  const calculateCourseProgress = async (courseId: string) => {
    if (!authState.user?.id) return;

    try {
      // Get all lessons for this course
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId)
        .order('order_index');

      if (lessonsError) throw lessonsError;

      const totalLessons = lessons?.length || 0;
      let completedLessons = 0;

      // Count completed lessons
      lessons?.forEach(lesson => {
        const progress = state.lessonProgress[lesson.id];
        if (progress?.completed) {
          completedLessons++;
        }
      });

      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      const courseProgress: CourseProgress = {
        courseId,
        totalLessons,
        completedLessons,
        progressPercentage,
        lastAccessed: new Date().toISOString()
      };

      dispatch({ type: 'UPDATE_COURSE_PROGRESS', payload: courseProgress });

      // Update enrollment progress
      await supabase
        .from('course_enrollments')
        .update({
          progress_percentage: progressPercentage,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null
        })
        .eq('user_id', authState.user.id)
        .eq('course_id', courseId);

    } catch (error: any) {
      console.error('Error calculating course progress:', error);
    }
  };

  const getLessonProgress = (lessonId: string): LessonProgress | null => {
    return state.lessonProgress[lessonId] || null;
  };

  const getCourseProgress = (courseId: string): CourseProgress | null => {
    return state.courseProgress[courseId] || null;
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const contextValue: LearningContextType = {
    state,
    updateVideoProgress,
    markLessonComplete,
    getLessonProgress,
    getCourseProgress,
    loadUserProgress,
    calculateCourseProgress,
    clearError
  };

  return (
    <LearningContext.Provider value={contextValue}>
      {children}
    </LearningContext.Provider>
  );
};