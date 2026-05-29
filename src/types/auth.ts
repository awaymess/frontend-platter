export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
}

export type UserRole = 'admin' | 'user' | 'editor';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  // Note: tokens are set via httpOnly cookies by the backend
}

export interface RefreshResponse {
  // Note: new tokens are set via httpOnly cookies by the backend
  success: boolean;
}
