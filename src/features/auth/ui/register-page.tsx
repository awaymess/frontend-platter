'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import { Person, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import { Button, TextField, IconButton, Alert } from '@awaymess/ui';
import { CircularProgress } from '@mui/material';
import { useTranslations } from '@/i18n/useTranslations';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const { resolvedMode } = useTheme();
  const { register: registerUser, loginWithGoogle, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isDark = resolvedMode === 'dark';

  const schema = useMemo(
    () =>
      z
        .object({
          firstName: z.string().min(1, 'First name is required'),
          lastName: z.string().min(1, 'Last name is required'),
          email: z.string().min(1, t('errors.invalidEmail')).email(t('errors.invalidEmail')),
          password: z
            .string()
            .min(1, t('errors.passwordRequired'))
            .min(6, t('errors.passwordMinLength', { min: 6 })),
          confirmPassword: z.string().min(1, 'Please confirm your password'),
        })
        .refine((values) => values.password === values.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(t('login.register'));
      router.push('/dashboard');
    }
  };

  const handleGoogleRegister = async () => {
    const result = await loginWithGoogle();
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(t('login.register'));
      router.push('/dashboard');
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 620, mx: 'auto', px: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: { xs: '18px', md: '24px' },
          border: isDark ? '1px solid rgba(99,102,241,0.14)' : '1px solid rgba(99,102,241,0.16)',
          bgcolor: isDark ? '#0c1428' : '#ffffff',
          boxShadow: isDark
            ? '0 18px 48px rgba(2, 6, 23, 0.45)'
            : '0 20px 46px rgba(15, 23, 42, 0.14)',
          p: { xs: 3, sm: 4, md: 4.5 },
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, lineHeight: 1.1, mb: 1, color: isDark ? '#f8fafc' : '#0f172a' }}
        >
          {t('login.register')}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 3, color: isDark ? 'rgba(226,232,240,0.7)' : 'rgba(15,23,42,0.62)' }}
        >
          Create your account to continue
        </Typography>

        {error && (
          <Alert
            severity="error"
            onClose={clearError}
            sx={{ mb: 2.5, borderRadius: 'var(--radius-md)' }}
          >
            {error}
          </Alert>
        )}

        <Button
          type="button"
          variant="outlined"
          fullWidth
          onClick={handleGoogleRegister}
          disabled={isLoading}
          sx={{
            py: 1.15,
            borderRadius: '12px',
            fontWeight: 700,
            mb: 2,
            borderColor: isDark ? 'rgba(148,163,184,0.34)' : 'rgba(100,116,139,0.36)',
            color: isDark ? '#e2e8f0' : '#1e293b',
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
          }}
          startIcon={<GoogleIcon fontSize="small" />}
        >
          Continue with Google
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Divider sx={{ flex: 1, opacity: 0.35 }} />
          <Typography sx={{ fontSize: 12, opacity: 0.7 }}>or</Typography>
          <Divider sx={{ flex: 1, opacity: 0.35 }} />
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}
          >
            <TextField
              {...register('firstName')}
              label="First Name"
              placeholder="Enter first name"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ fontSize: 20, color: 'rgb(var(--color-text-tertiary))' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              {...register('lastName')}
              label="Last Name"
              placeholder="Enter last name"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ fontSize: 20, color: 'rgb(var(--color-text-tertiary))' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

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
            sx={{ mt: 1.5 }}
          />

          <TextField
            {...register('password')}
            label={t('login.password')}
            placeholder={t('login.passwordPlaceholder')}
            type={showPassword ? 'text' : 'password'}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            autoComplete="new-password"
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
                      onClick={() => setShowPassword((prev) => !prev)}
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
            sx={{ mt: 1.5 }}
          />

          <TextField
            {...register('confirmPassword')}
            label="Confirm Password"
            placeholder="Re-enter your password"
            type={showConfirmPassword ? 'text' : 'password'}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
            autoComplete="new-password"
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
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff sx={{ fontSize: 20 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mt: 1.5 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              py: 1.3,
              fontSize: '0.96rem',
              fontWeight: 700,
              borderRadius: '12px',
              mt: 2.25,
              background: 'linear-gradient(145deg, #2563eb, #3b82f6)',
              boxShadow: '0 12px 24px rgba(37,99,235,0.34)',
              '&:hover': {
                background: 'linear-gradient(145deg, #1d4ed8, #2563eb)',
              },
            }}
          >
            {isLoading ? <CircularProgress size={22} color="inherit" /> : t('login.register')}
          </Button>
        </Box>

        <Divider sx={{ my: 2.5, opacity: 0.35 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{ color: isDark ? 'rgba(226,232,240,0.72)' : 'rgba(15,23,42,0.66)' }}
          >
            Already have an account?{' '}
            <Typography
              component={Link}
              href="/login"
              variant="body2"
              sx={{
                color: '#93c5fd',
                cursor: 'pointer',
                fontWeight: 700,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('login.title')}
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
