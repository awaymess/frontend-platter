'use client';

import { useLayoutEffect, useMemo, useRef, type ComponentProps } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Card, Button, Chip } from '@awaymess/ui';
import { Link } from '@/i18n/navigation';
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Receipt,
  PackageOpen,
  Truck,
} from 'lucide-react';
import { formatMoneyCompact } from '@/lib/format';
import { useThemeMode } from '@/hooks/useThemeMode';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';

// Mock Data
const stats = {
  available: 2450,
  pending: 124,
  totalRevenue: 1543000,
  netProfit: 452000,
  totalBaleCost: 500000,
  totalProductCost: 450000,
  totalExpenses: 25000,
  totalShipping: 12000,
  totalShippingRevenue: 14500,
  totalTiktokFee: 4500,
  totalRefunds: 2000,
};

const chartData = [
  { date: '21 พ.ค.', revenue: 15000, orders: 45 },
  { date: '22 พ.ค.', revenue: 18500, orders: 52 },
  { date: '23 พ.ค.', revenue: 12000, orders: 38 },
  { date: '24 พ.ค.', revenue: 22000, orders: 65 },
  { date: '25 พ.ค.', revenue: 25400, orders: 72 },
  { date: '26 พ.ค.', revenue: 19000, orders: 58 },
  { date: '27 พ.ค.', revenue: 28900, orders: 81 },
];

const statusBreakdown = [
  { category: 'พร้อมขาย', value: 2450 },
  { category: 'จอง', value: 45 },
  { category: 'ขายแล้ว', value: 890 },
];

const recentOrders = [
  { id: 'ORD-001', customerName: 'คุณสมชาย ใจดี', productId: 'SKU-1204', status: 'shipped' },
  { id: 'ORD-002', customerName: 'คุณสมหญิง งามตา', productId: 'SKU-5392', status: 'pending' },
  { id: 'ORD-003', customerName: 'คุณมานะ รักเรียน', productId: 'SKU-9821', status: 'shipped' },
  { id: 'ORD-004', customerName: 'คุณปิติ สุขใจ', productId: 'SKU-1123', status: 'pending' },
];

type QualityProduct = {
  id: string;
  sku: string;
  name?: string;
};

type QualityItem = {
  label: string;
  products: QualityProduct[];
  href: ComponentProps<typeof Link>['href'];
  color: string;
};

const inventoryQuality = {
  missingImage: [
    { id: '1', sku: 'SKU-001' },
    { id: '2', sku: 'SKU-002' },
  ],
  missingCost: [{ id: '3', sku: 'SKU-003' }],
  missingPrice: [{ id: '4', sku: 'SKU-004', name: 'เสื้อเชิ้ต' }],
  missingBale: [],
};

