import { useSyncExternalStore } from "react";
import { I18n } from "../core/engine";
import type { LocaleMessages } from "../core/types";

export function createUseTranslation<T extends LocaleMessages>(
  engine: I18n<T>,
) {
  return function useTranslation() {
    useSyncExternalStore(engine.subscribe, () => engine.currentLocale);

    return {
      t: engine.t.bind(engine),
      locale: engine.currentLocale,
      setLocale: engine.setLocale,
    };
  };
}
