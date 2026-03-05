import type { Locale, LocaleMessages } from "./core/types";
import { I18n } from "./core/engine";
import { createUseTranslation } from "./react/createUseTranslation";
import { createContextI18n } from "./react/createContextI18n";

export function createI18n<
  const TLocale extends string,
  const TSupported extends readonly string[],
  const TMessages extends LocaleMessages,
>(config: {
  locale: TLocale;
  supportedLocales: TSupported;
  locales: Locale<TMessages>[];
  fallbackLocales?: TSupported[number][];
  persistKey?: string;
  loader?: (locale: TSupported[number]) => Promise<any>;
}) {
  // type AllowedLocales = TSupported[number];

  const engine = new I18n<TMessages, TSupported[number]>(config);
  engine.init();

  return {
    i18n: engine,
    useTranslation: createUseTranslation(engine),
    ...createContextI18n(engine),
  };
}
