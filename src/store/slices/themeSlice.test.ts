import { describe, expect, it } from 'vitest';
import reducer, { initializeTheme, setThemeMode, syncSystemTheme, toggleTheme } from './themeSlice';

describe('themeSlice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      mode: 'system',
      resolvedMode: 'light',
    });
  });

  it('sets explicit dark mode', () => {
    const state = reducer(undefined, setThemeMode('dark'));
    expect(state).toEqual({
      mode: 'dark',
      resolvedMode: 'dark',
    });
  });

  it('toggles from light to dark', () => {
    const state = reducer({ mode: 'light', resolvedMode: 'light' }, toggleTheme());
    expect(state).toEqual({
      mode: 'dark',
      resolvedMode: 'dark',
    });
  });

  it('does not change resolved mode when not in system mode', () => {
    const state = reducer({ mode: 'dark', resolvedMode: 'dark' }, syncSystemTheme());
    expect(state).toEqual({
      mode: 'dark',
      resolvedMode: 'dark',
    });
  });

  it('keeps state untouched on initializeTheme in non-browser runtime', () => {
    const state = reducer({ mode: 'dark', resolvedMode: 'dark' }, initializeTheme());
    expect(state).toEqual({
      mode: 'dark',
      resolvedMode: 'dark',
    });
  });
});
