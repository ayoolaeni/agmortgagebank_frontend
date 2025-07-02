import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoanApplication, SavingsAccount, AppContextType } from '../types';
import api from '../services/api';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Fetch users (admin only)
  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await api.get('/users');
      console.log('Fetched users:', response.data);
      setUsers(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      return [];
    }
  };

  // Fetch loans
  const fetchLoans = async () => {
    try {
      console.log('Fetching loans...');
      const response = await api.get('/loans');
      console.log('Raw loans response:', response.data);
      
      // Ensure we have an array
      const loansData = Array.isArray(response.data) ? response.data : [];
      console.log('Processed loans data:', loansData);
      
      setLoans(loansData);
      return loansData;
    } catch (error) {
      console.error('Error fetching loans:', error);
      // Set empty array on error to prevent crashes
      setLoans([]);
      return [];
    }
  };

  // Fetch savings accounts with enhanced logging and proper state management
  const fetchSavingsAccounts = async () => {
    try {
      console.log('=== FETCHING SAVINGS ACCOUNTS ===');
      const response = await api.get('/savings');
      console.log('Raw savings response:', response.data);
      
      // Ensure we have an array and validate data structure
      const savingsData = Array.isArray(response.data) ? response.data : [];
      
      // Enhanced logging for savings data
      console.log('Processed savings data:', savingsData);
      console.log('Savings accounts count:', savingsData.length);
      
      if (savingsData.length > 0) {
        console.log('Sample savings account:', savingsData[0]);
        
        // Calculate total savings with proper number conversion
        const totalSavings = savingsData.reduce((sum, account) => {
          const balance = parseFloat(account.balance?.toString() || '0') || 0;
          console.log(`Account ${account.id} (User: ${account.userId}): Balance = ₦${balance.toLocaleString()}`);
          return sum + balance;
        }, 0);
        
        console.log('Total calculated savings:', `₦${totalSavings.toLocaleString()}`);
        
        // Log individual user savings
        const userSavingsMap = new Map();
        savingsData.forEach(account => {
          const userId = account.userId;
          const balance = parseFloat(account.balance?.toString() || '0') || 0;
          const currentTotal = userSavingsMap.get(userId) || 0;
          userSavingsMap.set(userId, currentTotal + balance);
        });
        
        console.log('User savings breakdown:');
        userSavingsMap.forEach((total, userId) => {
          console.log(`  User ${userId}: ₦${total.toLocaleString()}`);
        });
      } else {
        console.log('No savings accounts found in database');
      }
      
      // CRITICAL: Set state immediately and return data
      setSavingsAccounts(savingsData);
      console.log('=== SAVINGS ACCOUNTS STATE UPDATED ===');
      return savingsData;
    } catch (error) {
      console.error('Error fetching savings accounts:', error);
      // Set empty array on error to prevent crashes
      setSavingsAccounts([]);
      return [];
    }
  };

  // Load initial data when user is authenticated - FIXED VERSION
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('AppContext useEffect - checking auth state:', { 
      hasToken: !!token, 
      hasUser: !!user,
      initialLoadComplete 
    });
    
    if (token && user && !initialLoadComplete) {
      console.log('=== STARTING INITIAL DATA LOAD ===');
      setLoading(true);
      
      const loadData = async () => {
        try {
          let userData = null;
          try {
            userData = JSON.parse(user);
            console.log('User data from localStorage:', userData);
          } catch (error) {
            console.error('Error parsing user data:', error);
            setLoading(false);
            return;
          }

          // Load data sequentially to avoid race conditions
          console.log('Step 1: Loading loans...');
          const loansData = await fetchLoans();
          
          console.log('Step 2: Loading savings accounts...');
          const savingsData = await fetchSavingsAccounts();
          
          // Fetch users if admin
          if (userData.role === 'admin') {
            console.log('Step 3: User is admin, fetching users...');
            const usersData = await fetchUsers();
            console.log('Admin data load complete:', {
              users: usersData.length,
              loans: loansData.length,
              savings: savingsData.length
            });
          } else {
            console.log('Step 3: Regular user, skipping users fetch');
            console.log('User data load complete:', {
              loans: loansData.length,
              savings: savingsData.length
            });
          }
          
          setInitialLoadComplete(true);
          console.log('=== INITIAL DATA LOAD COMPLETED ===');
        } catch (error) {
          console.error('Error during initial data load:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    } else if (!token || !user) {
      console.log('No authentication found, clearing data...');
      setUsers([]);
      setLoans([]);
      setSavingsAccounts([]);
      setInitialLoadComplete(false);
      setLoading(false);
    }
  }, [initialLoadComplete]);

  // Listen for authentication events
  useEffect(() => {
    const handleUserLoggedIn = (event: CustomEvent) => {
      console.log('User logged in event received:', event.detail);
      setInitialLoadComplete(false); // Reset to trigger data loading
    };

    const handleUserRegistered = (event: CustomEvent) => {
      console.log('User registered event received:', event.detail);
      setInitialLoadComplete(false); // Reset to trigger data loading
      
      // If current user is admin, refresh users list to show new user
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        try {
          const userData = JSON.parse(currentUser);
          if (userData.role === 'admin') {
            setTimeout(() => {
              fetchUsers();
            }, 1000); // Small delay to ensure backend has processed the registration
          }
        } catch (error) {
          console.error('Error parsing current user data:', error);
        }
      }
    };

    const handleUserLoggedOut = () => {
      console.log('User logged out event received');
      setUsers([]);
      setLoans([]);
      setSavingsAccounts([]);
      setInitialLoadComplete(false);
      setLoading(false);
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn as EventListener);
    window.addEventListener('userRegistered', handleUserRegistered as EventListener);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);

    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn as EventListener);
      window.removeEventListener('userRegistered', handleUserRegistered as EventListener);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, []);

  // Refresh data when authentication state changes - IMPROVED VERSION
  const refreshData = async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('=== MANUAL REFRESH TRIGGERED ===');
    console.log('Auth state:', { hasToken: !!token, hasUser: !!user });
    
    if (token && user) {
      setLoading(true);
      try {
        const userData = JSON.parse(user);
        
        // Load data sequentially to avoid race conditions
        console.log('Refresh Step 1: Loading loans...');
        const loansData = await fetchLoans();
        
        console.log('Refresh Step 2: Loading savings accounts...');
        const savingsData = await fetchSavingsAccounts();
        
        if (userData.role === 'admin') {
          console.log('Refresh Step 3: Loading users (admin)...');
          const usersData = await fetchUsers();
          console.log('Refresh complete (admin):', {
            users: usersData.length,
            loans: loansData.length,
            savings: savingsData.length
          });
        } else {
          console.log('Refresh complete (user):', {
            loans: loansData.length,
            savings: savingsData.length
          });
        }
        
        console.log('=== MANUAL REFRESH COMPLETED ===');
      } catch (error) {
        console.error('Error during data refresh:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addUser = (user: User) => {
    console.log('Adding user:', user);
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    console.log('Updating user:', userId, updates);
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      console.log('Deleting user:', userId);
      
      await api.delete(`/users/${userId}`);
      
      // Remove user from local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      // Refresh data to ensure consistency
      await refreshData();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      setLoading(true);
      console.log('Updating user status:', userId, isActive);
      
      await api.patch(`/users/${userId}/status`, { isActive });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addLoanApplication = async (loan: Omit<LoanApplication, 'id' | 'userId' | 'appliedAt' | 'status'>) => {
    try {
      setLoading(true);
      console.log('Submitting loan application:', loan);
      
      const response = await api.post('/loans', loan);
      console.log('Loan application response:', response.data);
      
      // Refresh loans data to get the latest from server
      await fetchLoans();
      
      return response.data.loan;
    } catch (error) {
      console.error('Error adding loan application:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateLoanApplication = async (loanId: string, updates: Partial<LoanApplication>) => {
    try {
      setLoading(true);
      console.log('Updating loan application:', loanId, updates);
      
      await api.put(`/loans/${loanId}`, updates);
      
      // Update local state immediately
      setLoans(prev => prev.map(loan => 
        loan.id === loanId ? { ...loan, ...updates } : loan
      ));
      
      // Refresh data to ensure consistency
      await fetchLoans();
    } catch (error) {
      console.error('Error updating loan application:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addSavingsAccount = async (accountData: { accountType: 'savings' | 'fixed'; initialDeposit: number }) => {
    try {
      setLoading(true);
      console.log('Creating savings account:', accountData);
      
      const response = await api.post('/savings', accountData);
      console.log('Savings account response:', response.data);
      
      // Refresh savings data to get the latest from server
      await fetchSavingsAccounts();
      
      return response.data.account;
    } catch (error) {
      console.error('Error adding savings account:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSavingsAccount = (accountId: string, updates: Partial<SavingsAccount>) => {
    console.log('Updating savings account:', accountId, updates);
    setSavingsAccounts(prev => prev.map(account => 
      account.id === accountId ? { ...account, ...updates } : account
    ));
  };

  const addTransaction = async (accountId: string, transactionData: { type: 'deposit' | 'withdrawal'; amount: number; description?: string }) => {
    try {
      setLoading(true);
      console.log('Adding transaction:', accountId, transactionData);
      
      const response = await api.post(`/savings/${accountId}/transactions`, transactionData);
      console.log('Transaction response:', response.data);
      
      // Refresh savings data to get updated balances and transactions
      await fetchSavingsAccounts();
      
      return response.data.transaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get user's total savings with enhanced calculation
  const getUserTotalSavings = (userId: string) => {
    const userAccounts = savingsAccounts.filter(account => 
      account.userId === userId || account.userId === userId.toString()
    );
    
    const total = userAccounts.reduce((sum, account) => {
      const balance = parseFloat(account.balance?.toString() || '0') || 0;
      return sum + balance;
    }, 0);
    
    console.log(`User ${userId} total savings: ₦${total.toLocaleString()} from ${userAccounts.length} accounts`);
    return total;
  };

  // Helper function to get total system savings with enhanced calculation
  const getTotalSystemSavings = () => {
    const total = savingsAccounts.reduce((sum, account) => {
      const balance = parseFloat(account.balance?.toString() || '0') || 0;
      return sum + balance;
    }, 0);
    
    console.log(`Total system savings: ₦${total.toLocaleString()} from ${savingsAccounts.length} accounts`);
    return total;
  };

  // Debug function to log current state
  const debugState = () => {
    console.log('=== AppContext Debug State ===');
    console.log('Users:', users.length, users);
    console.log('Loans:', loans.length, loans);
    console.log('Savings Accounts:', savingsAccounts.length, savingsAccounts);
    console.log('Loading:', loading);
    console.log('Initial Load Complete:', initialLoadComplete);
    
    const totalSystemSavings = getTotalSystemSavings();
    console.log('Total System Savings:', `₦${totalSystemSavings.toLocaleString()}`);
    
    // Debug individual user savings
    users.forEach(user => {
      if (user.role === 'user') {
        const userSavings = getUserTotalSavings(user.id);
        console.log(`User ${user.firstName} ${user.lastName} (${user.id}) savings: ₦${userSavings.toLocaleString()}`);
      }
    });
    
    // Debug savings accounts details
    console.log('Savings Accounts Details:');
    savingsAccounts.forEach(account => {
      const balance = parseFloat(account.balance?.toString() || '0') || 0;
      console.log(`  Account ${account.accountNumber} (User: ${account.userId}): ₦${balance.toLocaleString()}`);
    });
    
    console.log('==============================');
  };

  const value: AppContextType = {
    users,
    loans,
    savingsAccounts,
    addUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    addLoanApplication,
    updateLoanApplication,
    addSavingsAccount,
    updateSavingsAccount,
    addTransaction,
    refreshData,
    loading,
    debugState,
    // Add helper functions to context
    getUserTotalSavings,
    getTotalSystemSavings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};