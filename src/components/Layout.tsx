import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ag Mortgage Bank Plc</h1>
                <p className="text-sm text-gray-600">Your Trusted Financial Partner</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                {isAdmin ? (
                  <Shield className="h-4 w-4 text-green-600" />
                ) : (
                  <User className="h-4 w-4 text-green-600" />
                )}
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                {isAdmin && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Admin</span>}
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - No Navigation Bar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Ag Mortgage Bank Plc</h3>
              <p className="text-gray-400">Your trusted financial partner in Nigeria, providing comprehensive banking and loan services.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <p className="text-gray-400">📧 info@agmortgagebank.com</p>
              <p className="text-gray-400">📞 +234 800 123 4567</p>
              <p className="text-gray-400">📍 Lagos, Nigeria</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Banking Hours</h3>
              <p className="text-gray-400">Monday - Friday: 8:00 AM - 4:00 PM</p>
              <p className="text-gray-400">Saturday: 9:00 AM - 1:00 PM</p>
              <p className="text-gray-400">Sunday: Closed</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ag Mortgage Bank Plc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;