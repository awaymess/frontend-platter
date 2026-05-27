import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '@/types';

interface ThemeState {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') return getSystemTheme();
  return mode;
}

const initialState: ThemeState = {
  mode: 'system',
  resolvedMode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      state.resolvedMode = resolveMode(action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-mode', action.payload);
      }
    },
    toggleTheme(state) {
      const newMode = state.resolvedMode === 'light' ? 'dark' : 'light';
      state.mode = newMode;
      state.resolvedMode = newMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-mode', newMode);
      }
    },
    syncSystemTheme(state) {
      if (state.mode === 'system') {
        state.resolvedMode = getSystemTheme();
      }
    },
    initializeTheme(state) {
      if (typeof window !== 'undefined') {
        const savedMode = (localStorage.getItem('theme-mode') as ThemeMode) || 'system';
        state.mode = savedMode;
        state.resolvedMode = resolveMode(savedMode);
      }
    },
  },
});

export const { setThemeMode, toggleTheme, syncSystemTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
