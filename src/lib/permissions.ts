export const USER_ROLES = [
  {
    value: 'ADMIN',
    label: 'ADMIN',
    description: 'เจ้าของร้าน เห็นและแก้ไขได้ทุกหน้า รวมต้นทุน กำไร ตั้งค่า และผู้ใช้',
  },
  {
    value: 'MANAGER',
    label: 'MANAGER',
    description: 'ผู้จัดการร้าน ดูแลคลัง ออเดอร์ CF กระสอบ และคิวพิมพ์ แต่ไม่จัดการผู้ใช้/ตั้งค่า',
  },
  {
    value: 'SALES',
    label: 'SALES',
    description: 'แอดมินขาย/ไลฟ์ ดูแล CF และออเดอร์ ไม่เห็นบัญชี ต้นทุน และตั้งค่า',
  },
  {
    value: 'PACKER',
    label: 'PACKER',
    description: 'พนักงานแพ็กของ เห็นออเดอร์และคิวพิมพ์เท่านั้น',
  },
  {
    value: 'ACCOUNTANT',
    label: 'ACCOUNTANT',
    description: 'บัญชี เห็นรายงาน รายจ่าย Audit และ Dashboard แต่ไม่แก้คลังสินค้า',
  },
] as const;

export type UserRole = (typeof USER_ROLES)[number]['value'] | string;

export const ROLE_HOME: Record<string, string> = {
  ADMIN: '/',
  MANAGER: '/orders',
  SALES: '/cf',
  PACKER: '/orders',
  ACCOUNTANT: '/reports',
};

export const ROLE_ALLOWED_PATHS: Record<string, string[]> = {
  ADMIN: ['/'],
  MANAGER: ['/', '/inventory', '/orders', '/print-queue', '/cf', '/tiktok', '/bales', '/audit'],
  SALES: ['/orders', '/print-queue', '/cf'],
  PACKER: ['/orders', '/print-queue'],
  ACCOUNTANT: ['/', '/expenses', '/reports', '/audit'],
};

export function roleHome(role?: string | null) {
  return ROLE_HOME[role || ''] || '/orders';
}

export function canAccessPath(role: string | null | undefined, pathname: string) {
  if (role === 'ADMIN') return true;
  const allowed = ROLE_ALLOWED_PATHS[role || ''] || ROLE_ALLOWED_PATHS.PACKER;
  return allowed.some((path) => pathname === path || (path !== '/' && pathname.startsWith(path)));
}
