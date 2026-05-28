'use client';

import { ReduxProvider } from './ReduxProvider';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from 'sonner';
import type { ThemeMode } from '@/types';

interface AppProvidersProps {
  children: React.ReactNode;
  initialThemeMode: ThemeMode;
  initialResolvedMode: 'light' | 'dark';
}

export function AppProviders({
  children,
  initialThemeMode,
  initialResolvedMode,
}: AppProvidersProps) {
  return (
    <ReduxProvider initialThemeMode={initialThemeMode} initialResolvedMode={initialResolvedMode}>
      <ThemeProvider>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'var(--font-ibm-plex-sans-thai), var(--font-ibm-plex-sans), sans-serif',
            },
          }}
        />
      </ThemeProvider>
    </ReduxProvider>
  );
}
