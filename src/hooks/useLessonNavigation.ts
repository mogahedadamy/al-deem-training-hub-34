import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '@/types/course';

export const useLessonNavigation = (
  course: Course | null,
  courseId: string,
  currentLessonIndex: number
) => {
  const navigate = useNavigate();

  const handlePreviousLesson = useCallback(() => {
    if (course && currentLessonIndex > 0) {
      const previousLesson = course.lessons[currentLessonIndex - 1];
      navigate(`/course/${courseId}/lesson/${previousLesson.id}`);
    }
  }, [course, currentLessonIndex, courseId, navigate]);

  const handleNextLesson = useCallback(() => {
    if (course && currentLessonIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentLessonIndex + 1];
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
    }
  }, [course, currentLessonIndex, courseId, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger on body or video elements to avoid conflicts with inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleNextLesson(); // In RTL, left arrow goes to next
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlePreviousLesson(); // In RTL, right arrow goes to previous
          break;
        case 'Escape':
          navigate(`/course/${courseId}`);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNextLesson, handlePreviousLesson, navigate, courseId]);

  return {
    handlePreviousLesson,
    handleNextLesson
  };
};