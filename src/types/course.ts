import { LucideIcon } from "lucide-react";

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  level: string;
  price: string;
  rating: number;
  students: number;
  badge?: string;
  gradient: string;
  features: string[];
  instructor: {
    name: string;
    avatar: string;
    bio: string;
    experience: string;
  };
  lessons: Lesson[];
  category: string;
  language: string;
  totalHours: number;
  certificate: boolean;
  prerequisites: string[];
}

export interface VideoQuality {
  url: string;
  quality: string;
  resolution: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content: {
    videoUrl?: string;
    videoQualities?: VideoQuality[];
    textContent?: string;
    attachments?: string[];
  };
  isCompleted: boolean;
  order: number;
}

export interface UserProgress {
  courseId: string;
  completedLessons: string[];
  progressPercentage: number;
  lastAccessedLesson?: string;
  enrollmentDate: string;
  completionDate?: string;
  certificateIssued: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: string[];
  completedCourses: string[];
  certificates: string[];
  joinDate: string;
  bio?: string;
  phone?: string;
}