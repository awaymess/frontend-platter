import Box from '@mui/material/Box';
import { AuthSettings } from '@/features/auth/ui/auth-settings';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 0, sm: 2.5 },
        py: { xs: 2, sm: 5 },
        bgcolor: 'rgb(var(--color-bg-secondary))',
        background:
          'radial-gradient(circle at 12% 12%, rgba(59,130,246,0.12), transparent 30%), radial-gradient(circle at 85% 85%, rgba(99,102,241,0.1), transparent 34%), linear-gradient(180deg, rgb(var(--color-bg-secondary)) 0%, rgb(var(--color-bg-primary)) 100%)',
        position: 'relative',
      }}
    >
      <AuthSettings />
      {children}
    </Box>
  );
}
