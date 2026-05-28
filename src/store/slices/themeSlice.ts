import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '@/types';

interface ThemeState {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
}

function persistThemeMode(mode: ThemeMode) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme-mode', mode);
  document.cookie = `theme-mode=${mode}; path=/; max-age=31536000; samesite=lax`;
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
      persistThemeMode(action.payload);
    },
    toggleTheme(state) {
      const newMode = state.resolvedMode === 'light' ? 'dark' : 'light';
      state.mode = newMode;
      state.resolvedMode = newMode;
      persistThemeMode(newMode);
    },
    syncSystemTheme(state) {
      if (state.mode === 'system') {
        state.resolvedMode = getSystemTheme();
      }
    },
    initializeTheme(state) {
      if (typeof window !== 'undefined') {
        const storageMode = localStorage.getItem('theme-mode');
        const cookieMode = document.cookie
          .split('; ')
          .find((entry) => entry.startsWith('theme-mode='))
          ?.split('=')[1];
        const rawMode = storageMode || cookieMode || 'system';
        const savedMode: ThemeMode =
          rawMode === 'light' || rawMode === 'dark' || rawMode === 'system' ? rawMode : 'system';
        state.mode = savedMode;
        state.resolvedMode = resolveMode(savedMode);
        persistThemeMode(savedMode);
      }
    },
  },
});

export const { setThemeMode, toggleTheme, syncSystemTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
