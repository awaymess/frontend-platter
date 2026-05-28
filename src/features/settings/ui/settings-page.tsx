'use client';

import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from '@awaymess/ui';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@awaymess/ui';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { ThemeMode } from '@/types';

export default function SettingsPage() {
  const t = useTranslations();
  const { mode, setMode } = useTheme();

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: t('theme.light'), icon: <Sun size={20} /> },
    { value: 'dark', label: t('theme.dark'), icon: <Moon size={20} /> },
    { value: 'system', label: t('theme.system'), icon: <Monitor size={20} /> },
  ];

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, letterSpacing: '-0.5px' }}>
        {t('nav.settings')}
      </Typography>

      {/* Theme Settings */}
      <Card
        sx={{
          borderRadius: '20px',
          border: 'none',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          bgcolor: 'rgb(var(--color-bg-elevated))',
          mb: 3,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {t('theme.toggle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontSize: 15 }}>
            Choose your preferred appearance mode
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {themeOptions.map((option) => {
              const isActive = mode === option.value;
              return (
                <Button
                  key={option.value}
                  variant="outlined"
                  onClick={() => setMode(option.value)}
                  sx={{
                    borderRadius: '12px',
                    px: { xs: 2, sm: 3 },
                    py: 1.25,
                    textTransform: 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '15px',
                    minWidth: { xs: '100%', sm: 140 },
                    display: 'flex',
                    gap: 1.5,
                    color: isActive ? '#fff' : 'rgb(var(--color-text-primary))',
                    bgcolor: isActive ? '#007aff' : 'transparent',
                    borderColor: isActive ? '#007aff' : 'rgb(var(--color-border))',
                    '&:hover': {
                      bgcolor: isActive ? '#0062cc' : 'rgba(0,0,0,0.04)',
                      borderColor: isActive ? '#0062cc' : 'rgb(var(--color-text-secondary))',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>{option.icon}</Box>
                  {option.label}
                </Button>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
