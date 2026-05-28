import { describe, expect, it } from 'vitest';
import reducer, {
  closeModal,
  openModal,
  setSidebarOpen,
  toggleSidebar,
  toggleSidebarCollapsed,
} from './uiSlice';

describe('uiSlice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      sidebarOpen: false,
      sidebarCollapsed: false,
      activeModal: null,
    });
  });

  it('toggles sidebar visibility', () => {
    const state = reducer(undefined, toggleSidebar());
    expect(state.sidebarOpen).toBe(true);
  });

  it('sets sidebar open state explicitly', () => {
    const state = reducer(undefined, setSidebarOpen(true));
    expect(state.sidebarOpen).toBe(true);
  });

  it('toggles collapsed state', () => {
    const state = reducer(undefined, toggleSidebarCollapsed());
    expect(state.sidebarCollapsed).toBe(true);
  });

  it('opens and closes modal state', () => {
    const opened = reducer(undefined, openModal('delete-confirmation'));
    expect(opened.activeModal).toBe('delete-confirmation');

    const closed = reducer(opened, closeModal());
    expect(closed.activeModal).toBeNull();
  });
});
