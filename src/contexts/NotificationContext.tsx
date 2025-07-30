import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Notification, NotificationSettings, NotificationStats, NotificationType, NotificationPriority } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';

interface NotificationState {
  notifications: Notification[];
  settings: NotificationSettings;
  stats: NotificationStats;
  isLoading: boolean;
  error: string | null;
}

type NotificationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ'; payload: string } // userId
  | { type: 'ARCHIVE_NOTIFICATION'; payload: string }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<NotificationSettings> }
  | { type: 'LOAD_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'UPDATE_STATS'; payload: NotificationStats };

const initialSettings: NotificationSettings = {
  lessonUpdates: true,
  courseReminders: true,
  examResults: true,
  discussionReplies: true,
  systemUpdates: true,
  emailNotifications: false,
  pushNotifications: true,
  reminderFrequency: 'weekly',
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  }
};

const initialState: NotificationState = {
  notifications: [],
  settings: initialSettings,
  stats: {
    total: 0,
    unread: 0,
    todayCount: 0,
    weekCount: 0
  },
  isLoading: false,
  error: null
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        stats: calculateStats(newNotifications, action.payload.userId)
      };

    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(n => 
        n.id === action.payload 
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n
      );
      return {
        ...state,
        notifications: updatedNotifications,
        stats: calculateStats(updatedNotifications, updatedNotifications[0]?.userId || '')
      };

    case 'MARK_ALL_AS_READ':
      const allReadNotifications = state.notifications.map(n => 
        n.userId === action.payload && !n.isRead
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n
      );
      return {
        ...state,
        notifications: allReadNotifications,
        stats: calculateStats(allReadNotifications, action.payload)
      };

    case 'ARCHIVE_NOTIFICATION':
      const archivedNotifications = state.notifications.map(n => 
        n.id === action.payload ? { ...n, isArchived: true } : n
      );
      return {
        ...state,
        notifications: archivedNotifications,
        stats: calculateStats(archivedNotifications, archivedNotifications[0]?.userId || '')
      };

    case 'DELETE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload);
      return {
        ...state,
        notifications: filteredNotifications,
        stats: calculateStats(filteredNotifications, filteredNotifications[0]?.userId || '')
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'LOAD_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        stats: calculateStats(action.payload, action.payload[0]?.userId || '')
      };

    case 'UPDATE_STATS':
      return {
        ...state,
        stats: action.payload
      };

    default:
      return state;
  }
}

function calculateStats(notifications: Notification[], userId: string): NotificationStats {
  const userNotifications = notifications.filter(n => n.userId === userId && !n.isArchived);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    total: userNotifications.length,
    unread: userNotifications.filter(n => !n.isRead).length,
    todayCount: userNotifications.filter(n => new Date(n.createdAt) >= today).length,
    weekCount: userNotifications.filter(n => new Date(n.createdAt) >= weekAgo).length
  };
}

interface NotificationContextType {
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
  // Helper functions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  archiveNotification: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  getUserNotifications: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  createSystemNotification: (
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      priority?: NotificationPriority;
      actionText?: string;
      actionUrl?: string;
      data?: Record<string, any>;
    }
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { toast } = useToast();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const loadStoredNotifications = () => {
      try {
        const stored = localStorage.getItem('notifications_data');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.notifications) {
            dispatch({ type: 'LOAD_NOTIFICATIONS', payload: parsed.notifications });
          }
          if (parsed.settings) {
            dispatch({ type: 'UPDATE_SETTINGS', payload: parsed.settings });
          }
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadStoredNotifications();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const saveData = () => {
      try {
        const dataToSave = {
          notifications: state.notifications,
          settings: state.settings
        };
        localStorage.setItem('notifications_data', JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving notifications:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [state.notifications, state.settings]);

  // Helper functions
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Show toast if settings allow
    if (state.settings.pushNotifications && !notification.isRead) {
      toast({
        title: notification.title,
        description: notification.message,
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: notificationId });
  };

  const markAllAsRead = (userId: string) => {
    dispatch({ type: 'MARK_ALL_AS_READ', payload: userId });
  };

  const archiveNotification = (notificationId: string) => {
    dispatch({ type: 'ARCHIVE_NOTIFICATION', payload: notificationId });
  };

  const deleteNotification = (notificationId: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
  };

  const updateSettings = (settings: Partial<NotificationSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const getUserNotifications = (userId: string): Notification[] => {
    return state.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getUnreadCount = (userId: string): number => {
    return state.notifications.filter(n => n.userId === userId && !n.isRead && !n.isArchived).length;
  };

  const createSystemNotification = (
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options: {
      priority?: NotificationPriority;
      actionText?: string;
      actionUrl?: string;
      data?: Record<string, any>;
    } = {}
  ) => {
    addNotification({
      type,
      priority: options.priority || 'medium',
      title,
      message,
      actionText: options.actionText,
      actionUrl: options.actionUrl,
      data: options.data,
      userId,
      isRead: false,
      isArchived: false
    });
  };

  const contextValue: NotificationContextType = {
    state,
    dispatch,
    addNotification,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    updateSettings,
    getUserNotifications,
    getUnreadCount,
    createSystemNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};