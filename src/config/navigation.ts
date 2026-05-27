import { LayoutDashboard, BarChart2, Table2, Settings, type LucideIcon } from 'lucide-react';

export interface NavItem {
  titleKey: string;
  href: string;
  icon: LucideIcon;
  children?: NavItem[];
}

export const mainNavItems: NavItem[] = [
  {
    titleKey: 'nav.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    titleKey: 'nav.charts',
    href: '/charts',
    icon: BarChart2,
  },
  {
    titleKey: 'nav.tables',
    href: '/tables',
    icon: Table2,
  },
  {
    titleKey: 'nav.settings',
    href: '/settings',
    icon: Settings,
  },
];
