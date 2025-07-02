import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { PiggyBank, Plus, Minus, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const SavingsManagement: React.FC = () => {
  const { user } = useAuth();
  const { savingsAccounts, addSavingsAccount, addTransaction, loading } = useApp();
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userSavingsAccounts = savingsAccounts.filter(account => 
    account.userId === user?.id || account.userId === user?.id.toString()
  );

  const [newAccountData, setNewAccountData] = useState({
    accountType: 'savings' as 'savings' | 'fixed',
    initialDeposit: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!user) {
      setError('User not authenticated');
      setIsSubmitting(false);
      return;
    }

    const initialDeposit = parseFloat(newAccountData.initialDeposit);
    if (initialDeposit < 1000) {
      setError('Minimum initial deposit is ₦1,000');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Creating savings account with data:', {
        accountType: newAccountData.accountType,
        initialDeposit
      });

      await addSavingsAccount({
        accountType: newAccountData.accountType,
        initialDeposit
      });

      setSuccess('Savings account created successfully!');
      setShowCreateAccount(false);
      setNewAccountData({ accountType: 'savings', initialDeposit: '' });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error creating savings account:', err);
      setError('Failed to create savings account. Please try again.');
    }

    setIsSubmitting(false);
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!selectedAccount || !transactionAmount) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    const amount = parseFloat(transactionAmount);
    const account = userSavingsAccounts.find(acc => acc.id === selectedAccount);
    
    if (!account) {
      setError('Account not found');
      setIsSubmitting(false);
      return;
    }

    if (transactionType === 'withdrawal' && amount > account.balance) {
      setError('Insufficient balance');
      setIsSubmitting(false);
      return;
    }

    if (amount <= 0) {
      setError('Amount must be greater than zero');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Processing transaction:', {
        accountId: selectedAccount,
        type: transactionType,
        amount,
        description: transactionDescription
      });

      await addTransaction(selectedAccount, {
        type: transactionType,
        amount,
        description: transactionDescription || `${transactionType === 'deposit' ? 'Cash deposit' : 'Cash withdrawal'}`
      });

      setSuccess(`${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
      setShowTransaction(false);
      setTransactionAmount('');
      setTransactionDescription('');
      setSelectedAccount('');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error processing transaction:', err);
      setError('Failed to process transaction. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <PiggyBank className="h-6 w-6 mr-2 text-green-600" />
          Savings Management
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateAccount(true)}
            disabled={loading || isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>Open Account</span>
          </button>
          {userSavingsAccounts.length > 0 && (
            <button
              onClick={() => setShowTransaction(true)}
              disabled={loading || isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Make Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Loading Indicator */}
      {(loading || isSubmitting) && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800">
            {isSubmitting ? 'Processing...' : 'Loading data...'}
          </span>
        </div>
      )}

      {/* Accounts Overview */}
      {userSavingsAccounts.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <PiggyBank className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Savings Accounts Yet</h3>
          <p className="text-gray-600 mb-6">Start saving with Ag Mortgage Bank and earn competitive interest rates</p>
          <button
            onClick={() => setShowCreateAccount(true)}
            disabled={loading || isSubmitting}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            Open Your First Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userSavingsAccounts.map((account) => (
            <div key={account.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Account #{account.accountNumber}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">{account.accountType} Account</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.balance)}</p>
                  <p className="text-sm text-green-600">{account.interestRate}% p.a.</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Transactions</h4>
                {!account.transactions || account.transactions.length === 0 ? (
                  <p className="text-sm text-gray-500">No transactions yet</p>
                ) : (
                  <div className="space-y-2">
                    {account.transactions.slice(-3).reverse().map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-2">
                          {transaction.type === 'deposit' ? (
                            <Plus className="h-4 w-4 text-green-600" />
                          ) : (
                            <Minus className="h-4 w-4 text-red-600" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500">Bal: {formatCurrency(transaction.balance)}</p>
                        </div>
                      </div>
                    ))}
                    {account.transactions.length > 3 && (
                      <p className="text-xs text-center text-gray-500 pt-2">
                        and {account.transactions.length - 3} more transactions
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Open New Savings Account</h3>
            
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <select
                  value={newAccountData.accountType}
                  onChange={(e) => setNewAccountData(prev => ({ ...prev, accountType: e.target.value as 'savings' | 'fixed' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="savings">Savings Account (4.5% p.a.)</option>
                  <option value="fixed">Fixed Deposit (8.5% p.a.)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Deposit (₦)</label>
                <input
                  type="number"
                  min="1000"
                  required
                  value={newAccountData.initialDeposit}
                  onChange={(e) => setNewAccountData(prev => ({ ...prev, initialDeposit: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Minimum ₦1,000"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAccount(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Open Account</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Make Transaction</h3>
            
            <form onSubmit={handleTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
                <select
                  required
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose account</option>
                  {userSavingsAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      #{account.accountNumber} - {formatCurrency(account.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="deposit"
                      checked={transactionType === 'deposit'}
                      onChange={(e) => setTransactionType(e.target.value as 'deposit' | 'withdrawal')}
                      className="mr-2"
                    />
                    <span className="text-green-600">Deposit</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="withdrawal"
                      checked={transactionType === 'withdrawal'}
                      onChange={(e) => setTransactionType(e.target.value as 'deposit' | 'withdrawal')}
                      className="mr-2"
                    />
                    <span className="text-red-600">Withdrawal</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <input
                  type="text"
                  value={transactionDescription}
                  onChange={(e) => setTransactionDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Transaction description"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTransaction(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2 ${
                    transactionType === 'deposit' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{transactionType === 'deposit' ? 'Deposit' : 'Withdraw'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsManagement;