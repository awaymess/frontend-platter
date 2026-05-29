'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from '@/i18n/useTranslations';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, TextField, IconButton, Alert, Checkbox } from '@awaymess/ui';
import { CircularProgress } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(t('login.title'));
      router.push('/dashboard');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 5 },
        width: '100%',
        maxWidth: 440,
        mx: 2,
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgb(var(--color-border))',
        bgcolor: 'rgb(var(--color-bg-elevated))',
        boxShadow: 'var(--shadow-xl)',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-lg)',
            background:
              'linear-gradient(135deg, rgb(var(--color-accent)), rgb(var(--color-accent-hover)))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.25rem',
            mx: 'auto',
            mb: 2,
          }}
        >
          FP
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
          {t('login.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('login.subtitle')}
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          onClose={clearError}
          sx={{ mb: 3, borderRadius: 'var(--radius-md)' }}
        >
          {error}
        </Alert>
      )}

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register('email')}
          label={t('login.email')}
          placeholder={t('login.emailPlaceholder')}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          autoComplete="email"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ fontSize: 20, color: 'rgb(var(--color-text-tertiary))' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2.5 }}
          id="login-email"
        />

        <TextField
          {...register('password')}
          label={t('login.password')}
          placeholder={t('login.passwordPlaceholder')}
          type={showPassword ? 'text' : 'password'}
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
          autoComplete="current-password"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ fontSize: 20, color: 'rgb(var(--color-text-tertiary))' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ fontSize: 20 }} />
                    ) : (
                      <Visibility sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 1.5 }}
          id="login-password"
        />

        {/* Remember me + Forgot password */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <FormControlLabel
            control={<Checkbox size="small" />}
            label={<Typography variant="body2">{t('login.rememberMe')}</Typography>}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'rgb(var(--color-accent))',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('login.forgotPassword')}
          </Typography>
        </Box>

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            py: 1.25,
            fontSize: '0.9375rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)',
            background:
              'linear-gradient(135deg, rgb(var(--color-accent)), rgb(var(--color-accent-hover)))',
            '&:hover': {
              background:
                'linear-gradient(135deg, rgb(var(--color-accent-hover)), rgb(var(--color-accent)))',
            },
          }}
          id="login-submit-btn"
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : t('login.submit')}
        </Button>
      </Box>

      {/* Register link */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {t('login.noAccount')}{' '}
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: 'rgb(var(--color-accent))',
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('login.register')}
          </Typography>
        </Typography>
      </Box>
    </Paper>
  );
}
