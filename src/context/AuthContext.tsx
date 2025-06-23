import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType } from '../types/AuthContextType';
import type { User } from '../types/User';
import authService from '../services/auth/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchUser = async () => {
    try {
      const response = await authService.profile();
      setUser(response.data.data);  
    } catch {
      setUser(null);
      localStorage.removeItem('isLoggedIn');
    } finally {
      setIsLoading(false); 
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      await authService.login(credentials);
      localStorage.setItem('isLoggedIn', 'true');
      await fetchUser();
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('isLoggedIn');
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed.');
      localStorage.removeItem('isLoggedIn');
      setUser(null);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
