export interface PaymentTransaction {
  id: string;
  userId: string;
  courseId: string;
  transactionId: string;
  amount: number;
  currency: 'SDG';
  status: 'pending' | 'verification_submitted' | 'verified' | 'rejected';
  receiptImage?: string;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface BankDetails {
  accountNumber: string;
  accountName: string;
  bankName: string;
  branch?: string;
}

export interface PaymentFormData {
  transactionId: string;
  receiptImage?: File;
  notes?: string;
}