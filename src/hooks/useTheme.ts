'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setThemeMode, toggleTheme } from '@/store/slices/themeSlice';
import type { ThemeMode } from '@/types';

export function useTheme() {
  const dispatch = useAppDispatch();
  const { mode, resolvedMode } = useAppSelector((state) => state.theme);

  const handleSetMode = useCallback(
    (newMode: ThemeMode) => {
      dispatch(setThemeMode(newMode));
    },
    [dispatch]
  );

  const handleToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return {
    mode,
    resolvedMode,
    isDark: resolvedMode === 'dark',
    setMode: handleSetMode,
    toggle: handleToggle,
  };
}
