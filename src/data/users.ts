import { User } from '@/types/course';

// Mock users data for testing
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'أحمد محمد العلي',
    email: 'ahmed@example.com',
    avatar: '/placeholder.svg',
    enrolledCourses: ['safety-occupational-health', 'self-development-leadership', 'quality-control'],
    completedCourses: ['safety-occupational-health'],
    certificates: ['safety-occupational-health'],
    joinDate: '2024-01-15',
    bio: 'مهتم بالتطوير والتعلم المستمر في مجال الإدارة والقيادة',
    phone: '+966501234567'
  },
  {
    id: '2',
    name: 'فاطمة خالد السالم',
    email: 'fatima@example.com',
    avatar: '/placeholder.svg',
    enrolledCourses: ['self-development-leadership', 'electronic-accounting', 'project-management'],
    completedCourses: ['self-development-leadership', 'electronic-accounting'],
    certificates: ['self-development-leadership', 'electronic-accounting'],
    joinDate: '2024-02-20',
    bio: 'خبيرة في مجال الموارد البشرية والتطوير المهني',
    phone: '+966502345678'
  },
  {
    id: '3',
    name: 'محمد عبدالله النصر',
    email: 'mohammed@example.com',
    avatar: '/placeholder.svg',
    enrolledCourses: ['safety-occupational-health', 'quality-control', 'human-resources'],
    completedCourses: ['quality-control'],
    certificates: ['quality-control'],
    joinDate: '2024-03-10',
    bio: 'مختص في التسويق الرقمي والإعلام الجديد',
    phone: '+966503456789'
  }
];

// Function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Function to get user by email
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

// Function to create a new user
export const createUser = (userData: Omit<User, 'id' | 'joinDate'>): User => {
  const newUser: User = {
    ...userData,
    id: (mockUsers.length + 1).toString(),
    joinDate: new Date().toISOString(),
    enrolledCourses: [],
    completedCourses: [],
    certificates: []
  };
  
  mockUsers.push(newUser);
  return newUser;
};

// Function to update user
export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return null;
  
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
  return mockUsers[userIndex];
};

// Demo user for quick testing
export const demoUser: User = {
  id: 'demo',
  name: 'مستخدم تجريبي',
  email: 'demo@example.com',
  avatar: '/placeholder.svg',
  enrolledCourses: ['safety-occupational-health', 'self-development-leadership', 'quality-control'],
  completedCourses: ['safety-occupational-health'],
  certificates: ['safety-occupational-health'],
  joinDate: '2024-01-01',
  bio: 'حساب تجريبي للاختبار',
  phone: '+966500000000'
};

// Sample user for compatibility
export const sampleUser = demoUser;

// Activity interface
interface Activity {
  id: string;
  type: 'lesson' | 'course' | 'certificate';
  title: string;
  description: string;
  date: string;
}

// Dashboard stats interface
interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  activeCourses: number;
  certificates: number;
  totalHours: number;
  progressPercentage: number;
  recentActivities: Activity[];
}

// Function to get dashboard stats for a user
export const getDashboardStats = (user: User): DashboardStats => {
  const enrolledCourses = user.enrolledCourses.length;
  const completedCourses = user.completedCourses.length;
  const activeCourses = enrolledCourses - completedCourses;
  const certificates = user.certificates.length;
  
  // Calculate total hours (mock calculation)
  const totalHours = enrolledCourses * 20; // Average 20 hours per course
  
  // Calculate progress percentage
  const progressPercentage = enrolledCourses > 0 ? (completedCourses / enrolledCourses) * 100 : 0;
  
  // Mock recent activities
  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'lesson',
      title: 'أكملت درس السلامة المهنية',
      description: 'مقدمة في السلامة المهنية',
      date: 'منذ ساعة'
    },
    {
      id: '2',
      type: 'course',
      title: 'سجلت في دورة القيادة',
      description: 'تطوير الذات والقيادة',
      date: 'أمس'
    },
    {
      id: '3',
      type: 'certificate',
      title: 'حصلت على شهادة',
      description: 'شهادة السلامة المهنية',
      date: 'منذ أسبوع'
    }
  ];
  
  return {
    totalCourses: enrolledCourses,
    completedCourses,
    activeCourses,
    certificates,
    totalHours,
    progressPercentage: Math.round(progressPercentage),
    recentActivities
  };
};