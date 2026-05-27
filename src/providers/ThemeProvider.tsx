'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { syncSystemTheme, initializeTheme } from '@/store/slices/themeSlice';
import { LibThemeProvider } from '@awaymess/ui';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const subscribeHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useAppDispatch();
  const { mode, resolvedMode } = useAppSelector((state) => state.theme);
  const pathname = usePathname();
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );

  const providerMode: 'light' | 'dark' = isHydrated ? resolvedMode : 'light';

  // Initialize theme from localStorage on mount (client only)
  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  // After mount, sync clientMode from Redux + re-apply html class on route change
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedMode);
  }, [resolvedMode, pathname]);

  // Listen for system theme changes
  useEffect(() => {
    if (mode !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => dispatch(syncSystemTheme());
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, dispatch]);

  return (
    // suppressHydrationWarning: server renders 'light', inline script sets correct class before hydration
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
