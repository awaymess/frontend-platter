'use client';

import { useTranslations, useLocale } from 'next-intl';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { Globe, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [langMenuAnchor, setLangMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setLangMenuAnchor(null);
  };

  const handleLogout = async () => {
    setUserMenuAnchor(null);
    await logout();
  };

  const userInitial = user?.firstName?.[0]?.toUpperCase() || 'U';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgb(var(--color-bg-primary))',
        color: 'rgb(var(--color-text-primary))',
        border: '0px solid rgb(var(--color-border))',
      }}
    >
      <Toolbar
        sx={{
          gap: 1,
          px: 2,
          minHeight: '51px !important',
          height: 51,
          border: '0px solid rgb(var(--color-border))',
        }}
      >
        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Language Switcher */}
          <IconButton
            onClick={(e) => setLangMenuAnchor(e.currentTarget)}
            size="small"
            id="language-switcher-btn"
            sx={{
              color: 'rgb(var(--color-text-secondary))',
              borderRadius: '10px',
              width: 38,
              height: 38,
              '&:hover': { bgcolor: 'rgb(var(--color-bg-elevated))' },
            }}
          >
            <Globe size={20} />
          </IconButton>
          <Menu
            anchorEl={langMenuAnchor}
            open={Boolean(langMenuAnchor)}
            onClose={() => setLangMenuAnchor(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  mt: 1,
                  minWidth: 130,
                  borderRadius: '12px',
                  border: '1px solid rgb(var(--color-border))',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  overflow: 'visible',
                },
              },
            }}
          >
            {routing.locales.map((loc) => (
              <MenuItem
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                selected={loc === locale}
                sx={{ borderRadius: '8px', mx: 0.5, my: 0.25, fontSize: 14 }}
              >
                {t(`language.${loc}`)}
              </MenuItem>
            ))}
          </Menu>

          {/* Divider */}
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1, opacity: 0.15 }} />

          {/* User Avatar Button */}
          <IconButton
            onClick={(e) => setUserMenuAnchor(e.currentTarget)}
            size="small"
            id="user-menu-btn"
            sx={{ p: 0.25 }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                fontSize: '0.875rem',
                fontWeight: 700,
                bgcolor: 'rgba(99,102,241,0.15)',
                color: '#6366f1',
                border: '1.5px solid rgba(99,102,241,0.3)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                '&:hover': {
                  borderColor: '#6366f1',
                  boxShadow: '0 0 0 3px rgba(99,102,241,0.15)',
                },
              }}
            >
              {userInitial}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: '14px',
                  border: '1px solid rgb(var(--color-border))',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                },
              },
            }}
          >
            {/* User info header */}
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgb(var(--color-text-secondary))', display: 'block' }}
              >
                {user?.email || ''}
              </Typography>
            </Box>
            <Divider sx={{ opacity: 0.12 }} />
            <Box sx={{ p: 0.5 }}>
              <MenuItem
                onClick={() => setUserMenuAnchor(null)}
                sx={{ borderRadius: '8px', py: 1, px: 1.5, gap: 1.5, fontSize: 14 }}
              >
                <Settings size={16} />
                {t('nav.settings')}
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  borderRadius: '8px',
                  py: 1,
                  px: 1.5,
                  gap: 1.5,
                  fontSize: 14,
                  color: '#ef4444',
                }}
              >
                <LogOut size={16} />
                {t('auth.logout.title')}
              </MenuItem>
            </Box>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
