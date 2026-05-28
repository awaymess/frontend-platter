'use client';

import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from '@/store';
import type { ThemeMode } from '@/types';

interface ReduxProviderProps {
  children: React.ReactNode;
  initialThemeMode: ThemeMode;
  initialResolvedMode: 'light' | 'dark';
}

export function ReduxProvider({
  children,
  initialThemeMode,
  initialResolvedMode,
}: ReduxProviderProps) {
  const store: AppStore = useMemo(
    () =>
      makeStore({
        theme: {
          mode: initialThemeMode,
          resolvedMode: initialResolvedMode,
        },
      }),
    [initialThemeMode, initialResolvedMode]
  );

  return <Provider store={store}>{children}</Provider>;
}
