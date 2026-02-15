import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { I18n } from "../core/engine";
import type { LocaleMessages } from "../core/types";

export function createContextI18n<T extends LocaleMessages, L extends string>(
  engine: I18n<T, L>,
) {
  const Ctx = createContext<I18n<T, L> | null>(null);

  function Provider({ children }: { children: ReactNode }) {
    useSyncExternalStore(
      engine.subscribe,
      () => `${engine.currentLocale}-${engine.isLoading}`,
      () => `${engine.currentLocale}-${engine.isLoading}`,
    );

    return <Ctx.Provider value={engine}>{children}</Ctx.Provider>;
  }

  function useLocale() {
    const ctx = useContext(Ctx);
    if (!ctx) {
      throw new Error("useLocale must be used inside Provider");
    }

    return {
      t: ctx.t.bind(ctx),
      locale: ctx.currentLocale,
      setLocale: ctx.setLocale,
      isLoading: ctx.isLoading,
    };
  }

  return { Provider, useLocale };
}
