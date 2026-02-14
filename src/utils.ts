import { Locale } from "./types/locale";

// Converts the array into a Record Dictionary seamlessly
export function createLocalesRecord<T extends Locale<any>>(
  locales: readonly T[],
): Record<T["code"], T> {
  return locales.reduce(
    (acc, locale) => {
      // @ts-expect-error - Dynamic assignment requires bypass
      acc[locale.code] = locale;
      return acc;
    },
    {} as Record<T["code"], T>,
  );
}
