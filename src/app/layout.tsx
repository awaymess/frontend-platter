import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Sans_Thai } from 'next/font/google';
import { cookies } from 'next/headers';
import Script from 'next/script';
import '@/styles/globals.css';
import { AppProviders } from '@/providers/AppProviders';
import type { ThemeMode } from '@/types';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ['thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Frontend Platter',
    template: '%s | Frontend Platter',
  },
  description: 'A modern frontend boilerplate built with Next.js, TypeScript, and MUI',
  icons: {
    icon: '/file.svg',
    shortcut: '/file.svg',
    apple: '/file.svg',
  },
};

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

function getInitialThemeFromCookie(mode: string | undefined): ThemeMode {
  if (mode === 'light' || mode === 'dark' || mode === 'system') return mode;
  return 'system';
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialThemeMode = getInitialThemeFromCookie(cookieStore.get('theme-mode')?.value);
  const initialResolvedMode = initialThemeMode === 'dark' ? 'dark' : 'light';

  return (
    <html lang="th" className={initialResolvedMode} suppressHydrationWarning>
      <body className={`${ibmPlexSansThai.variable} ${ibmPlexSans.variable} antialiased`}>
        <Script id="recover-from-404-back" strategy="beforeInteractive">
          {`
            (function () {
              try {
                window.addEventListener('pageshow', function (event) {
                  var navEntries = performance.getEntriesByType('navigation');
                  var navType = navEntries && navEntries[0] ? navEntries[0].type : '';
                  var isBackForward = event.persisted || navType === 'back_forward';
                  if (!isBackForward) return;
                  window.location.reload();
                });
              } catch (e) {}
            })();
          `}
        </Script>
        <AppRouterCacheProvider>
          <AppProviders
            initialThemeMode={initialThemeMode}
            initialResolvedMode={initialResolvedMode}
          >
            {children}
          </AppProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
