import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { CreditCard, DollarSign, FileText, Users, AlertCircle } from 'lucide-react';

const LoanApplication: React.FC = () => {
  const { user } = useAuth();
  const { addLoanApplication } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    loanType: 'personal' as 'personal' | 'mortgage' | 'business' | 'auto',
    purpose: '',
    duration: '',
    collateral: '',
    guarantor: {
      name: '',
      phoneNumber: '',
      relationship: '',
      address: ''
    }
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const calculateMonthlyPayment = (amount: number, duration: number, interestRate: number) => {
    const monthlyRate = interestRate / 100 / 12;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) / 
                   (Math.pow(1 + monthlyRate, duration) - 1);
    return payment;
  };

  const getInterestRate = (loanType: string) => {
    const rates = {
      personal: 18,
      mortgage: 12,
      business: 15,
      auto: 14
    };
    return rates[loanType as keyof typeof rates];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!user) {
      setError('User not authenticated');
      setIsSubmitting(false);
      return;
    }

    // Validation
    if (!formData.amount || !formData.purpose || !formData.duration) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (!formData.guarantor.name || !formData.guarantor.phoneNumber || !formData.guarantor.relationship) {
      setError('Please complete guarantor information');
      setIsSubmitting(false);
      return;
    }

    const amount = parseFloat(formData.amount);
    const duration = parseInt(formData.duration);
    const interestRate = getInterestRate(formData.loanType);
    const monthlyPayment = calculateMonthlyPayment(amount, duration, interestRate);

    const loanApplicationData = {
      amount,
      loanType: formData.loanType,
      purpose: formData.purpose,
      duration,
      monthlyIncome: user.monthlyIncome || 0,
      collateral: formData.collateral || undefined,
      guarantor: formData.guarantor,
      interestRate,
      monthlyPayment
    };

    try {
      console.log('Submitting loan application:', loanApplicationData);
      await addLoanApplication(loanApplicationData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        amount: '',
        loanType: 'personal',
        purpose: '',
        duration: '',
        collateral: '',
        guarantor: {
          name: '',
          phoneNumber: '',
          relationship: '',
          address: ''
        }
      });
    } catch (err) {
      console.error('Loan application error:', err);
      setError('Failed to submit loan application. Please try again.');
    }

    setIsSubmitting(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">Application Submitted Successfully!</h3>
        <p className="text-green-700 mb-4">
          Your loan application has been received and is under review. You will be notified once a decision is made.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <CreditCard className="h-6 w-6 mr-2 text-green-600" />
          Apply for a Loan
        </h2>
        <p className="text-gray-600 mt-2">Complete the form below to apply for a loan with Ag Mortgage Bank</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Loan Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Loan Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type *</label>
              <select
                required
                value={formData.loanType}
                onChange={(e) => handleInputChange('loanType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="personal">Personal Loan</option>
                <option value="mortgage">Mortgage Loan</option>
                <option value="business">Business Loan</option>
                <option value="auto">Auto Loan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₦) *</label>
              <input
                type="number"
                required
                min="50000"
                max="50000000"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 500000"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum: ₦50,000 | Maximum: ₦50,000,000</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Months) *</label>
              <select
                required
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select duration</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="18">18 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
                <option value="60">60 months</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
              <input
                type="text"
                value={`${getInterestRate(formData.loanType)}% per annum`}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Loan *</label>
              <textarea
                required
                rows={3}
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe the purpose of your loan application..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Collateral (Optional)</label>
              <input
                type="text"
                value={formData.collateral}
                onChange={(e) => handleInputChange('collateral', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe any collateral you're offering..."
              />
            </div>
          </div>
        </div>

        {/* Guarantor Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            Guarantor Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={formData.guarantor.name}
                onChange={(e) => handleInputChange('guarantor.name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.guarantor.phoneNumber}
                onChange={(e) => handleInputChange('guarantor.phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
              <input
                type="text"
                required
                value={formData.guarantor.relationship}
                onChange={(e) => handleInputChange('guarantor.relationship', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Friend, Colleague, Family Member"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={formData.guarantor.address}
                onChange={(e) => handleInputChange('guarantor.address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Loan Summary */}
        {formData.amount && formData.duration && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Loan Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Loan Amount</p>
                <p className="font-semibold text-lg">{formatCurrency(parseFloat(formData.amount) || 0)}</p>
              </div>
              <div>
                <p className="text-gray-600">Interest Rate</p>
                <p className="font-semibold text-lg">{getInterestRate(formData.loanType)}% p.a.</p>
              </div>
              <div>
                <p className="text-gray-600">Estimated Monthly Payment</p>
                <p className="font-semibold text-lg">
                  {formData.amount && formData.duration 
                    ? formatCurrency(calculateMonthlyPayment(
                        parseFloat(formData.amount), 
                        parseInt(formData.duration), 
                        getInterestRate(formData.loanType)
                      ))
                    : '---'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2 font-medium"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Submit Application</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanApplication;