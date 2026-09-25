type LocaleMap = Record<string, string>;

export function buildHreflang(paths: LocaleMap, defaultLocale: string = 'en') {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const languages: Record<string, string> = {};

  for (const [locale, path] of Object.entries(paths)) {
    languages[locale] = `${baseUrl}${path}`;
  }
  languages['x-default'] = `${baseUrl}${paths[defaultLocale]}`;

  return languages;
}