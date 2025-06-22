import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType } from '../types/AuthContextType';
import type { User } from '../types/task-type/User';
import authService from '../services/auth/authService';

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
    await authService.login(credentials);
    localStorage.setItem('isLoggedIn', 'true');
    await fetchUser();
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('isLoggedIn');
    setUser(null);
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
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
