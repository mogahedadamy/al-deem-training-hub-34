import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'instructor' | 'student';
  assigned_at: string;
}

interface AppUser {
  id: string;
  email: string;
  profile?: Profile;
  roles: UserRole[];
  primaryRole: 'admin' | 'instructor' | 'student';
}

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AppUser; session: Session } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<Profile> }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          profile: state.user.profile ? { ...state.user.profile, ...action.payload } : undefined
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
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<boolean>;
  hasRole: (role: 'admin' | 'instructor' | 'student') => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const SupabaseAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user profile and roles
  const loadUserData = async (user: User): Promise<AppUser> => {
    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      const userRoles = roles || [];
      const primaryRole = userRoles.find(r => r.role === 'admin')?.role ||
                         userRoles.find(r => r.role === 'instructor')?.role ||
                         'student';

      return {
        id: user.id,
        email: user.email!,
        profile: profile || undefined,
        roles: userRoles,
        primaryRole
      };
    } catch (error) {
      console.error('Error loading user data:', error);
      throw error;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Use setTimeout to prevent deadlock
          setTimeout(() => {
            loadUserData(session.user).then((appUser) => {
              dispatch({ 
                type: 'AUTH_SUCCESS', 
                payload: { user: appUser, session } 
              });
            }).catch((error) => {
              dispatch({ 
                type: 'AUTH_FAILURE', 
                payload: 'فشل في تحميل بيانات المستخدم' 
              });
            });
          }, 0);
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user).then((appUser) => {
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { user: appUser, session } 
          });
        }).catch(() => {
          dispatch({ 
            type: 'AUTH_FAILURE', 
            payload: 'فشل في تحميل بيانات المستخدم' 
          });
        });
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        dispatch({ type: 'AUTH_FAILURE', payload: error.message });
        toast.error('فشل في إنشاء الحساب: ' + error.message);
        return false;
      }

      if (data.user && !data.session) {
        toast.success('تم إرسال رابط التأكيد إلى بريدك الإلكتروني');
        dispatch({ type: 'AUTH_LOGOUT' });
        return true;
      }

      toast.success('تم إنشاء الحساب بنجاح!');
      return true;
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      toast.error('حدث خطأ أثناء إنشاء الحساب');
      return false;
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        dispatch({ type: 'AUTH_FAILURE', payload: error.message });
        toast.error('فشل في تسجيل الدخول: ' + error.message);
        return false;
      }

      if (data.user) {
        const appUser = await loadUserData(data.user);
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user: appUser, session: data.session } 
        });
        toast.success(`مرحباً بك ${appUser.profile?.full_name || appUser.email}!`);
        return true;
      }

      return false;
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      toast.error('حدث خطأ أثناء تسجيل الدخول');
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      dispatch({ type: 'AUTH_LOGOUT' });
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  const updateProfile = async (profileData: Partial<Profile>): Promise<boolean> => {
    if (!state.user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', state.user.id);

      if (error) {
        toast.error('فشل في تحديث الملف الشخصي');
        return false;
      }

      dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
      toast.success('تم تحديث الملف الشخصي بنجاح');
      return true;
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الملف الشخصي');
      return false;
    }
  };

  const hasRole = (role: 'admin' | 'instructor' | 'student'): boolean => {
    if (!state.user) return false;
    return state.user.roles.some(r => r.role === role);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    state,
    signUp,
    signIn,
    signOut,
    updateProfile,
    hasRole,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};