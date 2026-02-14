import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { Locale, Direction } from "./types/locale";
import { createLocalesRecord } from "./utils";

// Define what the hook will return
export interface LocaleContextState<M, Codes extends string> {
  currentLocale: Locale<M>;
  availableLocales: Codes[];
  setLocale: (code: Codes) => void;
  dir: Direction;
  messages: M;
}

// The Factory Function
export function createLocaleSystem<
  M,
  Dictionary extends Record<string, Locale<M>>,
>(localesRecord: Dictionary) {
  type AllowedCodes = Extract<keyof Dictionary, string>;

  const Context = createContext<
    LocaleContextState<M, AllowedCodes> | undefined
  >(undefined);

  const LocaleProvider: React.FC<{
    defaultLanguage: AllowedCodes;
    children: React.ReactNode;
  }> = ({ defaultLanguage, children }) => {
    const [activeCode, setActiveCode] = useState<string>(defaultLanguage);

    const currentLocale = localesRecord[activeCode];
    const availableLocales = Object.keys(localesRecord) as AllowedCodes[];

    const setLocale = useCallback(
      (code: AllowedCodes) => {
        if (code in localesRecord) {
          setActiveCode(code);
        } else {
          console.warn(`[LocaleSystem] Unsupported locale code: ${code}`);
        }
      },
      [], // localesRecord is assumed stable outside the render cycle
    );

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo<LocaleContextState<M, AllowedCodes>>(
      () => ({
        currentLocale,
        availableLocales,
        setLocale,
        dir: currentLocale.dir,
        messages: currentLocale.messages,
      }),
      [currentLocale, availableLocales, setLocale],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  // The custom hook bound to your specific Message type
  const useLocale = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(
        "useLocale must be used within its corresponding LocaleProvider",
      );
    }
    return context;
  };

  return { LocaleProvider, useLocale };
}
