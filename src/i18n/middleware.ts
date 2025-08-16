import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
