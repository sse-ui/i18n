import { useSyncExternalStore } from "react";
import { I18n } from "../core/engine";
import type { LocaleMessages } from "../core/types";

export function createUseTranslation<
  T extends LocaleMessages,
  L extends string,
>(engine: I18n<T, L>) {
  return function useTranslation() {
    useSyncExternalStore(
      engine.subscribe,
      () => `${engine.currentLocale}-${engine.isLoading}`,
    );

    return {
      t: engine.t.bind(engine),
      locale: engine.currentLocale,
      setLocale: engine.setLocale,
      isLoading: engine.isLoading,
    };
  };
}
