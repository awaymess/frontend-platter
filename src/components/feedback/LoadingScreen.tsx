import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';

export function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'rgb(var(--color-bg-primary))',
      }}
    >
      <CircularProgress size={40} sx={{ color: 'rgb(var(--color-accent))' }} />
    </Box>
  );
}
