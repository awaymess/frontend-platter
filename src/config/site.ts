export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Frontend Platter',
  description: 'A modern frontend boilerplate built with Next.js',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  },
  locale: {
    default: 'th' as const,
    supported: ['th', 'en'] as const,
  },
} as const;

export type SupportedLocale = (typeof siteConfig.locale.supported)[number];
