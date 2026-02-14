import type { LocaleMessages } from "./core/types";
import { I18n } from "./core/engine";
import { createUseTranslation } from "./react/createUseTranslation";
import { createContextI18n } from "./react/createContextI18n";

export function createI18n<L extends string, T extends LocaleMessages>(
  locale: string,
  messages: Record<L, T>,
) {
  // Cast the inner message payload so the engine constructor stays happy
  const engine = new I18n<T>(locale, messages as unknown as Record<string, T>);

  return {
    i18n: engine,
    useTranslation: createUseTranslation(engine),
    ...createContextI18n(engine),
  };
}
