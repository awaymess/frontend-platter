'use client';

import { useEffect, useState, createContext, useContext, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import {
  Box,
  Typography,
  Button,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@awaymess/ui';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import {
  BadgeCheck,
  Bell,
  CreditCard,
  ExternalLink,
  Info,
  PackagePlus,
  ShoppingBag,
  Trash2,
  Volume2,
  VolumeX,
  X,
  Smartphone,
} from 'lucide-react';
import { API_CONFIG, callApi } from '@/lib/api';
import { formatThaiDateTime } from '@/lib/format';

export interface Notification {
  id: string;
  eventKey?: string;
  title: string;
  message: string;
  detail: string;
  type: 'order' | 'checkout' | 'slip' | 'stock' | 'info';
  toastEnabled?: boolean;
  pushEnabled?: boolean;
  soundEnabled?: boolean;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

const NOTIFICATION_META: Record<
  Notification['type'],
  {
    label: string;
    color: string;
    bg: string;
    Icon: typeof Bell;
  }
> = {
  order: { label: 'ออเดอร์', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', Icon: ShoppingBag },
  checkout: { label: 'แจ้งโอน', color: '#059669', bg: 'rgba(5,150,105,0.1)', Icon: CreditCard },
  slip: { label: 'สลิป', color: '#16a34a', bg: 'rgba(22,163,74,0.1)', Icon: BadgeCheck },
  stock: { label: 'สต็อก', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', Icon: PackagePlus },
  info: { label: 'ระบบ', color: '#64748b', bg: 'rgba(100,116,139,0.12)', Icon: Info },
};

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAllRead: () => {},
  markRead: () => {},
  clearAll: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

function canUsePushNotifications() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Notification sound
function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.value = 0.15;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.stop(ctx.currentTime + 0.3);
    // Second beep
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 1100;
      osc2.type = 'sine';
      gain2.gain.value = 0.15;
      osc2.start();
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    }, 150);
  } catch {
    /* Audio not available */
  }
}

