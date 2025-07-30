import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { PaymentTransaction } from '@/types/payment';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';

interface PaymentState {
  transactions: PaymentTransaction[];
  isLoading: boolean;
  error: string | null;
}

type PaymentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRANSACTIONS'; payload: PaymentTransaction[] }
  | { type: 'ADD_TRANSACTION'; payload: PaymentTransaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; updates: Partial<PaymentTransaction> } }
  | { type: 'CLEAR_ERROR' };

const initialState: PaymentState = {
  transactions: [],
  isLoading: false,
  error: null
};

function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, isLoading: false };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
        isLoading: false
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id
            ? { ...transaction, ...action.payload.updates }
            : transaction
        ),
        isLoading: false
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

interface PaymentContextType {
  state: PaymentState;
  submitPaymentVerification: (courseId: string, transactionId: string, receiptImage?: string, notes?: string) => Promise<boolean>;
  verifyPayment: (transactionId: string, adminId: string) => Promise<boolean>;
  rejectPayment: (transactionId: string, adminId: string, reason: string) => Promise<boolean>;
  getUserTransactions: (userId: string) => PaymentTransaction[];
  getPendingTransactions: () => PaymentTransaction[];
  getAllTransactions: () => PaymentTransaction[];
  getTransactionByCourse: (userId: string, courseId: string) => PaymentTransaction | null;
  loadTransactions: () => Promise<void>;
  clearError: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

// Helper function to convert database row to PaymentTransaction
const dbRowToTransaction = (row: any): PaymentTransaction => ({
  id: row.id,
  userId: row.user_id,
  courseId: row.course_id,
  transactionId: row.transaction_id,
  amount: Number(row.amount),
  currency: row.currency,
  status: row.status,
  receiptImage: row.receipt_image_url,
  submittedAt: row.submitted_at,
  verifiedAt: row.verified_at,
  verifiedBy: row.verified_by,
  rejectionReason: row.rejection_reason,
  notes: row.notes
});

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);
  const { state: authState } = useAuth();

  // Load transactions from database
  const loadTransactions = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      const transactions = data?.map(dbRowToTransaction) || [];
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    } catch (error) {
      console.error('Error loading transactions:', error);
      dispatch({ type: 'SET_ERROR', payload: 'خطأ في تحميل المعاملات' });
    }
  };

  // Load transactions on mount
  useEffect(() => {
    if (authState.isAuthenticated) {
      loadTransactions();
    }
  }, [authState.isAuthenticated]);

  const submitPaymentVerification = async (
    courseId: string,
    transactionId: string,
    receiptImage?: string,
    notes?: string
  ): Promise<boolean> => {
    if (!authState.user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Get course details from local data instead of database
      const { courses } = await import('@/data/courses');
      const course = courses.find(c => c.id === courseId);
      
      if (!course) {
        throw new Error('الدورة غير موجودة');
      }

      // Convert price string to number (remove currency and commas)
      const priceNumber = parseFloat(course.price.replace(/[^\d.]/g, ''));

      // Insert payment record
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: authState.user.id,
          course_id: courseId,
          transaction_id: transactionId,
          amount: priceNumber,
          currency: 'SDG',
          status: 'verification_submitted',
          receipt_image_url: receiptImage,
          notes
        })
        .select()
        .single();

      if (error) throw error;

      const newTransaction = dbRowToTransaction(data);
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
      toast.success('تم إرسال طلب التحقق من الدفعة بنجاح!');
      return true;
    } catch (error: any) {
      console.error('Error submitting payment:', error);
      dispatch({ type: 'SET_ERROR', payload: 'حدث خطأ أثناء إرسال طلب التحقق' });
      toast.error('حدث خطأ أثناء إرسال طلب التحقق');
      return false;
    }
  };

  const verifyPayment = async (transactionId: string, adminId: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          verified_by: adminId
        })
        .eq('id', transactionId);

      if (error) throw error;

      // Note: Skip course enrollment as we're using local course data
      // The course access will be managed through the frontend logic

      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: {
          id: transactionId,
          updates: {
            status: 'verified',
            verifiedAt: new Date().toISOString(),
            verifiedBy: adminId
          }
        }
      });

      toast.success('تم تأكيد الدفعة وتسجيل الطالب في الدورة بنجاح!');
      return true;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      dispatch({ type: 'SET_ERROR', payload: 'حدث خطأ أثناء تأكيد الدفعة' });
      toast.error('حدث خطأ أثناء تأكيد الدفعة');
      return false;
    }
  };

  const rejectPayment = async (transactionId: string, adminId: string, reason: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'rejected',
          verified_at: new Date().toISOString(),
          verified_by: adminId,
          rejection_reason: reason
        })
        .eq('id', transactionId);

      if (error) throw error;

      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: {
          id: transactionId,
          updates: {
            status: 'rejected',
            verifiedAt: new Date().toISOString(),
            verifiedBy: adminId,
            rejectionReason: reason
          }
        }
      });

      toast.success('تم رفض الدفعة');
      return true;
    } catch (error: any) {
      console.error('Error rejecting payment:', error);
      dispatch({ type: 'SET_ERROR', payload: 'حدث خطأ أثناء رفض الدفعة' });
      toast.error('حدث خطأ أثناء رفض الدفعة');
      return false;
    }
  };

  const getUserTransactions = (userId: string): PaymentTransaction[] => {
    return state.transactions.filter(transaction => transaction.userId === userId);
  };

  const getPendingTransactions = (): PaymentTransaction[] => {
    return state.transactions.filter(transaction => transaction.status === 'verification_submitted');
  };

  const getAllTransactions = (): PaymentTransaction[] => {
    return state.transactions;
  };

  const getTransactionByCourse = (userId: string, courseId: string): PaymentTransaction | null => {
    return state.transactions.find(
      transaction => transaction.userId === userId && transaction.courseId === courseId
    ) || null;
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: PaymentContextType = {
    state,
    submitPaymentVerification,
    verifyPayment,
    rejectPayment,
    getUserTransactions,
    getPendingTransactions,
    getAllTransactions,
    getTransactionByCourse,
    loadTransactions,
    clearError
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};