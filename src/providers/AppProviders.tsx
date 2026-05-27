'use client';

import { ReduxProvider } from './ReduxProvider';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from 'sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider>
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