async function showNativeNotification(notification: Notification) {
  if (!canUsePushNotifications() || Notification.permission !== 'granted') return;
  const registration = await navigator.serviceWorker.register('/sw.js');
  const options: NotificationOptions & { renotify?: boolean } = {
    body: notification.message || notification.detail || '',
    tag: `${notification.type || 'info'}-${notification.id}`,
    renotify: true,
    data: { url: notification.actionUrl || '/' },
  };
  await registration.showNotification(notification.title || 'Shop Manager', options);
}

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | Notification['type']>('all');
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('notificationSound') !== 'off';
  });
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushStatus, setPushStatus] = useState('');
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isCheckoutPage = pathname.startsWith('/checkout');

  const showToastForNotification = useCallback((notification: Notification) => {
    const meta = NOTIFICATION_META[notification.type] || NOTIFICATION_META.info;
    const Icon = meta.Icon;
    toast.custom(
      (t) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            minWidth: 300,
            maxWidth: 380,
            padding: '12px 12px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.96)',
            border: '1px solid rgba(148,163,184,0.22)',
            boxShadow: '0 14px 42px rgba(15,23,42,0.18)',
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'all 160ms ease',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: meta.bg,
              color: meta.color,
              flexShrink: 0,
            }}
          >
            <Icon size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>
              {notification.title}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#475569',
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {notification.message}
            </div>
          </div>
          <Button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            aria-label="ปิดแจ้งเตือน"
            sx={{
              minWidth: 24,
              width: 24,
              height: 24,
              p: 0,
              border: 0,
              borderRadius: 8,
              background: 'rgba(15,23,42,0.06)',
              color: '#334155',
              cursor: 'pointer',
              lineHeight: '24px',
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            ×
          </Button>
        </div>
      ),
      { duration: 3000, position: 'top-right' }
    );
  }, []);

  // Load persisted notifications from DB
  useEffect(() => {
    callApi<Notification[]>('GET', '/notifications', undefined, { showError: false }).then(
      (result) => {
        if (!result.success || !result.data) {
          setNotifications([]);
          return;
        }
        setNotifications(
          result.data.map((n) => ({
            ...n,
            actionUrl: n.actionUrl || undefined,
            type: n.type || 'info',
          }))
        );
      }
    );
  }, []);

  useEffect(() => {
    localStorage.setItem('notificationSound', soundEnabled ? 'on' : 'off');
  }, [soundEnabled]);

  useEffect(() => {
    let cancelled = false;
    window.setTimeout(() => {
      const supported = canUsePushNotifications();
      if (cancelled) return;
      setPushSupported(supported);
      if (!supported) return;

      navigator.serviceWorker
        .getRegistration('/sw.js')
        .then((registration) => registration?.pushManager.getSubscription())
        .then((subscription) => {
          if (!cancelled) setPushEnabled(Boolean(subscription));
        })
        .catch(() => {
          if (!cancelled) setPushEnabled(false);
        });
    }, 0);

    return () => {
      cancelled = true;
    };
  }, []);

  const addNotification = useCallback(
    (noti: Notification, options?: { toast?: boolean }) => {
      setNotifications((prev) => [noti, ...prev.filter((n) => n.id !== noti.id)].slice(0, 100));
      if (soundEnabled && noti.soundEnabled !== false) playNotificationSound();
      if (options?.toast !== false && noti.toastEnabled !== false) showToastForNotification(noti);
      if (noti.pushEnabled !== false) {
        void showNativeNotification(noti).catch((e) => {
          console.warn('Native notification fallback failed:', e);
        });
      }
    },
    [showToastForNotification, soundEnabled]
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    void callApi('POST', '/notifications/read-all', undefined, {
      showError: false,
      showSuccess: false,
    });
  };
  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    void callApi('PATCH', `/notifications/${id}/read`, undefined, {
      showError: false,
      showSuccess: false,
    });
  };
  const clearAll = () => {
    setNotifications([]);
    void callApi('DELETE', '/notifications', undefined, { showError: false, showSuccess: false });
  };
  const unreadCount = notifications.filter((n) => !n.read).length;
  const visibleNotifications =
    filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  const handleOpenNotification = (notification: Notification) => {
    markRead(notification.id);
    if (notification.actionUrl) {
      setDrawerOpen(false);
      router.push(notification.actionUrl);
    }
  };

  const ensurePushSubscription = async () => {
    if (Notification.permission === 'denied') {
      throw new Error('Browser บล็อก Push ไว้ ต้องไปอนุญาตใน Site settings ก่อน');
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('ยังไม่ได้อนุญาต Push Notification');
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    const keyResponse = await callApi<{ publicKey: string }>('GET', '/push/public-key');
    if (!keyResponse.success || !keyResponse.data)
      throw new Error(keyResponse.message || 'Cannot load VAPID public key');
    const publicKey = urlBase64ToUint8Array(keyResponse.data.publicKey);
    let subscription = await registration.pushManager.getSubscription();
    const existingKey = subscription?.options.applicationServerKey
      ? new Uint8Array(subscription.options.applicationServerKey)
      : null;
    const sameKey =
      existingKey &&
      existingKey.length === publicKey.length &&
      existingKey.every((value, index) => value === publicKey[index]);

    if (subscription && !sameKey) {
      await callApi(
        'POST',
        '/push/unsubscribe',
        { endpoint: subscription.endpoint },
        { showError: false, showSuccess: false }
      );
      await subscription.unsubscribe();
      subscription = null;
    }

    subscription =
      subscription ||
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey as BufferSource,
      }));

    const subscribeResult = await callApi('POST', '/push/subscribe', {
      subscription: subscription.toJSON(),
      userAgent: navigator.userAgent,
    });
    if (!subscribeResult.success)
      throw new Error(subscribeResult.message || 'Cannot save push subscription');
    return subscription;
  };

  const enablePushNotifications = async () => {
    if (!pushSupported || pushBusy) return;
    setPushBusy(true);
    try {
      await ensurePushSubscription();
      setPushEnabled(true);
      setPushStatus('เปิด Push แล้ว พร้อมทดสอบได้');
    } catch (e) {
      console.error(e);
      toast.error('เปิด Push Notification ไม่สำเร็จ');
    } finally {
      setPushBusy(false);
    }
  };

  const testPushNotification = async () => {
    if (!pushEnabled || pushBusy) return;
    setPushBusy(true);
    try {
      let result = await callApi<{
        delivery?: { total: number; sent: number; failed: number; stale: number; errors: string[] };
      }>('POST', '/push/test', undefined, { showError: false });
      if (!result.success) {
        setPushStatus(result.message || 'ส่ง Push ทดสอบไม่สำเร็จ');
        toast.error(result.message || 'ส่ง Push ทดสอบไม่สำเร็จ');
        return;
      }
      let data = result.data;
      if (data?.delivery?.stale) {
        setPushStatus('subscription เก่าไม่ตรง VAPID key กำลังสมัครใหม่...');
        await ensurePushSubscription();
        result = await callApi<{
          delivery?: {
            total: number;
            sent: number;
            failed: number;
            stale: number;
            errors: string[];
          };
        }>('POST', '/push/test', undefined, { showError: false });
        if (!result.success) {
          setPushStatus(result.message || 'ส่ง Push ทดสอบไม่สำเร็จ');
          toast.error(result.message || 'ส่ง Push ทดสอบไม่สำเร็จ');
          return;
        }
        data = result.data;
      }
      const delivery = data?.delivery;
      if (!delivery || delivery.total === 0) {
        setPushStatus('ยังไม่มี subscription ใน backend ให้กดเปิด Push ใหม่');
        toast.error('ยังไม่มี subscription ใน backend');
      } else if (delivery.sent > 0) {
        setPushStatus(`ส่งจาก server สำเร็จ ${delivery.sent}/${delivery.total}`);
        toast.success(`ส่ง Push สำเร็จ ${delivery.sent}/${delivery.total}`);
      } else {
        setPushStatus(delivery.errors[0] || 'server ส่ง Push ไม่สำเร็จ');
        toast.error('server ส่ง Push ไม่สำเร็จ');
      }
    } catch (e) {
      console.error(e);
      setPushStatus(e instanceof Error ? e.message : 'ส่ง Push ทดสอบไม่สำเร็จ');
      toast.error('ส่ง Push ทดสอบไม่สำเร็จ');
    } finally {
      setPushBusy(false);
    }
  };

  const testLocalNotification = async () => {
    if (!pushSupported || pushBusy) return;
    setPushBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushStatus('Browser ยังไม่ได้อนุญาต notification');
        toast.error('ยังไม่ได้อนุญาต notification');
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      await registration.showNotification('ทดสอบ Notification เครื่องนี้', {
        body: 'ถ้าไม่เห็น popup นี้ ให้เช็ก macOS/Chrome notification settings',
        tag: 'local-notification-test',
      });
      setPushStatus('สั่งให้เครื่องนี้แสดง notification แล้ว');
      toast.success('สั่งให้เครื่องนี้แสดง notification แล้ว');
    } catch (e) {
      console.error(e);
      setPushStatus(e instanceof Error ? e.message : 'ทดสอบเครื่องนี้ไม่สำเร็จ');
      toast.error('ทดสอบเครื่องนี้ไม่สำเร็จ');
    } finally {
      setPushBusy(false);
    }
  };

  const disablePushNotifications = async () => {
    if (!pushSupported || pushBusy) return;
    setPushBusy(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw.js');
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        const result = await callApi('POST', '/push/unsubscribe', {
          endpoint: subscription.endpoint,
        });
        if (!result.success) return;
        await subscription.unsubscribe();
      }
      setPushEnabled(false);
    } catch (e) {
      console.error(e);
      toast.error('ปิด Push Notification ไม่สำเร็จ');
    } finally {
      setPushBusy(false);
    }
  };

  const scheduleRefresh = useCallback(() => {
    if (refreshTimer.current) return;
    refreshTimer.current = setTimeout(() => {
      refreshTimer.current = null;
      router.refresh();
    }, 1500);
  }, [router]);

  useEffect(() => {
    const socket: Socket = io(API_CONFIG.socketUrl);

    socket.on('notification_created', (data: Notification) => {
      if (isCheckoutPage) {
        scheduleRefresh();
        return;
      }
      addNotification({
        ...data,
        type: data.type || 'info',
        actionUrl: data.actionUrl || undefined,
      });
      scheduleRefresh();
    });

    socket.on('new_order', () => {
      if (isCheckoutPage) {
        scheduleRefresh();
        return;
      }
      scheduleRefresh();
    });

    socket.on('checkout', () => {
      if (isCheckoutPage) {
        scheduleRefresh();
        return;
      }
      scheduleRefresh();
    });

    socket.on('slip_verified', () => {
      if (isCheckoutPage) {
        scheduleRefresh();
        return;
      }
      scheduleRefresh();
    });

    socket.on('orders_changed', () => {
      scheduleRefresh();
    });

    socket.on('products_changed', () => {
      scheduleRefresh();
    });

    socket.on('order_approved', () => {
      // For customer-facing pages
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/checkout')) {
        window.location.reload();
      }
    });

    return () => {
      socket.disconnect();
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [addNotification, isCheckoutPage, scheduleRefresh]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllRead, markRead, clearAll }}
    >
      {children}
      <Toaster
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '14px',
            fontSize: 14,
            boxShadow: '0 12px 40px rgba(15,23,42,0.16)',
            border: '1px solid rgba(148,163,184,0.18)',
          },
        }}
      />

      {/* Floating Bell Button */}
      {!drawerOpen && !isCheckoutPage && (
        <Box
          sx={{
            position: 'fixed',
            top: { xs: 'calc(env(safe-area-inset-top, 0px) + 12px)', md: 16 },
            right: { xs: 'calc(env(safe-area-inset-right, 0px) + 12px)', md: 16 },
            zIndex: 1300,
            display: 'block',
          }}
        >
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: '14px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              '&:hover': { background: 'rgba(255,255,255,0.95)' },
            }}
          >
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <Bell size={20} color="#f59e0b" />
            </Badge>
          </IconButton>
        </Box>
      )}

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen && !isCheckoutPage}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 430 }, boxSizing: 'border-box' } }}
      >
        <Box sx={{ p: 2.25 }}>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                การแจ้งเตือน
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.58 }}>
                เก็บประวัติล่าสุด {notifications.length} รายการ
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => setSoundEnabled((v) => !v)}>
                {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
              </IconButton>
              <IconButton size="small" onClick={clearAll}>
                <Trash2 size={16} />
              </IconButton>
              <IconButton size="small" onClick={() => setDrawerOpen(false)}>
                <X size={18} />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {(
              [
                ['all', 'ทั้งหมด'],
                ['order', 'ออเดอร์'],
                ['checkout', 'แจ้งโอน'],
                ['slip', 'สลิป'],
                ['stock', 'สต็อก'],
              ] as const
            ).map(([value, label]) => (
              <Chip
                key={value}
                label={label}
                size="small"
                variant="outlined"
                clickable
                color={filter === value ? 'primary' : 'default'}
                onClick={() => setFilter(value)}
              />
            ))}
          </Stack>
          {pushSupported && (
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Button
                size="small"
                variant={pushEnabled ? 'outlined' : 'contained'}
                startIcon={<Smartphone size={15} />}
                onClick={pushEnabled ? disablePushNotifications : enablePushNotifications}
                disabled={pushBusy}
                sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800 }}
              >
                {pushEnabled ? 'ปิด Push บนอุปกรณ์นี้' : 'เปิด Push บนอุปกรณ์นี้'}
              </Button>
              {pushEnabled && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={testPushNotification}
                  disabled={pushBusy}
                  sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800 }}
                >
                  ทดสอบ Push
                </Button>
              )}
              <Button
                size="small"
                variant="outlined"
                onClick={testLocalNotification}
                disabled={pushBusy}
                sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800 }}
              >
                ทดสอบเครื่องนี้
              </Button>
            </Stack>
          )}
          {pushStatus && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.62 }}>
              {pushStatus}
            </Typography>
          )}
        </Box>
        <Divider />
        <Box
          sx={{
            px: 2,
            py: 1.25,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.62 }}>
            ยังไม่ได้อ่าน {unreadCount} รายการ
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Button size="small" onClick={markAllRead}>
              อ่านทั้งหมด
            </Button>
          </Stack>
        </Box>
        <Divider />
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {visibleNotifications.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
              <Typography variant="body2">ไม่มีการแจ้งเตือน</Typography>
            </Box>
          )}
          {visibleNotifications.map((n) => {
            const meta = NOTIFICATION_META[n.type];
            const Icon = meta.Icon;
            return (
              <ListItem
                key={n.id}
                onClick={() => handleOpenNotification(n)}
                sx={{
                  cursor: n.actionUrl ? 'pointer' : 'default',
                  alignItems: 'flex-start',
                  gap: 1.25,
                  px: 2,
                  py: 1.5,
                  background: n.read ? 'transparent' : 'rgba(99,102,241,0.05)',
                  borderLeft: n.read ? '3px solid transparent' : `3px solid ${meta.color}`,
                  '&:hover': { background: 'rgba(99,102,241,0.08)' },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: meta.bg,
                    color: meta.color,
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  <Icon size={18} />
                </Box>
                <ListItemText
                  primary={
                    <Stack
                      direction="row"
                      sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: n.read ? 600 : 800 }}>
                          {n.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ display: 'block', color: meta.color, fontWeight: 700 }}
                        >
                          {n.message}
                        </Typography>
                      </Box>
                      {n.actionUrl && (
                        <ExternalLink size={14} style={{ opacity: 0.4, flexShrink: 0 }} />
                      )}
                    </Stack>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        {n.detail}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.5 }}>
                        {formatThaiDateTime(n.createdAt)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </NotificationContext.Provider>
  );
}
