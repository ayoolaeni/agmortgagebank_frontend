import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import api from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('Checking existing session...', { savedUser: !!savedUser, token: !!token });
    
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('Restored user session:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      
      const response = await api.post('/auth/login', { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      console.log('Login response:', response.data);
      
      const { user: userData, token } = response.data;
      
      if (!userData || !token) {
        console.error('Invalid response format:', response.data);
        return false;
      }
      
      console.log('Login successful for user:', userData);
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      // Trigger a custom event to notify other parts of the app
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData }));
      
      return true;
    } catch (error: any) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Clear any existing invalid session
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'isActive' | 'role'> & { password: string; confirmPassword: string }): Promise<boolean> => {
    try {
      console.log('Attempting registration for:', userData.email);
      
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...registrationData } = userData;
      
      const response = await api.post('/auth/register', registrationData);
      
      console.log('Registration response:', response.data);
      
      const { user: newUser, token } = response.data;
      
      if (!newUser || !token) {
        console.error('Invalid registration response format:', response.data);
        return false;
      }
      
      console.log('Registration successful for user:', newUser);
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', token);
      
      // Trigger a custom event to notify other parts of the app
      window.dispatchEvent(new CustomEvent('userRegistered', { detail: newUser }));
      
      return true;
    } catch (error: any) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return false;
    }
  };

  const logout = () => {
    console.log('User logging out');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Trigger a custom event to notify other parts of the app
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};