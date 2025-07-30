import { useState, useCallback, useEffect } from 'react';

interface VideoProgressData {
  courseId: string;
  lessonId: string;
  currentTime: number;
  duration: number;
  completed: boolean;
  watchedPercentage: number;
  lastWatched: string;
}

interface UseVideoProgressReturn {
  progress: VideoProgressData | null;
  updateProgress: (currentTime: number, duration: number) => void;
  markCompleted: () => void;
  saveProgress: () => void;
  loadProgress: () => VideoProgressData | null;
}

export const useVideoProgress = (
  courseId: string,
  lessonId: string
): UseVideoProgressReturn => {
  const [progress, setProgress] = useState<VideoProgressData | null>(null);

  // Storage key for progress
  const getStorageKey = () => `video_progress_${courseId}_${lessonId}`;

  // Load progress from localStorage
  const loadProgress = useCallback((): VideoProgressData | null => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        const data = JSON.parse(stored);
        return data;
      }
    } catch (error) {
      console.error('Error loading video progress:', error);
    }
    return null;
  }, [courseId, lessonId]);

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    if (!progress) return;
    
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving video progress:', error);
    }
  }, [progress, getStorageKey]);

  // Update progress
  const updateProgress = useCallback((currentTime: number, duration: number) => {
    if (duration === 0) return;

    const watchedPercentage = (currentTime / duration) * 100;
    const completed = watchedPercentage >= 90; // Consider completed at 90%

    setProgress(prev => ({
      courseId,
      lessonId,
      currentTime,
      duration,
      completed,
      watchedPercentage,
      lastWatched: new Date().toISOString(),
      ...prev
    }));
  }, [courseId, lessonId]);

  // Mark as completed
  const markCompleted = useCallback(() => {
    setProgress(prev => prev ? {
      ...prev,
      completed: true,
      watchedPercentage: 100,
      lastWatched: new Date().toISOString()
    } : null);
  }, []);

  // Load initial progress
  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      setProgress(savedProgress);
    }
  }, [loadProgress]);

  // Auto-save progress
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (progress) {
        saveProgress();
      }
    }, 5000); // Save every 5 seconds

    return () => clearInterval(saveInterval);
  }, [progress, saveProgress]);

  // Save on component unmount
  useEffect(() => {
    return () => {
      if (progress) {
        try {
          localStorage.setItem(getStorageKey(), JSON.stringify(progress));
        } catch (error) {
          console.error('Error saving progress on unmount:', error);
        }
      }
    };
  }, [progress, getStorageKey]);

  return {
    progress,
    updateProgress,
    markCompleted,
    saveProgress,
    loadProgress
  };
};