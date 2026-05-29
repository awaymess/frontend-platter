'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Card, Button } from '@awaymess/ui';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from '@/i18n/useTranslations';
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
    <Box sx={{ mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t('nav.settings')}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          {t('settings.description')}
        </Typography>
      </Box>

      {/* Theme Settings */}

      <Card>
        <h6 style={{ fontWeight: 700, marginBottom: 1 }}>{t('theme.toggle')}</h6>
        <p style={{ marginBottom: 4, fontSize: 15, color: 'text.secondary' }}>
          Choose your preferred appearance mode
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {themeOptions.map((option) => {
            const isActive = mode === option.value;
            return (
              <Button
                key={option.value}
                variant="outlined"
                onClick={() => setMode(option.value)}
                color={isActive ? 'primary' : 'inherit'}
                startIcon={option.icon}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </Card>
    </Box>
  );
}
