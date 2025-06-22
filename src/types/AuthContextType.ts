import type { User } from "./User";

export interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean; 
  fetchUser: () => Promise<void>;
}