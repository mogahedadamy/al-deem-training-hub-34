import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: string[];
  completedCourses: string[];
  certificates: string[];
  paidCourses: string[];
  joinDate: string;
  bio?: string;
  phone?: string;
  role: 'student' | 'instructor' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ENROLL_COURSE'; payload: string }
  | { type: 'COMPLETE_COURSE'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };

    case 'ENROLL_COURSE':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          enrolledCourses: [...state.user.enrolledCourses, action.payload]
        } : null
      };

    case 'COMPLETE_COURSE':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          completedCourses: [...state.user.completedCourses, action.payload]
        } : null
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  enrollInCourse: (courseId: string) => void;
  completeCourse: (courseId: string) => void;
  isEnrolledInCourse: (courseId: string) => boolean;
  hasCertificate: (courseId: string) => boolean;
  hasPaidForCourse: (courseId: string) => boolean;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users data for development
const mockUsers: User[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    avatar: '/lovable-uploads/fb530070-f412-456e-a755-790d74e1bd9e.png',
    enrolledCourses: ['self-development-leadership', 'time-management'],
    completedCourses: [],
    certificates: [],
    paidCourses: ['self-development-leadership'],
    joinDate: '2024-01-15',
    bio: 'طالب متحمس للتطوير الذاتي',
    phone: '+966501234567',
    role: 'student'
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'LOGIN_FAILURE', payload: '' });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        dispatch({ type: 'LOGIN_FAILURE', payload: 'خطأ في تحميل بيانات المستخدم' });
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('auth_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [state.user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication
      const user = mockUsers.find(u => u.email === email);
      
      if (user && password === '123456') { // Mock password check
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        toast.success(`مرحباً بك ${user.name}!`);
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        toast.error('فشل في تسجيل الدخول');
        return false;
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'حدث خطأ أثناء تسجيل الدخول' });
      toast.error('حدث خطأ أثناء تسجيل الدخول');
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'المستخدم موجود بالفعل' });
        toast.error('المستخدم موجود بالفعل');
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        enrolledCourses: [],
        completedCourses: [],
        certificates: [],
        paidCourses: [],
        joinDate: new Date().toISOString(),
        role: 'student'
      };

      mockUsers.push(newUser);
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      toast.success(`مرحباً بك ${newUser.name}! تم إنشاء حسابك بنجاح`);
      return true;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'حدث خطأ أثناء إنشاء الحساب' });
      toast.error('حدث خطأ أثناء إنشاء الحساب');
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    toast.success('تم تحديث البيانات بنجاح');
  };

  const enrollInCourse = (courseId: string) => {
    if (!state.user?.enrolledCourses.includes(courseId)) {
      dispatch({ type: 'ENROLL_COURSE', payload: courseId });
      toast.success('تم التسجيل في الدورة بنجاح!');
    }
  };

  const completeCourse = (courseId: string) => {
    if (!state.user?.completedCourses.includes(courseId)) {
      dispatch({ type: 'COMPLETE_COURSE', payload: courseId });
      toast.success('تهانينا! تم إكمال الدورة بنجاح');
    }
  };

  const isEnrolledInCourse = (courseId: string): boolean => {
    return state.user?.enrolledCourses.includes(courseId) || false;
  };

  const hasCertificate = (courseId: string): boolean => {
    return state.user?.certificates.includes(courseId) || false;
  };

  const hasPaidForCourse = (courseId: string): boolean => {
    return state.user?.paidCourses.includes(courseId) || false;
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    updateUser,
    enrollInCourse,
    completeCourse,
    isEnrolledInCourse,
    hasCertificate,
    hasPaidForCourse,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};