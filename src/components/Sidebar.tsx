'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Switch,
  Stack,
} from '@awaymess/ui';
import {
  Home,
  Package,
  ShoppingBag,
  FileText,
  Settings,
  LogOut,
  Menu,
  Sun,
  Moon,
  Users,
  History,
  MessageCircle,
  Store,
  Printer,
} from 'lucide-react';
import { logoutAction } from '@/lib/auth';
import { USER_ROLES } from '@/lib/permissions';
import { useThemeMode } from '@/hooks/useThemeMode';

const DRAWER_WIDTH = 260;
const sidebarBackground = (mode: string) => (mode === 'dark' ? '#14141e' : '#ffffff');

const allLinks = [
  { name: 'แดชบอร์ด', href: '/', icon: Home, roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT'] },
  { name: 'คลังสินค้า', href: '/inventory', icon: Package, roles: ['ADMIN', 'MANAGER'] },
  {
    name: 'ออเดอร์',
    href: '/orders',
    icon: ShoppingBag,
    roles: ['ADMIN', 'MANAGER', 'SALES', 'PACKER'],
  },
  {
    name: 'คิวพิมพ์',
    href: '/print-queue',
    icon: Printer,
    roles: ['ADMIN', 'MANAGER', 'SALES', 'PACKER'],
  },
  { name: 'LINE CF', href: '/cf', icon: MessageCircle, roles: ['ADMIN', 'MANAGER', 'SALES'] },
  { name: 'TikTok', href: '/tiktok', icon: Store, roles: ['ADMIN', 'MANAGER'] },
  { name: 'กระสอบ', href: '/bales', icon: Package, roles: ['ADMIN', 'MANAGER'] },
  { name: 'รายจ่าย', href: '/expenses', icon: ShoppingBag, roles: ['ADMIN', 'ACCOUNTANT'] },
  { name: 'รายงาน', href: '/reports', icon: FileText, roles: ['ADMIN', 'ACCOUNTANT'] },
  { name: 'ผู้ใช้งาน', href: '/users', icon: Users, roles: ['ADMIN'] },
  { name: 'Audit', href: '/audit', icon: History, roles: ['ADMIN', 'MANAGER', 'ACCOUNTANT'] },
  { name: 'ตั้งค่า', href: '/settings', icon: Settings, roles: ['ADMIN'] },
];

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, toggleTheme } = useThemeMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = allLinks.filter((l) => l.roles.includes(role));

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
    router.refresh();
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        minHeight: '100dvh',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: sidebarBackground(mode),
        backgroundColor: sidebarBackground(mode),
        borderRight: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
      }}
    >
      {/* Logo Area */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            position: 'relative',
            width: 44,
            height: 44,
            borderRadius: '14px',
            overflow: 'hidden',
            flexShrink: 0,
            border: '1px solid rgba(148,163,184,0.2)',
            background: '#fff',
          }}
        >
          <Image
            src="/riri-logo.png"
            alt="RiRi Clothing Store"
            fill
            sizes="44px"
            style={{ objectFit: 'cover' }}
          />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            RiRi Clothing
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.5, fontSize: 11 }}>
            {USER_ROLES.find((item) => item.value === role)?.label || role || 'พนักงาน'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ opacity: 0.1 }} />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {links.map((link) => {
          const isActive =
            pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <ListItem key={link.href} disablePadding sx={{ mb: 0.3 }}>
              <ListItemButton
                component={Link}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: '12px',
                  py: 1,
                  px: 1.5,
                  ...(isActive && {
                    background: mode === 'dark' ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.15)',
                  }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon
                    size={20}
                    style={{
                      color: isActive ? '#6366f1' : mode === 'dark' ? '#a1a1aa' : '#71717a',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#6366f1' : 'inherit',
                      }}
                    >
                      {link.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ opacity: 0.1 }} />

      {/* Bottom Controls */}
      <Box
        sx={{ p: 2, background: sidebarBackground(mode), backgroundColor: sidebarBackground(mode) }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {mode === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            <Typography variant="caption">{mode === 'dark' ? 'มืด' : 'สว่าง'}</Typography>
          </Stack>
          <Switch size="medium" checked={mode === 'dark'} onChange={toggleTheme} />
        </Stack>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            py: 1,
            color: '#ef4444',
            '&:hover': { background: 'rgba(239,68,68,0.1)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogOut size={18} color="#ef4444" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>ออกจากระบบ</Typography>}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Toggle */}
      {!mobileOpen && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: 1300,
            background: mode === 'dark' ? 'rgba(30,30,40,0.8)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Menu size={22} />
        </IconButton>
      )}
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            display: 'flex',
            height: '100dvh',
            minHeight: '100dvh',
            background: sidebarBackground(mode),
            backgroundColor: sidebarBackground(mode),
            backgroundImage: 'none',
            overflow: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            position: 'relative',
            display: 'flex',
            height: '100vh',
            minHeight: '100vh',
            background: sidebarBackground(mode),
            backgroundColor: sidebarBackground(mode),
            backgroundImage: 'none',
            overflow: 'hidden',
          },
          width: DRAWER_WIDTH,
          flexShrink: 0,
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