export default function DashboardPage() {
  const { mode } = useThemeMode();
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);

  const visibleStatusBreakdown = useMemo(
    () => statusBreakdown.filter((item) => item.value > 0),
    []
  );

  // Bar chart
  useLayoutEffect(() => {
    if (!barChartRef.current) return;
    const root = am5.Root.new(barChartRef.current);
    root.setThemes(
      mode === 'dark'
        ? [am5themes_Animated.new(root), am5themes_Dark.new(root)]
        : [am5themes_Animated.new(root)]
    );

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: root.verticalLayout,
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'date',
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
      })
    );
    xAxis.data.setAll(chartData);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'รายได้',
        xAxis,
        yAxis,
        valueYField: 'revenue',
        categoryXField: 'date',
        tooltip: am5.Tooltip.new(root, { labelText: '฿{valueY}' }),
      })
    );
    series.columns.template.setAll({
      cornerRadiusTL: 8,
      cornerRadiusTR: 8,
      strokeOpacity: 0,
      width: am5.percent(60),
    });
    series.columns.template.adapters.add('fill', () => {
      return am5.color(0x6366f1);
    });
    series.data.setAll(chartData);

    chart.appear(1000, 100);

    return () => root.dispose();
  }, [mode]);

  // Pie chart
  useLayoutEffect(() => {
    if (!pieChartRef.current) return;
    const root = am5.Root.new(pieChartRef.current);
    root.setThemes(
      mode === 'dark'
        ? [am5themes_Animated.new(root), am5themes_Dark.new(root)]
        : [am5themes_Animated.new(root)]
    );

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(50),
        radius: am5.percent(78),
        layout: root.verticalLayout,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
        tooltip: am5.Tooltip.new(root, { labelText: '{category}: {value}' }),
      })
    );
    series.slices.template.setAll({ strokeOpacity: 0, cornerRadius: 6 });
    series
      .get('colors')
      ?.set('colors', [am5.color(0x22c55e), am5.color(0xf59e0b), am5.color(0xef4444)]);
    series.data.setAll(
      visibleStatusBreakdown.length
        ? visibleStatusBreakdown
        : [{ category: 'ไม่มีข้อมูล', value: 1 }]
    );
    series.labels.template.setAll({ forceHidden: true });
    series.ticks.template.setAll({ forceHidden: true });
    series.appear(1000, 100);

    return () => root.dispose();
  }, [visibleStatusBreakdown, mode]);

  const statCards = [
    {
      name: 'สินค้าพร้อมขาย',
      value: stats.available,
      icon: Package,
      href: '/inventory',
      gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    },
    {
      name: 'ออเดอร์รอดำเนินการ',
      value: stats.pending,
      icon: ShoppingBag,
      href: '/orders',
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    },
    {
      name: 'เงินรับสุทธิ',
      value: formatMoneyCompact(stats.totalRevenue - stats.totalRefunds),
      icon: DollarSign,
      href: '/reports',
      gradient: 'linear-gradient(135deg, #a855f7, #6366f1)',
    },
    {
      name: 'กำไรสุทธิ',
      value: formatMoneyCompact(stats.netProfit),
      icon: TrendingUp,
      href: '/reports',
      gradient: 'linear-gradient(135deg, #22c55e, #10b981)',
    },
  ];

  const qualityItems: QualityItem[] = [
    {
      label: 'ไม่มีรูป',
      products: inventoryQuality.missingImage,
      href: '/inventory',
      color: '#ef4444',
    },
    {
      label: 'ไม่มีต้นทุน',
      products: inventoryQuality.missingCost,
      href: '/inventory',
      color: '#f59e0b',
    },
    {
      label: 'ไม่มีราคา',
      products: inventoryQuality.missingPrice,
      href: '/inventory',
      color: '#dc2626',
    },
    {
      label: 'ไม่ผูกกระสอบ',
      products: inventoryQuality.missingBale,
      href: '/inventory',
      color: '#6366f1',
    },
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          ภาพรวมร้านค้า
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          สรุปข้อมูลการขายและกำไร (ข้อมูลจำลอง)
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Box
              key={stat.name}
              component={Link}
              href={stat.href}
              sx={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
            >
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  height: '100%',
                  p: 2,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 'var(--shadow-md)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    background: stat.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  <Icon size={24} color="#fff" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.6, fontSize: 11 }}>
                    {stat.name}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Card>
            </Box>
          );
        })}
      </Box>

      {/* Charts Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2 }}>
        <Card sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            ยอดขาย 7 วันล่าสุด
          </Typography>
          <Box ref={barChartRef} sx={{ width: '100%', height: 280 }} />
        </Card>
        <Card sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            สัดส่วนสถานะสินค้า
          </Typography>
          <Box ref={pieChartRef} sx={{ width: '100%', height: 230 }} />
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}
          >
            {statusBreakdown.map((item) => (
              <Chip
                key={item.category}
                label={`${item.category}: ${item.value}`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 800 }}
              />
            ))}
          </Stack>
        </Card>
      </Box>

      {/* Bottom Row */}
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}
      >
        <Box component={Link} href="/expenses" sx={{ color: 'inherit', textDecoration: 'none' }}>
          <Card sx={{ height: '100%', p: 2, '&:hover': { bgcolor: 'action.hover' } }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
              <Receipt size={20} color="#f59e0b" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                รายจ่ายอื่นๆ
              </Typography>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b' }}>
              {formatMoneyCompact(stats.totalExpenses)}
            </Typography>
          </Card>
        </Box>
        <Box component={Link} href="/bales" sx={{ color: 'inherit', textDecoration: 'none' }}>
          <Card sx={{ height: '100%', p: 2, '&:hover': { bgcolor: 'action.hover' } }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
              <PackageOpen size={20} color="#ec4899" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                ต้นทุนสินค้าขายแล้ว
              </Typography>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#ec4899' }}>
              {formatMoneyCompact(stats.totalProductCost)}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.55 }}>
              ซื้อกระสอบรวม {formatMoneyCompact(stats.totalBaleCost)}
            </Typography>
          </Card>
        </Box>
        <Box component={Link} href="/reports" sx={{ color: 'inherit', textDecoration: 'none' }}>
          <Card sx={{ height: '100%', p: 2, '&:hover': { bgcolor: 'action.hover' } }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
              <DollarSign size={20} color="#ef4444" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Fee TikTok
              </Typography>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444' }}>
              {formatMoneyCompact(stats.totalTiktokFee)}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.55 }}>
              ค่าส่งรับ {formatMoneyCompact(stats.totalShippingRevenue)} / จ่าย{' '}
              {formatMoneyCompact(stats.totalShipping)}
            </Typography>
          </Card>
        </Box>
        <Box component={Link} href="/orders" sx={{ color: 'inherit', textDecoration: 'none' }}>
          <Card sx={{ height: '100%', p: 2, '&:hover': { bgcolor: 'action.hover' } }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
              <Truck size={20} color="#6366f1" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                ออเดอร์ล่าสุด
              </Typography>
            </Stack>
            <Stack spacing={1}>
              {recentOrders.slice(0, 4).map((o) => (
                <Stack
                  key={o.id}
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12 }}>
                      {o.customerName || o.id}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.5 }}>
                      {o.productId}
                    </Typography>
                  </Box>
                  <Chip
                    label={o.status === 'shipped' ? 'ส่งแล้ว' : 'รอ'}
                    size="small"
                    variant="outlined"
                    color={o.status === 'shipped' ? 'success' : 'warning'}
                  />
                </Stack>
              ))}
              {recentOrders.length === 0 && (
                <Typography variant="caption" sx={{ textAlign: 'center', py: 2, opacity: 0.5 }}>
                  ยังไม่มีออเดอร์
                </Typography>
              )}
            </Stack>
          </Card>
        </Box>
      </Box>

      <Card sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              คุณภาพข้อมูลสต็อก
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              แสดง 5 รายการล่าสุดที่ควรแก้ก่อนขายจริง
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/inventory"
            variant="outlined"
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
          >
            ไปคลังสินค้า
          </Button>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' },
            gap: 1.5,
          }}
        >
          {qualityItems.map((item) => (
            <Box
              key={item.label}
              component={Link}
              href={item.href}
              sx={{
                p: 1.75,
                borderRadius: '26px',
                border: `1px solid ${item.color}33`,
                bgcolor: `${item.color}10`,
                color: 'inherit',
                textDecoration: 'none',
                transition: 'transform 160ms ease, border-color 160ms ease',
                '&:hover': { transform: 'translateY(-2px)', borderColor: `${item.color}88` },
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {item.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: item.color }}>
                {item.products.length}
              </Typography>
              <Stack spacing={0.4} sx={{ mt: 1 }}>
                {item.products.slice(0, 5).map((product) => (
                  <Typography
                    key={product.id}
                    variant="caption"
                    sx={{ display: 'block', fontWeight: 700 }}
                  >
                    {product.sku || product.id}
                    {product.name ? ` • ${product.name}` : ''}
                  </Typography>
                ))}
                {item.products.length > 5 && (
                  <Typography variant="caption" sx={{ opacity: 0.55 }}>
                    +{item.products.length - 5} รายการ
                  </Typography>
                )}
                {item.products.length === 0 && (
                  <Typography variant="caption" sx={{ opacity: 0.55 }}>
                    ครบแล้ว
                  </Typography>
                )}
              </Stack>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}
