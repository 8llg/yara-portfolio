import type { Locale, T, YearMonth } from '../content/types';

const STORAGE_KEY = 'yara.locale';

let current: Locale = 'en';

export function getLocale(): Locale {
  return current;
}

export function setLocale(locale: Locale): void {
  current = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    return;
  }
}

export function initialLocale(): Locale {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (fromUrl === 'ar' || fromUrl === 'en') return fromUrl;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ar' || stored === 'en') return stored;
  } catch {
    return 'en';
  }
  return 'en';
}

export function t(value: T): string {
  return value[current];
}

export function other(locale: Locale): Locale {
  return locale === 'en' ? 'ar' : 'en';
}

const intlLocale: Record<Locale, string> = {
  en: 'en-GB',
  ar: 'ar-SA-u-ca-gregory-nu-latn',
};

export function monthsBetween(start: YearMonth, end: YearMonth): number {
  const [sy, sm] = start.split('-').map(Number) as [number, number];
  const [ey, em] = end.split('-').map(Number) as [number, number];
  return (ey - sy) * 12 + (em - sm);
}

const now = new Date();
export const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}` as YearMonth;

export function formatMonth(value: YearMonth): string {
  const [year, month] = value.split('-').map(Number) as [number, number];
  return new Intl.DateTimeFormat(intlLocale[current], { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

export function formatSpan(start: YearMonth, end: YearMonth | null): string {
  const endLabel = end ? formatMonth(end) : current === 'ar' ? 'الآن' : 'Present';
  return `${formatMonth(start)} – ${endLabel}`;
}

export function formatDuration(start: YearMonth, end: YearMonth | null): string {
  const total = monthsBetween(start, end ?? today) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  if (current === 'ar') {
    const parts: string[] = [];
    if (years) parts.push(arabicCount(years, ['سنة', 'سنتان', 'سنوات', 'سنة']));
    if (months) parts.push(arabicCount(months, ['شهر', 'شهران', 'أشهر', 'شهرًا']));
    return parts.join(' و');
  }
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years === 1 ? '' : 's'}`);
  if (months) parts.push(`${months} mo${months === 1 ? '' : 's'}`);
  return parts.join(' ');
}

function arabicCount(n: number, [one, two, few, many]: [string, string, string, string]): string {
  if (n === 1) return one;
  if (n === 2) return two;
  if (n >= 3 && n <= 10) return `${n} ${few}`;
  return `${n} ${many}`;
}
