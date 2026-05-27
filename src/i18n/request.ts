import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!locale || !routing.locales.includes(locale as 'th' | 'en')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      ...(await import(`@/locales/${locale}/common.json`)).default,
      auth: (await import(`@/locales/${locale}/auth.json`)).default,
      dashboard: (await import(`@/locales/${locale}/dashboard.json`)).default,
    },
  };
});
