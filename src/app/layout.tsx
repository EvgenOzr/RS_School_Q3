import { Inter } from 'next/font/google';
import { type Metadata } from 'next';
// import { NextIntlClientProvider } from 'next-intl';
import { ReduxProvider } from '../providers/ReduxProvider';
import ThemeProviderWrapper from '../Context/ThemeProviderWrapper';
import Navigation from '../components/Navigation/Navigation';
import { defaultLocale, locales, type Locale } from '../i18n/config';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Search App R&M',
  description: 'RIM search app',
  icons: {
    icon: [{ url: '/favicon.ico' }],
  },
  manifest: '/site.webmanifest',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale = defaultLocale },
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  const normalizedLocale = locales.includes(locale as Locale)
    ? locale
    : defaultLocale;

  // let messages;
  // try {
  //   messages = (
  //     await import(`../../public/locales/${normalizedLocale}/common.json`)
  //   ).default;
  // } catch (error) {
  //   console.error(`Failed to load messages for ${normalizedLocale}`, error);
  //   return (
  //     <html lang={defaultLocale}>
  //       <body className={inter.className}>
  //         <div style={{ padding: '2rem', textAlign: 'center' }}>
  //           <h1>Application Error</h1>
  //           <p>Failed to load translations. Please refresh the page.</p>
  //         </div>
  //       </body>
  //     </html>
  //   );
  // }

  return (
    <html lang={normalizedLocale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        {/* <NextIntlClientProvider
          locale={normalizedLocale}
          messages={messages}
          timeZone="UTC"
          now={new Date()}
        > */}
        <ReduxProvider>
          <ThemeProviderWrapper>
            <Navigation />
            {children}
          </ThemeProviderWrapper>
        </ReduxProvider>
        {/* </NextIntlClientProvider> */}
      </body>
    </html>
  );
}
