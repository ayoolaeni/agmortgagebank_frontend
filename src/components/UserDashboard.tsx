import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { CreditCard, PiggyBank, Clock, CheckCircle, XCircle, Plus, RefreshCw } from 'lucide-react';
import LoanApplication from './LoanApplication';
import SavingsManagement from './SavingsManagement';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { loans, savingsAccounts, refreshData, loading } = useApp();
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [showSavingsManagement, setShowSavingsManagement] = useState(false);

  // Filter data for current user
  const userLoans = loans.filter(loan => {
    return loan.userId === user?.id || loan.userId === user?.id.toString();
  });
  
  const userSavingsAccounts = savingsAccounts.filter(account => {
    return account.userId === user?.id || account.userId === user?.id.toString();
  });

  const totalSavings = userSavingsAccounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  const activeLoans = userLoans.filter(loan => loan.status === 'approved' || loan.status === 'disbursed');
  const pendingLoans = userLoans.filter(loan => loan.status === 'pending');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
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

  const handleRefresh = () => {
    if (refreshData) {
      refreshData();
    }
  };

  // If showing loan application
  if (showLoanApplication) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Apply for a Loan</h2>
          <button
            onClick={() => setShowLoanApplication(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            ← Back to Dashboard
          </button>
        </div>
        <LoanApplication />
      </div>
    );
  }

  // If showing savings management
  if (showSavingsManagement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Savings Management</h2>
          <button
            onClick={() => setShowSavingsManagement(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            ← Back to Dashboard
          </button>
        </div>
        <SavingsManagement />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
            <p className="text-green-100">Manage your loans and savings with Ag Mortgage Bank</p>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSavings)}</p>
              <p className="text-xs text-gray-500 mt-1">{userSavingsAccounts.length} account(s)</p>
            </div>
            <PiggyBank className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{activeLoans.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {activeLoans.length > 0 
                  ? formatCurrency(activeLoans.reduce((sum, loan) => sum + loan.amount, 0))
                  : 'No active loans'
                }
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-2xl font-bold text-gray-900">{pendingLoans.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {pendingLoans.length > 0 
                  ? formatCurrency(pendingLoans.reduce((sum, loan) => sum + loan.amount, 0))
                  : 'No pending applications'
                }
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800">Loading data...</span>
        </div>
      )}

      {/* Overview Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Loans */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Loan Applications</h3>
              <button
                onClick={() => setShowLoanApplication(true)}
                className="text-green-600 hover:text-green-500 text-sm font-medium"
              >
                Apply for Loan →
              </button>
            </div>
            {userLoans.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No loan applications yet</p>
                <button
                  onClick={() => setShowLoanApplication(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Apply for a loan
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userLoans.slice(0, 3).map((loan) => (
                  <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(loan.status)}
                      <div>
                        <p className="font-medium text-gray-900">{formatCurrency(loan.amount)}</p>
                        <p className="text-sm text-gray-500">{loan.loanType} loan</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                  </div>
                ))}
                {userLoans.length > 3 && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">and {userLoans.length - 3} more applications</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Savings Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Savings Accounts</h3>
              <button
                onClick={() => setShowSavingsManagement(true)}
                className="text-green-600 hover:text-green-500 text-sm font-medium"
              >
                Manage Savings →
              </button>
            </div>
            {userSavingsAccounts.length === 0 ? (
              <div className="text-center py-8">
                <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No savings accounts yet</p>
                <button
                  onClick={() => setShowSavingsManagement(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Open a savings account
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userSavingsAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium text-gray-900">Account #{account.accountNumber}</p>
                      <p className="text-sm text-gray-500 capitalize">{account.accountType} Account</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(account.balance)}</p>
                      <p className="text-sm text-green-600">{account.interestRate}% p.a.</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowLoanApplication(true)}
              className="flex items-center justify-center space-x-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Apply for Loan</span>
            </button>
            <button
              onClick={() => setShowSavingsManagement(true)}
              className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <PiggyBank className="h-5 w-5" />
              <span>Manage Savings</span>
            </button>
          </div>
        </div>

        {/* All Loan Applications */}
        {userLoans.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Loan Applications</h3>
            <div className="space-y-4">
              {userLoans.map((loan) => (
                <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(loan.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">{formatCurrency(loan.amount)}</h4>
                        <p className="text-sm text-gray-500">
                          {loan.loanType} loan • {loan.duration} months
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Purpose</p>
                      <p className="font-medium">{loan.purpose}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Applied On</p>
                      <p className="font-medium">{new Date(loan.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Monthly Payment</p>
                      <p className="font-medium">
                        {loan.monthlyPayment ? formatCurrency(loan.monthlyPayment) : 'Pending'}
                      </p>
                    </div>
                  </div>
                  
                  {loan.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">
                        <span className="font-medium">Rejection Reason:</span> {loan.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;