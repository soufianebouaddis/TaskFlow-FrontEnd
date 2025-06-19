import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType } from '../types/AuthContextType';
import type { User } from '../types/User';
import axiosInstance from './../axios/axiosInstance';


export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get<User>('/profile'); 
      setUser(response.data);
    } catch {
      setUser(null);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    await axiosInstance.post('/login', credentials);
    await fetchUser();
  };

  const logout = async () => {
    await axiosInstance.post('/logout');
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
