import { UserRole } from "@/types/UserRole";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
  role: UserRole;
  preferredLatitude: number | null;
  preferredLongitude: number | null;
  preferredAddress: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string | null;
  email: string;
  password: string;
  confirmPassword: string;
  preferredLatitude?: number;
  preferredLongitude?: number;
  preferredAddress?: string;
}

// Interfacce per AuthContext

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  login: (params: AuthLoginParams) => Promise<void>;
  register: (params: AuthRegisterParams) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthLoginParams {
  email: string;
  password: string;
}

export interface AuthRegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  preferredLatitude?: number;
  preferredLongitude?: number;
  preferredAddress?: string;
}
