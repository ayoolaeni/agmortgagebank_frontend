import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, CreditCard, PiggyBank, Users, CheckCircle, Star, Phone, Mail, MapPin, Building, Calculator } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
  // Loan calculator state
  const [loanAmount, setLoanAmount] = useState('500000');
  const [loanType, setLoanType] = useState('personal');
  const [loanDuration, setLoanDuration] = useState('12');
  const [calculationResult, setCalculationResult] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    interestRate: 18
  });

  // Interest rates for different loan types
  const interestRates = {
    personal: 18,
    mortgage: 12,
    business: 15,
    auto: 14
  };

  // Calculate loan details
  const calculateLoan = () => {
    const principal = parseFloat(loanAmount) || 0;
    const duration = parseInt(loanDuration) || 12;
    const annualRate = interestRates[loanType as keyof typeof interestRates];
    const monthlyRate = annualRate / 100 / 12;
    
    if (principal > 0 && duration > 0) {
      // Calculate monthly payment using loan formula
      const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, duration)) / 
                            (Math.pow(1 + monthlyRate, duration) - 1);
      
      const totalPayment = monthlyPayment * duration;
      const totalInterest = totalPayment - principal;
      
      setCalculationResult({
        monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
        totalPayment: isNaN(totalPayment) ? 0 : totalPayment,
        totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
        interestRate: annualRate
      });
    } else {
      setCalculationResult({
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        interestRate: annualRate
      });
    }
  };

  // Recalculate when inputs change
  useEffect(() => {
    calculateLoan();
  }, [loanAmount, loanType, loanDuration]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (value: string) => {
    // Remove non-digits
    const numericValue = value.replace(/[^\d]/g, '');
    // Add commas
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^\d]/g, '');
    setLoanAmount(numericValue);
  };

  const services = [
    {
      icon: CreditCard,
      title: 'Personal Loans',
      description: 'Quick and easy personal loans with competitive interest rates starting from 18% per annum.',
      features: ['Fast approval process', 'Flexible repayment terms', 'No hidden charges']
    },
    {
      icon: Building,
      title: 'Mortgage Loans',
      description: 'Make your dream home a reality with our affordable mortgage solutions at 12% per annum.',
      features: ['Up to 25 years repayment', 'Low down payment', 'Professional guidance']
    },
    {
      icon: PiggyBank,
      title: 'Savings Accounts',
      description: 'Grow your money with our high-yield savings accounts offering up to 8.5% interest.',
      features: ['High interest rates', 'No monthly fees', 'Online banking access']
    },
    {
      icon: Users,
      title: 'Business Loans',
      description: 'Fuel your business growth with our tailored business financing solutions at 15% per annum.',
      features: ['Working capital loans', 'Equipment financing', 'Business expansion loans']
    }
  ];

  const testimonials = [
    {
      name: 'Adebayo Johnson',
      location: 'Lagos',
      rating: 5,
      comment: 'Ag Mortgage Bank helped me secure my dream home with their excellent mortgage services. The process was smooth and professional.'
    },
    {
      name: 'Fatima Ibrahim',
      location: 'Abuja',
      rating: 5,
      comment: 'Their personal loan service is outstanding. I got approved within 24 hours and the interest rates are very competitive.'
    },
    {
      name: 'Chinedu Okafor',
      location: 'Port Harcourt',
      rating: 5,
      comment: 'The savings account has helped me grow my money significantly. The online platform is user-friendly and secure.'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Happy Customers' },
    { number: '₦50B+', label: 'Loans Disbursed' },
    { number: '25+', label: 'Years of Excellence' },
    { number: '100+', label: 'Branch Locations' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ag Mortgage Bank Plc</h1>
                <p className="text-xs text-gray-600">Your Trusted Financial Partner</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogin}
                className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
              >
                Sign In
              </button>
              <button
                onClick={onRegister}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Your Financial Dreams,
                <span className="text-green-600"> Our Priority</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience world-class banking services with Ag Mortgage Bank Plc. From personal loans to mortgage solutions, 
                we're here to help you achieve your financial goals with competitive rates and exceptional service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onRegister}
                  className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span>Open Account Today</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={onLogin}
                  className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 font-semibold"
                >
                  Access Your Account
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-green-600" />
                    Loan Calculator
                  </h3>
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₦)</label>
                    <input
                      type="text"
                      value={formatNumber(loanAmount)}
                      onChange={handleAmountChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="500,000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Amount: {formatCurrency(parseFloat(loanAmount) || 0)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type</label>
                    <select 
                      value={loanType}
                      onChange={(e) => setLoanType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="personal">Personal Loan (18% p.a.)</option>
                      <option value="mortgage">Mortgage Loan (12% p.a.)</option>
                      <option value="business">Business Loan (15% p.a.)</option>
                      <option value="auto">Auto Loan (14% p.a.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <select 
                      value={loanDuration}
                      onChange={(e) => setLoanDuration(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="18">18 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                      <option value="48">48 months</option>
                      <option value="60">60 months</option>
                    </select>
                  </div>

                  {/* Calculation Results */}
                  {parseFloat(loanAmount) > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="text-sm font-semibold text-green-900 mb-3">Loan Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Monthly Payment:</span>
                          <span className="font-semibold text-green-900">
                            {formatCurrency(calculationResult.monthlyPayment)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Total Payment:</span>
                          <span className="font-semibold text-green-900">
                            {formatCurrency(calculationResult.totalPayment)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Total Interest:</span>
                          <span className="font-semibold text-green-900">
                            {formatCurrency(calculationResult.totalInterest)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-green-300 pt-2">
                          <span className="text-green-700">Interest Rate:</span>
                          <span className="font-semibold text-green-900">
                            {calculationResult.interestRate}% p.a.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={onRegister}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Financial Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover a comprehensive range of banking and financial services designed to meet your every need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <service.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onRegister}
                  className="mt-6 text-green-600 hover:text-green-700 font-semibold flex items-center space-x-2 transition-colors duration-200"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Ag Mortgage Bank?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Trusted</h3>
                    <p className="text-gray-600">Your financial security is our top priority with advanced encryption and fraud protection.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitive Rates</h3>
                    <p className="text-gray-600">Enjoy some of the most competitive interest rates in the Nigerian banking industry.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Support</h3>
                    <p className="text-gray-600">Our experienced team is always ready to provide personalized financial guidance.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
              <p className="text-green-100 mb-8 leading-relaxed">
                Join thousands of satisfied customers who trust Ag Mortgage Bank for their financial needs. 
                Open your account today and experience banking excellence.
              </p>
              <div className="space-y-4">
                <button
                  onClick={onRegister}
                  className="w-full bg-white text-green-600 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
                >
                  Open Account Now
                </button>
                <button
                  onClick={onLogin}
                  className="w-full border-2 border-white text-white py-3 rounded-lg hover:bg-white hover:text-green-600 transition-all duration-200 font-semibold"
                >
                  Sign In to Existing Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Don't just take our word for it - hear from our satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.comment}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-xl text-green-100">We're here to help with all your banking needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
              <p className="text-green-100">+234 800 123 4567</p>
              <p className="text-green-100">Available 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
              <p className="text-green-100">info@agmortgagebank.com</p>
              <p className="text-green-100">support@agmortgagebank.com</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
              <p className="text-green-100">123 Banking Street</p>
              <p className="text-green-100">Lagos, Nigeria</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Ag Mortgage Bank Plc</h3>
                </div>
              </div>
              <p className="text-gray-400">Your trusted financial partner in Nigeria, providing comprehensive banking and loan services.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Personal Loans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mortgage Loans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business Loans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Savings Accounts</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Branch Locator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ag Mortgage Bank Plc. All rights reserved. Licensed by the Central Bank of Nigeria.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;