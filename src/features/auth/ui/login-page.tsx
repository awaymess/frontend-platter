'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from '@/i18n/useTranslations';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ShieldRounded,
  BoltRounded,
  InsightsRounded,
} from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import { Button, TextField, IconButton, Alert, Checkbox } from '@awaymess/ui';
import { CircularProgress } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAuth } from '@/hooks/useAuth';
import { Link, useRouter } from '@/i18n/navigation';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();
  const { resolvedMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const isDark = resolvedMode === 'dark';

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().min(1, t('errors.invalidEmail')).email(t('errors.invalidEmail')),
        password: z
          .string()
          .min(1, t('errors.passwordRequired'))
          .min(6, t('errors.passwordMinLength', { min: 6 })),
      }),
    [t]
  );

  const highlights = [
    { icon: ShieldRounded, label: t('nav.dashboard') },
    { icon: InsightsRounded, label: t('nav.charts') },
    { icon: BoltRounded, label: t('nav.tables') },
  ];

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

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(t('login.title'));
      router.push('/dashboard');
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1020, mx: 'auto', px: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          borderRadius: { xs: '18px', md: '24px' },
          border: isDark ? '1px solid rgba(99,102,241,0.14)' : '1px solid rgba(99,102,241,0.16)',
          bgcolor: isDark ? '#0c1428' : '#ffffff',
          boxShadow: isDark
            ? '0 18px 48px rgba(2, 6, 23, 0.45)'
            : '0 20px 46px rgba(15, 23, 42, 0.14)',
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'relative',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 560,
              p: 4.5,
              borderRight: isDark
                ? '1px solid rgba(99,102,241,0.14)'
                : '1px solid rgba(99,102,241,0.12)',
              background: isDark
                ? 'radial-gradient(circle at 72% 20%, rgba(99,102,241,0.2), transparent 38%), linear-gradient(160deg, #0f1831 0%, #0b1328 100%)'
                : 'radial-gradient(circle at 72% 20%, rgba(99,102,241,0.16), transparent 38%), linear-gradient(160deg, #eef2ff 0%, #e2e8f0 100%)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 40,
                right: 16,
                width: 176,
                height: 176,
                borderRadius: '999px',
                background: isDark ? 'rgba(99,102,241,0.22)' : 'rgba(99,102,241,0.18)',
                filter: 'blur(6px)',
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: 62,
                  height: 62,
                  borderRadius: '16px',
                  background: isDark
                    ? 'linear-gradient(145deg, rgb(var(--color-accent)), rgb(var(--color-accent-hover)))'
                    : 'linear-gradient(145deg, #1e3a8a, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  mb: 2.5,
                }}
              >
                FP
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 1.5,
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
              >
                {t('app.name')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: 330,
                  color: isDark ? 'rgba(226,232,240,0.7)' : 'rgba(15,23,42,0.68)',
                }}
              >
                {t('login.subtitle')}
              </Typography>
            </Box>

            <Box sx={{ position: 'relative', zIndex: 1, display: 'grid', gap: 1 }}>
              {highlights.map(({ icon: Icon, label }) => (
                <Box
                  key={label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    py: 1,
                    px: 1.2,
                    borderRadius: '12px',
                    background: isDark ? 'rgba(30,41,59,0.64)' : 'rgba(255,255,255,0.68)',
                    border: isDark
                      ? '1px solid rgba(99,102,241,0.2)'
                      : '1px solid rgba(99,102,241,0.16)',
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDark ? '#818cf8' : '#4f46e5',
                      background: isDark ? 'rgba(99,102,241,0.22)' : 'rgba(99,102,241,0.14)',
                      flexShrink: 0,
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 600, color: isDark ? '#e2e8f0' : '#1e293b' }}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              p: { xs: 3, sm: 4, md: 4.5 },
              minHeight: { md: 560 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: isDark
                ? 'linear-gradient(180deg, rgba(15,23,42,0.86) 0%, rgba(15,23,42,0.7) 100%)'
                : 'linear-gradient(180deg, rgba(248,250,252,0.96) 0%, rgba(241,245,249,0.96) 100%)',
            }}
          >
            <Box
              sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 3 }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  background: isDark
                    ? 'linear-gradient(145deg, rgb(var(--color-accent)), rgb(var(--color-accent-hover)))'
                    : 'linear-gradient(145deg, #1e3a8a, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                FP
              </Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{t('app.name')}</Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 1,
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
            >
              {t('login.title')}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 3, color: isDark ? 'rgba(226,232,240,0.7)' : 'rgba(15,23,42,0.62)' }}
            >
              {t('login.subtitle')}
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
              onClick={handleGoogleLogin}
              disabled={isLoading}
              sx={{
                py: 1.15,
                borderRadius: '12px',
                fontWeight: 700,
                mb: 2,
                borderColor: isDark ? 'rgba(148,163,184,0.34)' : 'rgba(100,116,139,0.36)',
                color: isDark ? '#e2e8f0' : '#1e293b',
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
                '&:hover': {
                  borderColor: isDark ? 'rgba(148,163,184,0.52)' : 'rgba(100,116,139,0.52)',
                },
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
                sx={{
                  mb: 2,
                  '& .MuiInputBase-root': {
                    borderRadius: '14px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.92)',
                  },
                }}
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
                sx={{
                  mb: 1.25,
                  '& .MuiInputBase-root': {
                    borderRadius: '14px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.92)',
                  },
                }}
                id="login-password"
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 0.8,
                  mb: 2.5,
                }}
              >
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={<Typography variant="body2">{t('login.rememberMe')}</Typography>}
                  sx={{ m: 0 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#93c5fd',
                    cursor: 'pointer',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {t('login.forgotPassword')}
                </Typography>
              </Box>

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
                  background: 'linear-gradient(145deg, #2563eb, #3b82f6)',
                  boxShadow: '0 12px 24px rgba(37,99,235,0.34)',
                  '&:hover': {
                    background: 'linear-gradient(145deg, #1d4ed8, #2563eb)',
                  },
                }}
                id="login-submit-btn"
              >
                {isLoading ? <CircularProgress size={22} color="inherit" /> : t('login.submit')}
              </Button>
            </Box>

            <Divider
              sx={{
                my: 2.5,
                opacity: 0.5,
                borderColor: isDark ? 'rgba(148,163,184,0.3)' : 'rgba(148,163,184,0.45)',
              }}
            />

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: isDark ? 'rgba(226,232,240,0.72)' : 'rgba(15,23,42,0.66)' }}
              >
                {t('login.noAccount')}{' '}
                <Typography
                  component={Link}
                  href="/register"
                  variant="body2"
                  sx={{
                    color: '#93c5fd',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {t('login.register')}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
