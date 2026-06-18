import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import type { Customer, LoginRequest, RegisterRequest } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: Customer | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<Customer>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore Session on Mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // Listen to unauthorized actions (from axios interceptor)
    const handleUnauthorized = () => {
      logout();
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      
      // Store in State
      setToken(data.access_token);
      const customerData: Customer = {
        cust_id: data.cust_id,
        name: data.name,
        email: data.email,
        phone_no: '9876543210', // Default mock info
        gender: 'Male',
        age: 25,
      };
      setUser(customerData);

      // Persist in LocalStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(customerData));
      
      toast.success(`Welcome back, ${data.name}!`);
    } catch (error: any) {
      const errMsg = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      toast.success(res.message || 'Registration successful! Please login.');
    } catch (error: any) {
      const errMsg = error.response?.data?.detail || 'Registration failed. Try again.';
      toast.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully.');
  };

  const updateProfile = (profile: Partial<Customer>) => {
    if (!user) return;
    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Log Activity
    const logs = JSON.parse(localStorage.getItem('tms_activity_logs') || '[]');
    logs.unshift({
      id: Math.random().toString(),
      action: 'Updated Profile',
      details: 'Customer profile details updated successfully',
      timestamp: new Date().toISOString(),
      type: 'info'
    });
    localStorage.setItem('tms_activity_logs', JSON.stringify(logs.slice(0, 50)));

    toast.success('Profile updated successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
