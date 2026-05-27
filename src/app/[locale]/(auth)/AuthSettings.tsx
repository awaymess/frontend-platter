'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  DarkMode,
  LightMode,
  SettingsBrightness,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { IconButton } from '@awaymess/ui';
import { useTheme } from '@/hooks/useTheme';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function AuthSettings() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { mode, isDark, setMode } = useTheme();

  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(null);
  const [langMenuAnchor, setLangMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setLangMenuAnchor(null);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 24,
        right: 24,
        display: 'flex',
        gap: 1,
        zIndex: 10,
      }}
    >
      {/* Theme Menu */}
      <IconButton
        onClick={(e) => setThemeMenuAnchor(e.currentTarget)}
        size="small"
        sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
      >
        {mode === 'system' ? (
          <SettingsBrightness sx={{ fontSize: 20 }} />
        ) : isDark ? (
          <LightMode sx={{ fontSize: 20 }} />
        ) : (
          <DarkMode sx={{ fontSize: 20 }} />
        )}
      </IconButton>
      <Menu
        anchorEl={themeMenuAnchor}
        open={Boolean(themeMenuAnchor)}
        onClose={() => setThemeMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setMode('light');
            setThemeMenuAnchor(null);
          }}
          selected={mode === 'light'}
        >
          <LightMode sx={{ fontSize: 18, mr: 1.5 }} />
          {t('theme.light')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMode('dark');
            setThemeMenuAnchor(null);
          }}
          selected={mode === 'dark'}
        >
          <DarkMode sx={{ fontSize: 18, mr: 1.5 }} />
          {t('theme.dark')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMode('system');
            setThemeMenuAnchor(null);
          }}
          selected={mode === 'system'}
        >
          <SettingsBrightness sx={{ fontSize: 18, mr: 1.5 }} />
          {t('theme.system')}
        </MenuItem>
      </Menu>

      {/* Language Switcher */}
      <IconButton
        onClick={(e) => setLangMenuAnchor(e.currentTarget)}
        size="small"
        sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
      >
        <LanguageIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Menu
        anchorEl={langMenuAnchor}
        open={Boolean(langMenuAnchor)}
        onClose={() => setLangMenuAnchor(null)}
      >
        {routing.locales.map((loc) => (
          <MenuItem key={loc} onClick={() => handleLanguageChange(loc)} selected={loc === locale}>
            {t(`language.${loc}`)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
