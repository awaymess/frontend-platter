'use client';

import Box from '@mui/material/Box';
import { Sidebar } from '@/widgets/dashboard-shell/ui/sidebar';
import { Navbar } from '@/widgets/dashboard-shell/ui/navbar';
import { ErrorBoundary } from '@/widgets/feedback/error-boundary';
import { useThemeMode } from '@/hooks/useThemeMode';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          background:
            mode === 'dark'
              ? 'radial-gradient(circle at 20% 0%, rgba(99, 102, 241, 0.12), transparent 30%), #09090b'
              : 'linear-gradient(180deg, rgba(99, 102, 241, 0.04) 0%, transparent 40%), #f8fafc',
        }}
      >
        <Navbar />
        <ErrorBoundary>
          <Box sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>{children}</Box>
        </ErrorBoundary>
      </Box>
    </Box>
  );
}
