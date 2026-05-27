import Box from '@mui/material/Box';
import { AuthSettings } from './AuthSettings';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgb(var(--color-bg-secondary))',
        position: 'relative',
      }}
    >
      <AuthSettings />
      {children}
    </Box>
  );
}
