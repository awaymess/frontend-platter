'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  login,
  logout,
  fetchCurrentUser,
  clearError,
  register,
  loginWithGoogle,
} from '@/store/slices/authSlice';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      const result = await dispatch(login(credentials));
      return result;
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    await dispatch(logout());
  }, [dispatch]);

  const handleRegister = useCallback(
    async (payload: RegisterRequest) => {
      const result = await dispatch(register(payload));
      return result;
    },
    [dispatch]
  );

  const handleLoginWithGoogle = useCallback(async () => {
    const result = await dispatch(loginWithGoogle());
    return result;
  }, [dispatch]);

  const handleFetchUser = useCallback(async () => {
    await dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    loginWithGoogle: handleLoginWithGoogle,
    logout: handleLogout,
    fetchUser: handleFetchUser,
    clearError: handleClearError,
  };
}
