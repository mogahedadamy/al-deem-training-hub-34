import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { PaymentTransaction } from '@/types/payment';
import { toast } from 'sonner';

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
  getTransactionByCourse: (userId: string, courseId: string) => PaymentTransaction | null;
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

// Mock transactions for development
const mockTransactions: PaymentTransaction[] = [
  {
    id: '1',
    userId: '1',
    courseId: 'self-development-leadership',
    transactionId: '1234',
    amount: 150,
    currency: 'SDG',
    status: 'verification_submitted',
    submittedAt: '2024-01-20T10:30:00Z',
    notes: 'تم التحويل عبر الهاتف المصرفي'
  }
];

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const loadTransactions = () => {
      try {
        const savedTransactions = localStorage.getItem('payment_transactions');
        const transactions = savedTransactions ? JSON.parse(savedTransactions) : mockTransactions;
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      } catch (error) {
        console.error('Error loading transactions:', error);
        dispatch({ type: 'SET_TRANSACTIONS', payload: mockTransactions });
      }
    };

    loadTransactions();
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (state.transactions.length > 0) {
      localStorage.setItem('payment_transactions', JSON.stringify(state.transactions));
    }
  }, [state.transactions]);

  const submitPaymentVerification = async (
    courseId: string,
    transactionId: string,
    receiptImage?: string,
    notes?: string
  ): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new transaction
      const newTransaction: PaymentTransaction = {
        id: Date.now().toString(),
        userId: '1', // This would come from auth context
        courseId,
        transactionId,
        amount: 150, // This would come from course data
        currency: 'SDG',
        status: 'verification_submitted',
        receiptImage,
        submittedAt: new Date().toISOString(),
        notes
      };

      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
      toast.success('تم إرسال طلب التحقق من الدفعة بنجاح!');
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'حدث خطأ أثناء إرسال طلب التحقق' });
      toast.error('حدث خطأ أثناء إرسال طلب التحقق');
      return false;
    }
  };

  const verifyPayment = async (transactionId: string, adminId: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

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

      toast.success('تم تأكيد الدفعة بنجاح!');
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'حدث خطأ أثناء تأكيد الدفعة' });
      return false;
    }
  };

  const rejectPayment = async (transactionId: string, adminId: string, reason: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

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
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'حدث خطأ أثناء رفض الدفعة' });
      return false;
    }
  };

  const getUserTransactions = (userId: string): PaymentTransaction[] => {
    return state.transactions.filter(transaction => transaction.userId === userId);
  };

  const getPendingTransactions = (): PaymentTransaction[] => {
    return state.transactions.filter(transaction => transaction.status === 'verification_submitted');
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
    getTransactionByCourse,
    clearError
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};