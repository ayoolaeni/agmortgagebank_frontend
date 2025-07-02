import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Users, CreditCard, CheckCircle, XCircle, Clock, UserCheck, Trash2, UserX, PiggyBank, RefreshCw } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    users, 
    loans, 
    savingsAccounts, 
    updateLoanApplication, 
    deleteUser, 
    updateUserStatus,
    getUserTotalSavings,
    getTotalSystemSavings,
    refreshData,
    loading
  } = useApp();
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const totalUsers = users.filter(u => u.role === 'user').length;
  const totalLoans = loans.length;
  const pendingLoans = loans.filter(loan => loan.status === 'pending').length;
  const approvedLoans = loans.filter(loan => loan.status === 'approved' || loan.status === 'disbursed').length;
  
  // Calculate total savings
  const calculateTotalSavings = () => {
    if (!savingsAccounts || savingsAccounts.length === 0) {
      return 0;
    }

    let total = 0;
    savingsAccounts.forEach((account) => {
      const balance = parseFloat(account.balance?.toString() || '0') || 0;
      total += balance;
    });

    return total;
  };

  const totalSavings = getTotalSystemSavings ? getTotalSystemSavings() : calculateTotalSavings();
  
  // Function to get user's total savings
  const getUserSavings = (userId: string) => {
    if (getUserTotalSavings) {
      return getUserTotalSavings(userId);
    }
    
    // Fallback calculation
    const userAccounts = savingsAccounts.filter(account => 
      account.userId === userId || account.userId === userId.toString()
    );
    
    const total = userAccounts.reduce((sum, account) => {
      const balance = parseFloat(account.balance?.toString() || '0') || 0;
      return sum + balance;
    }, 0);
    
    return total;
  };

  // Function to get user's savings accounts count
  const getUserSavingsAccountsCount = (userId: string) => {
    return savingsAccounts.filter(account => 
      account.userId === userId || account.userId === userId.toString()
    ).length;
  };

  // Auto-refresh data when component mounts
  useEffect(() => {
    // Only refresh if we don't have savings data and we're not currently loading
    if (savingsAccounts.length === 0 && !loading && refreshData) {
      refreshData();
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const handleLoanAction = (loanId: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      updateLoanApplication(loanId, {
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        reviewedBy: user?.id
      });
    } else if (action === 'reject' && rejectionReason) {
      updateLoanApplication(loanId, {
        status: 'rejected',
        reviewedAt: new Date().toISOString(),
        reviewedBy: user?.id,
        rejectionReason
      });
      setRejectionReason('');
    }
    setSelectedLoan(null);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatus(userId, !currentStatus);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleRefresh = () => {
    if (refreshData) {
      refreshData();
    }
  };

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId || u.id === userId.toString());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100">Welcome back, {user?.firstName}! Manage loans and users efficiently.</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Loans</p>
              <p className="text-2xl font-bold text-gray-900">{totalLoans}</p>
            </div>
            <CreditCard className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Loans</p>
              <p className="text-2xl font-bold text-gray-900">{pendingLoans}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Loans</p>
              <p className="text-2xl font-bold text-gray-900">{approvedLoans}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(totalSavings)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {savingsAccounts.length} account{savingsAccounts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <PiggyBank className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Loan Applications */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Loan Applications</h3>
            {loans.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No loan applications yet</p>
            ) : (
              <div className="space-y-3">
                {loans.slice(0, 5).map((loan) => {
                  const applicant = getUserById(loan.userId);
                  return (
                    <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(loan.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            {applicant ? `${applicant.firstName} ${applicant.lastName}` : `User ID: ${loan.userId}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(loan.amount)} • {loan.loanType}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
            {users.filter(u => u.role === 'user').length === 0 ? (
              <p className="text-gray-500 text-center py-4">No users registered yet</p>
            ) : (
              <div className="space-y-3">
                {users.filter(u => u.role === 'user').slice(0, 5).map((user) => {
                  const userSavings = getUserSavings(user.id);
                  const accountsCount = getUserSavingsAccountsCount(user.id);
                  return (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <UserCheck className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className={`text-xs ${userSavings > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            Savings: {formatCurrency(userSavings)} ({accountsCount} account{accountsCount !== 1 ? 's' : ''})
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Savings Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PiggyBank className="h-5 w-5 mr-2 text-purple-600" />
            Savings Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total System Savings</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(totalSavings)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-blue-600">{savingsAccounts.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Average per Account</p>
              <p className="text-2xl font-bold text-green-600">
                {savingsAccounts.length > 0 ? formatCurrency(totalSavings / savingsAccounts.length) : formatCurrency(0)}
              </p>
            </div>
          </div>
          
          {/* Individual Account Breakdown */}
          {savingsAccounts.length > 0 && (
            <div className="mt-4 bg-white p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Account Breakdown</h4>
              <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
                {savingsAccounts.map((account) => {
                  const balance = parseFloat(account.balance?.toString() || '0') || 0;
                  const accountUser = getUserById(account.userId);
                  return (
                    <div key={account.id} className="flex justify-between items-center">
                      <span className="text-gray-600">
                        #{account.accountNumber} ({accountUser ? `${accountUser.firstName} ${accountUser.lastName}` : `User ${account.userId}`})
                      </span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(balance)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loan Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Loan Applications</h3>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              {pendingLoans} Pending
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {approvedLoans} Approved
            </span>
          </div>
        </div>

        {loans.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No loan applications to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => {
              const applicant = getUserById(loan.userId);
              return (
                <div key={loan.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(loan.status)}
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {applicant ? `${applicant.firstName} ${applicant.lastName}` : `User ID: ${loan.userId}`}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {applicant ? applicant.email : 'Email not available'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(loan.amount)}</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">Loan Type</p>
                      <p className="font-medium capitalize">{loan.loanType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium">{loan.duration} months</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Monthly Income</p>
                      <p className="font-medium">{formatCurrency(loan.monthlyIncome || 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Applied On</p>
                      <p className="font-medium">{new Date(loan.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-500 text-sm">Purpose</p>
                    <p className="font-medium">{loan.purpose}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-500 text-sm">Guarantor</p>
                    <p className="font-medium">{loan.guarantor.name} ({loan.guarantor.relationship})</p>
                    <p className="text-sm text-gray-600">{loan.guarantor.phoneNumber}</p>
                  </div>

                  {loan.status === 'pending' && (
                    <div className="flex space-x-3 pt-4 border-t">
                      <button
                        onClick={() => handleLoanAction(loan.id, 'approve')}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => setSelectedLoan(loan.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {loan.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">
                        <span className="font-medium">Rejection Reason:</span> {loan.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Registered Users</h3>
          <div className="text-sm text-gray-600">
            Total: {users.filter(u => u.role === 'user').length} users • 
            Total Savings: <span className="font-bold text-green-600">
              {formatCurrency(totalSavings)}
            </span>
          </div>
        </div>

        {users.filter(u => u.role === 'user').length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users registered yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {users.filter(u => u.role === 'user').map((user) => {
              const userSavings = getUserSavings(user.id);
              const accountsCount = getUserSavingsAccountsCount(user.id);
              const userSavingsAccounts = savingsAccounts.filter(account => 
                account.userId === user.id || account.userId === user.id.toString()
              );
              
              return (
                <div key={user.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{user.firstName} {user.lastName}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          user.isActive 
                            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' 
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                        title={user.isActive ? 'Deactivate user' : 'Activate user'}
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setUserToDelete(user.id)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Savings Information */}
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-purple-900 flex items-center">
                        <PiggyBank className="h-4 w-4 mr-1" />
                        Savings Summary
                      </h5>
                      <span className="text-lg font-bold text-purple-600">
                        {formatCurrency(userSavings)}
                      </span>
                    </div>
                    <div className="text-xs text-purple-700">
                      {accountsCount} account{accountsCount !== 1 ? 's' : ''}
                      {userSavingsAccounts.length > 0 ? (
                        <div className="mt-1 space-y-1">
                          {userSavingsAccounts.map((account) => {
                            const balance = parseFloat(account.balance?.toString() || '0') || 0;
                            return (
                              <div key={account.id} className="flex justify-between">
                                <span>#{account.accountNumber} ({account.accountType})</span>
                                <span className="font-medium text-purple-600">
                                  {formatCurrency(balance)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mt-1 text-gray-500">No savings accounts</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">{user.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date of Birth</p>
                      <p className="font-medium">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Occupation</p>
                      <p className="font-medium">{user.occupation}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Monthly Income</p>
                      <p className="font-medium">{formatCurrency(user.monthlyIncome)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Address</p>
                      <p className="font-medium">
                        {user.address.street}, {user.address.city}, {user.address.state}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Next of Kin</p>
                      <p className="font-medium">
                        {user.nextOfKin.name} ({user.nextOfKin.relationship}) - {user.nextOfKin.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      Registered: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Loan Application</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  required
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Please provide a reason for rejecting this loan application..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedLoan(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLoanAction(selectedLoan, 'reject')}
                  disabled={!rejectionReason.trim()}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Reject Loan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone and will also delete all associated loans and savings accounts.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(userToDelete)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;