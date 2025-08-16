import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import type { AbstractIntlMessages } from 'next-intl';

export const locales = ['en', 'ru'] as const;
export const defaultLocale = 'en';
export type Locale = (typeof locales)[number];

export function isValidLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' && (locales as readonly string[]).includes(value)
  );
}

export default getRequestConfig(async ({ locale }: { locale?: string }) => {
  if (!locale || !isValidLocale(locale)) {
    notFound();
  }

  let messages: AbstractIntlMessages;
  try {
    messages = (await import(`../../public/locales/${locale}/common.json`))
      .default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}`, error);
    notFound();
  }

  return {
    locale,
    messages,
    now: new Date(),
    timeZone: 'UTC',
  };
});
