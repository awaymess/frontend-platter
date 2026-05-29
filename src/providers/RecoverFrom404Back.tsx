'use client';

import { useEffect } from 'react';

export function RecoverFrom404Back() {
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      try {
        const navEntries = performance.getEntriesByType('navigation');
        const navType = navEntries[0] ? (navEntries[0] as PerformanceNavigationTiming).type : '';
        const isBackForward = event.persisted || navType === 'back_forward';
        if (!isBackForward) return;
        window.location.reload();
      } catch {
        // no-op: best-effort recovery
      }
    };

    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  return null;
}
