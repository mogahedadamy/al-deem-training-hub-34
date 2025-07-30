export type NotificationType = 
  | 'lesson_added' 
  | 'course_reminder' 
  | 'exam_result' 
  | 'certificate_issued'
  | 'course_completion'
  | 'discussion_reply'
  | 'system_update'
  | 'payment_confirmed';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  data?: Record<string, any>;
  userId: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

export interface NotificationSettings {
  lessonUpdates: boolean;
  courseReminders: boolean;
  examResults: boolean;
  discussionReplies: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'never';
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  todayCount: number;
  weekCount: number;
}