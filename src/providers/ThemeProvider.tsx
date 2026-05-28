'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { syncSystemTheme, initializeTheme } from '@/store/slices/themeSlice';
import { LibThemeProvider } from '@awaymess/ui';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

interface ThemeProviderProps {
  children: React.ReactNode;
}

function applyDocumentTheme(mode: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(mode);
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useAppDispatch();
  const { mode, resolvedMode } = useAppSelector((state) => state.theme);
  const providerMode: 'light' | 'dark' = resolvedMode;

  // Initialize theme from localStorage on mount (client only)
  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  // Keep html class in sync with resolved theme
  useEffect(() => {
    applyDocumentTheme(resolvedMode);
  }, [resolvedMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (mode !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => dispatch(syncSystemTheme());
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, dispatch]);

  return (
    <LibThemeProvider mode={providerMode}>
      <MuiThemeProvider
        theme={(outerTheme) =>
          createTheme(outerTheme, {
            typography: {
              fontFamily:
                'var(--font-ibm-plex-sans-thai), var(--font-ibm-plex-sans), system-ui, sans-serif',
            },
          })
        }
      >
        {children}
      </MuiThemeProvider>
    </LibThemeProvider>
  );
}
