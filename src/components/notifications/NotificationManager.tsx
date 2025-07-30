import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLearning } from '@/contexts/LearningContext';

export const NotificationManager = () => {
  const { createSystemNotification } = useNotifications();
  const { state } = useLearning();

  // Monitor for lesson completions and create notifications
  useEffect(() => {
    if (state.recentActivity.length > 0 && state.user) {
      const latestActivity = state.recentActivity[0];
      
      switch (latestActivity.type) {
        case 'lesson_completed':
          const course = state.enrolledCourses.find(c => c.id === latestActivity.courseId);
          const lesson = course?.lessons.find(l => l.id === latestActivity.lessonId);
          
          if (course && lesson) {
            createSystemNotification(
              state.user.id,
              'course_reminder',
              'تم إكمال الدرس بنجاح! 🎉',
              `لقد أكملت درس "${lesson.title}" من دورة "${course.title}". تابع التعلم!`,
              {
                priority: 'medium',
                actionText: 'متابعة التعلم',
                actionUrl: `/course/${course.id}`,
                data: { courseId: course.id, lessonId: lesson.id }
              }
            );
          }
          break;

        case 'course_enrolled':
          const enrolledCourse = state.enrolledCourses.find(c => c.id === latestActivity.courseId);
          if (enrolledCourse) {
            createSystemNotification(
              state.user.id,
              'lesson_added',
              'مرحباً بك في الدورة الجديدة! 📚',
              `تم تسجيلك بنجاح في دورة "${enrolledCourse.title}". ابدأ رحلة التعلم الآن!`,
              {
                priority: 'high',
                actionText: 'بدء التعلم',
                actionUrl: `/course/${enrolledCourse.id}`,
                data: { courseId: enrolledCourse.id }
              }
            );
          }
          break;

        case 'certificate_earned':
          const completedCourse = state.enrolledCourses.find(c => c.id === latestActivity.courseId);
          if (completedCourse && latestActivity.data?.passed) {
            createSystemNotification(
              state.user.id,
              'certificate_issued',
              'مبروك! حصلت على الشهادة! 🏆',
              `تهانينا! لقد اجتزت الاختبار النهائي لدورة "${completedCourse.title}" وحصلت على الشهادة.`,
              {
                priority: 'urgent',
                actionText: 'تحميل الشهادة',
                actionUrl: `/course/${completedCourse.id}/certificate`,
                data: { courseId: completedCourse.id, score: latestActivity.data.examScore }
              }
            );
          }
          break;
      }
    }
  }, [state.recentActivity, state.user, state.enrolledCourses, createSystemNotification]);

  // Monitor course progress for reminders
  useEffect(() => {
    if (state.user && state.settings.notifications.courseUpdates) {
      Object.entries(state.courseProgress).forEach(([courseId, progress]) => {
        const course = state.enrolledCourses.find(c => c.id === courseId);
        
        // Remind about incomplete courses after some time
        if (course && progress.progressPercentage < 100 && progress.progressPercentage > 0) {
          const lastAccess = progress.lastAccessedLesson ? new Date(progress.lastAccessedLesson) : new Date(progress.enrollmentDate);
          const daysSinceLastAccess = (Date.now() - lastAccess.getTime()) / (1000 * 60 * 60 * 24);
          
          // Send reminder if more than 3 days since last access (in real app, this would be more sophisticated)
          if (daysSinceLastAccess > 3) {
            createSystemNotification(
              state.user.id,
              'course_reminder',
              'لا تنس إكمال دورتك! 📝',
              `لديك تقدم ${progress.progressPercentage.toFixed(0)}% في دورة "${course.title}". استكمل تعلمك!`,
              {
                priority: 'medium',
                actionText: 'متابعة التعلم',
                actionUrl: `/course/${courseId}`,
                data: { courseId, progress: progress.progressPercentage }
              }
            );
          }
        }
      });
    }
  }, [state.courseProgress, state.user, state.enrolledCourses, state.settings.notifications.courseUpdates, createSystemNotification]);

  // This component doesn't render anything
  return null;
};