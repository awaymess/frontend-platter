'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from '@/i18n/useTranslations';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSidebarOpen, toggleSidebarCollapsed } from '@/store/slices/uiSlice';
import { clearAuth } from '@/store/slices/authSlice';
import { mainNavItems } from '@/config/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import { Sun, Moon, LogOut, Menu, Monitor, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { IconButton } from '@awaymess/ui';

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 72;

const sidebarBackground = (mode: string) => (mode === 'dark' ? '#14141e' : '#ffffff');
const themeModes = [
  { value: 'light' as const, icon: Sun, labelKey: 'theme.light' },
  { value: 'dark' as const, icon: Moon, labelKey: 'theme.dark' },
  { value: 'system' as const, icon: Monitor, labelKey: 'theme.system' },
];

export function Sidebar() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sidebarOpen, sidebarCollapsed } = useAppSelector((state) => state.ui);
  const muiTheme = useMuiTheme();
  const { mode, resolvedMode, setMode } = useTheme();
  const isMobileLayout = useMediaQuery(muiTheme.breakpoints.down('md'));

  const currentWidth =
    sidebarCollapsed && !isMobileLayout ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  const handleClose = () => {
    if (isMobileLayout) {
      dispatch(setSidebarOpen(false));
    }
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    router.push('/login');
  };

  const isActive = (href: string) => {
    const cleanPath = pathname.replace(/^\/(th|en)/, '');
    return cleanPath === href || cleanPath.startsWith(href + '/');
  };

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        height: '100dvh',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: sidebarBackground(resolvedMode),
        backgroundColor: sidebarBackground(resolvedMode),
        borderRight: `1px solid ${resolvedMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
      }}
    >
      {/* Header: Hamburger + App name */}
      <Box
        sx={{
          px: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          height: 52,
          minHeight: 52,
          flexShrink: 0,
          borderBottom: `1px solid ${resolvedMode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
        }}
      >
        {/* Hamburger button — collapses on desktop, closes on mobile */}
        <Box
          onClick={() =>
            isMobileLayout ? dispatch(setSidebarOpen(false)) : dispatch(toggleSidebarCollapsed())
          }
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
            color: resolvedMode === 'dark' ? '#a1a1aa' : '#71717a',
            transition: 'background 0.15s, color 0.15s',
            mx: sidebarCollapsed && !isMobileLayout ? 'auto' : 0,
            '&:hover': {
              background: resolvedMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              color: resolvedMode === 'dark' ? '#fff' : '#000',
            },
          }}
        >
          {sidebarCollapsed && !isMobileLayout ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </Box>

        {(!sidebarCollapsed || isMobileLayout) && (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap' }}
            >
              {t('app.name')}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ opacity: 0.1 }} />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {mainNavItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.3 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={handleClose}
                sx={{
                  borderRadius: '12px',
                  py: 1,
                  px: sidebarCollapsed && !isMobileLayout ? 1 : 1.5,
                  justifyContent: sidebarCollapsed && !isMobileLayout ? 'center' : 'flex-start',
                  ...(active && {
                    background:
                      resolvedMode === 'dark' ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.15)',
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: sidebarCollapsed && !isMobileLayout ? 0 : 36,
                    justifyContent: 'center',
                  }}
                >
                  <Icon
                    size={20}
                    color={active ? '#6366f1' : resolvedMode === 'dark' ? '#a1a1aa' : '#71717a'}
                  />
                </ListItemIcon>
                {(!sidebarCollapsed || isMobileLayout) && (
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: active ? 700 : 500,
                          color: active ? '#6366f1' : 'inherit',
                        }}
                      >
                        {t(item.titleKey)}
                      </Typography>
                    }
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ opacity: 0.1 }} />

      {/* Bottom Controls */}
      <Box
        sx={{
          p: sidebarCollapsed && !isMobileLayout ? 1 : 2,
          background: sidebarBackground(resolvedMode),
        }}
      >
        {/* Theme Switcher */}
        {!sidebarCollapsed || isMobileLayout ? (
          <Box
            sx={{
              mb: 0.8,
              px: 0.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.6,
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                opacity: 0.7,
                lineHeight: 1,
              }}
            >
              {t('theme.toggle')}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 0.3,
              }}
            >
              {themeModes.map(({ value, icon: Icon, labelKey }) => {
                const isActive = mode === value;
                return (
                  <IconButton
                    key={value}
                    aria-label={t(labelKey)}
                    color={isActive ? 'secondary' : 'default'}
                    aria-pressed={isActive}
                    onClick={() => setMode(value)}
                    sx={{
                      border: `1px solid ${isActive ? 'rgba(99,102,241,0.45)' : 'transparent'}`,
                      background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={14} />
                  </IconButton>
                );
              })}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 0.35,
              mb: 0.8,
              justifyItems: 'center',
            }}
          >
            {themeModes.map(({ value, icon: Icon, labelKey }) => {
              const isActive = mode === value;
              return (
                <IconButton
                  key={value}
                  aria-label={t(labelKey)}
                  color={isActive ? 'secondary' : 'default'}
                  aria-pressed={isActive}
                  onClick={() => setMode(value)}
                  sx={{
                    border: `1px solid ${isActive ? 'rgba(99,102,241,0.45)' : 'transparent'}`,
                    background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={14} />
                </IconButton>
              );
            })}
          </Box>
        )}

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            py: 1,
            px: sidebarCollapsed && !isMobileLayout ? 1 : 1.5,
            justifyContent: sidebarCollapsed && !isMobileLayout ? 'center' : 'flex-start',
            color: '#ef4444',
            '&:hover': { background: 'rgba(239,68,68,0.1)' },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: sidebarCollapsed && !isMobileLayout ? 0 : 36,
              justifyContent: 'center',
            }}
          >
            <LogOut size={18} color="#ef4444" />
          </ListItemIcon>
          {(!sidebarCollapsed || isMobileLayout) && (
            <ListItemText
              primary={
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{t('logout.title')}</Typography>
              }
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Toggle */}
      {!sidebarOpen && (
        <Box
          onClick={() => dispatch(setSidebarOpen(true))}
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'fixed',
            top: 8,
            left: 8,
            zIndex: 1300,
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: resolvedMode === 'dark' ? 'rgba(30,30,40,0.75)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            color: resolvedMode === 'dark' ? '#a1a1aa' : '#71717a',
            transition: 'background 0.15s',
            '&:hover': {
              background: resolvedMode === 'dark' ? 'rgba(50,50,65,0.9)' : 'rgba(240,240,245,0.95)',
            },
          }}
        >
          <Menu size={18} />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={handleClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            border: 'none',
            boxShadow: 'var(--shadow-xl)',
            background: sidebarBackground(mode),
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Box
        component="nav"
        sx={{
          width: currentWidth,
          flexShrink: 0,
          transition: 'width 0.2s ease',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              width: currentWidth,
              transition: 'width 0.2s ease',
              border: 'none',
              overflow: 'hidden',
              background: sidebarBackground(mode),
            },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>
    </>
  );
}

export { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH };
