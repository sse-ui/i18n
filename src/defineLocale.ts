import type { Locale, LocaleMessages, Direction } from "./core/types";

export function defineLocale<const M extends LocaleMessages>(config: {
  name: string;
  code: string;
  dir?: Direction;
  messages: M;
}): Locale<M> {
  return {
    dir: "ltr",
    ...config,
  };
}
