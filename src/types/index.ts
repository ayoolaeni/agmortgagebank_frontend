export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  occupation: string;
  employer: string;
  monthlyIncome: number;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  nextOfKin: {
    name: string;
    relationship: string;
    phoneNumber: string;
    address: string;
  };
  bankVerificationNumber: string;
  role: 'user' | 'admin';
  createdAt: string;
  isActive: boolean;
}

export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  loanType: 'personal' | 'mortgage' | 'business' | 'auto';
  purpose: string;
  duration: number; // in months
  monthlyIncome: number;
  collateral?: string;
  guarantor: {
    name: string;
    phoneNumber: string;
    relationship: string;
    address: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  interestRate?: number;
  monthlyPayment?: number;
}

export interface SavingsAccount {
  id: string;
  userId: string;
  accountNumber: string;
  balance: number;
  accountType: 'savings' | 'fixed';
  interestRate: number;
  createdAt: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  balance: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'isActive' | 'role'> & { password: string; confirmPassword: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface AppContextType {
  users: User[];
  loans: LoanApplication[];
  savingsAccounts: SavingsAccount[];
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => Promise<void>;
  updateUserStatus: (userId: string, isActive: boolean) => Promise<void>;
  addLoanApplication: (loan: Omit<LoanApplication, 'id' | 'userId' | 'appliedAt' | 'status'>) => Promise<any>;
  updateLoanApplication: (loanId: string, updates: Partial<LoanApplication>) => Promise<void>;
  addSavingsAccount: (accountData: { accountType: 'savings' | 'fixed'; initialDeposit: number }) => Promise<any>;
  updateSavingsAccount: (accountId: string, updates: Partial<SavingsAccount>) => void;
  addTransaction: (accountId: string, transactionData: { type: 'deposit' | 'withdrawal'; amount: number; description?: string }) => Promise<any>;
  refreshData?: () => void;
  loading?: boolean;
  debugState?: () => void;
  getUserTotalSavings?: (userId: string) => number;
  getTotalSystemSavings?: () => number;
}