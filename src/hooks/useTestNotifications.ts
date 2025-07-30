import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useTestNotifications = () => {
  const { createSystemNotification } = useNotifications();
  const { state } = useAuth();

  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      // Create some test notifications on first load
      const hasCreatedTestNotifications = localStorage.getItem('test_notifications_created');
      
      if (!hasCreatedTestNotifications) {
        // Welcome notification
        setTimeout(() => {
          createSystemNotification(
            state.user!.id,
            'system_update',
            'مرحباً بك في منصة التعلم! 👋',
            'نسعد بانضمامك إلينا. اكتشف الدورات المتاحة وابدأ رحلة التعلم.',
            {
              priority: 'medium',
              actionText: 'استكشف الدورات',
              actionUrl: '/#courses',
            }
          );
        }, 1000);

        // Course reminder
        setTimeout(() => {
          createSystemNotification(
            state.user!.id,
            'course_reminder',
            'لا تنس إكمال دورتك! 📚',
            'لديك دروس لم تكملها بعد. اقضِ 15 دقيقة اليوم في التعلم.',
            {
              priority: 'medium',
              actionText: 'متابعة التعلم',
              actionUrl: '/dashboard',
            }
          );
        }, 3000);

        // New lesson notification
        setTimeout(() => {
          createSystemNotification(
            state.user!.id,
            'lesson_added',
            'درس جديد متاح! ✨',
            'تم إضافة درس جديد في دورة البرمجة. تعلم مفاهيم متقدمة جديدة.',
            {
              priority: 'high',
              actionText: 'مشاهدة الدرس',
              actionUrl: '/dashboard',
            }
          );
        }, 5000);

        localStorage.setItem('test_notifications_created', 'true');
      }
    }
  }, [state.isAuthenticated, state.user, createSystemNotification]);
};