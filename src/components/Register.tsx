import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, MapPin, Building, Users, CreditCard, AlertCircle, CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';

interface RegisterProps {
  onToggleMode: () => void;
}

const Register: React.FC<RegisterProps> = ({ onToggleMode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    middleName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female',
    maritalStatus: 'single' as 'single' | 'married' | 'divorced' | 'widowed',
    occupation: '',
    employer: '',
    monthlyIncome: 0,
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria',
      postalCode: ''
    },
    nextOfKin: {
      name: '',
      relationship: '',
      phoneNumber: '',
      address: ''
    },
    bankVerificationNumber: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.email || !formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.dateOfBirth) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!formData.password || !formData.confirmPassword) {
          setError('Please create a password');
          return false;
        }
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          setError(passwordError);
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        break;
      case 2:
        if (!formData.address.street || !formData.address.city || !formData.address.state) {
          setError('Please complete address information');
          return false;
        }
        break;
      case 3:
        if (!formData.occupation || !formData.employer || formData.monthlyIncome <= 0) {
          setError('Please complete employment information');
          return false;
        }
        break;
      case 4:
        if (!formData.nextOfKin.name || !formData.nextOfKin.relationship || !formData.nextOfKin.phoneNumber || !formData.bankVerificationNumber) {
          setError('Please complete all verification fields');
          return false;
        }
        break;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateStep(4)) {
      setIsLoading(false);
      return;
    }

    const success = await register(formData);
    if (!success) {
      setError('Registration failed. Please try again.');
    }
    setIsLoading(false);
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: UserIcon },
    { number: 2, title: 'Address', icon: MapPin },
    { number: 3, title: 'Employment', icon: Building },
    { number: 4, title: 'Verification', icon: CreditCard }
  ];

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { label: 'Very Weak', color: 'text-red-600' };
      case 2:
        return { label: 'Weak', color: 'text-orange-600' };
      case 3:
        return { label: 'Fair', color: 'text-yellow-600' };
      case 4:
        return { label: 'Good', color: 'text-blue-600' };
      case 5:
        return { label: 'Strong', color: 'text-green-600' };
      default:
        return { label: '', color: '' };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Ag Mortgage Bank for secure banking services
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-0.5 w-16 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information & Password */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-green-600" />
                  Personal Information & Account Security
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                    <input
                      type="text"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                {/* Password Section */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-green-600" />
                    Create Your Password
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  passwordStrength <= 1 ? 'bg-red-500' :
                                  passwordStrength <= 2 ? 'bg-orange-500' :
                                  passwordStrength <= 3 ? 'bg-yellow-500' :
                                  passwordStrength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${strengthInfo.color}`}>
                              {strengthInfo.label}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className={`h-4 w-4 mr-2 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                        At least 8 characters long
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className={`h-4 w-4 mr-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} />
                        One uppercase letter
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className={`h-4 w-4 mr-2 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} />
                        One lowercase letter
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className={`h-4 w-4 mr-2 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} />
                        One number
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className={`h-4 w-4 mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`} />
                        One special character
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Address Information
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <select
                        required
                        value={formData.address.state}
                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select State</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Kano">Kano</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Oyo">Oyo</option>
                        <option value="Delta">Delta</option>
                        <option value="Anambra">Anambra</option>
                        <option value="Imo">Imo</option>
                        <option value="Enugu">Enugu</option>
                        <option value="Edo">Edo</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.address.country}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={formData.address.postalCode}
                        onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Employment Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-green-600" />
                  Employment Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                    <input
                      type="text"
                      required
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employer *</label>
                    <input
                      type="text"
                      required
                      value={formData.employer}
                      onChange={(e) => handleInputChange('employer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income (₦) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleInputChange('monthlyIncome', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Verification */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                  Verification & Next of Kin
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Verification Number (BVN) *</label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={formData.bankVerificationNumber}
                      onChange={(e) => handleInputChange('bankVerificationNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-green-600" />
                      Next of Kin Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.nextOfKin.name}
                          onChange={(e) => handleInputChange('nextOfKin.name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                        <input
                          type="text"
                          required
                          value={formData.nextOfKin.relationship}
                          onChange={(e) => handleInputChange('nextOfKin.relationship', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.nextOfKin.phoneNumber}
                          onChange={(e) => handleInputChange('nextOfKin.phoneNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                        <input
                          type="text"
                          required
                          value={formData.nextOfKin.address}
                          onChange={(e) => handleInputChange('nextOfKin.address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Previous
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;