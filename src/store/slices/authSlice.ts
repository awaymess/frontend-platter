import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth';
import axios from 'axios';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as {
        code?: string;
        message?: string;
        response?: { data?: { message?: string } };
      };

      // If the backend is not running (Network Error / Connection Refused) during local development, fall back to mock
      const isDev = process.env.NODE_ENV === 'development';
      const isLocalhost = process.env.NEXT_PUBLIC_API_URL?.includes('localhost');
      const isNetworkError =
        err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response;

      if (isDev && isLocalhost && isNetworkError) {
        console.warn('Backend server is not running or unreachable. Falling back to Mock Login.');
        if (typeof window !== 'undefined') {
          document.cookie = `access_token=mock-token; path=/; max-age=86400`;
        }
        return {
          id: '1',
          email: credentials.email,
          name: 'Demo User',
          role: 'ADMIN',
        };
      }
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    // Clear cookie immediately if we are in localhost development and might be using mock or real backend
    const isDev = process.env.NODE_ENV === 'development';
    const isLocalhost = process.env.NEXT_PUBLIC_API_URL?.includes('localhost');

    if (isDev && isLocalhost) {
      if (typeof window !== 'undefined') {
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }

    await axios.post('/api/auth/logout');
  } catch (error: unknown) {
    const err = error as {
      code?: string;
      message?: string;
      response?: { data?: { message?: string } };
    };
    const isDev = process.env.NODE_ENV === 'development';
    const isLocalhost = process.env.NEXT_PUBLIC_API_URL?.includes('localhost');
    const isNetworkError =
      err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response;

    if (isDev && isLocalhost && isNetworkError) {
      // If API is unreachable, we already cleared cookie, just return
      return;
    }
    return rejectWithValue(err.response?.data?.message || 'Logout failed');
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', payload);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as {
        code?: string;
        message?: string;
        response?: { data?: { message?: string } };
      };

      const isDev = process.env.NODE_ENV === 'development';
      const isLocalhost = process.env.NEXT_PUBLIC_API_URL?.includes('localhost');
      const isNetworkError =
        err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response;

      if (isDev && isLocalhost && isNetworkError) {
        console.warn(
          'Backend server is not running or unreachable. Falling back to Mock Register.'
        );
        if (typeof window !== 'undefined') {
          document.cookie = `access_token=mock-token; path=/; max-age=86400`;
        }
        return {
          id: '1',
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          role: 'user' as const,
        };
      }

      return rejectWithValue(err.response?.data?.message || 'Register failed');
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const isDev = process.env.NODE_ENV === 'development';
      const isLocalhost = process.env.NEXT_PUBLIC_API_URL?.includes('localhost');

      if (isDev && isLocalhost) {
        if (typeof window !== 'undefined') {
          document.cookie = `access_token=mock-token; path=/; max-age=86400`;
        }
        return {
          id: '1',
          email: 'google.demo@example.com',
          firstName: 'Google',
          lastName: 'User',
          role: 'user' as const,
        };
      }

      if (typeof window !== 'undefined') {
        window.location.href = '/api/auth/google';
      }

      return rejectWithValue('Redirecting to Google login');
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(err.response?.data?.message || 'Google login failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/auth/me');
      return response.data.data;
    } catch (error: unknown) {
      const err = error as {
        code?: string;
        message?: string;
        response?: { data?: { message?: string } };
      };

      const isDev = process.env.NODE_ENV === 'development';
      const isLocalhost = process.env.NEXT_PUBLIC_API_URL?.includes('localhost');
      const isNetworkError =
        err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response;
      const hasCookie = typeof window !== 'undefined' && document.cookie.includes('access_token=');

      if (isDev && isLocalhost && isNetworkError && hasCookie) {
        console.warn('Backend server is not running or unreachable. Falling back to Mock Session.');
        return {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'ADMIN',
        };
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        // avoid showing an error when we intentionally redirect
        if (action.payload !== 'Redirecting to Google login') {
          state.error = action.payload as string;
        }
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
