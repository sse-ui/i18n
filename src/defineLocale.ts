import { defu } from "defu";
import type { Locale, Direction } from "./types/locale";
import type { DeepPartial } from "./types/utils";

interface DefineLocaleOptions<M = string> {
  name: string;
  code: string;
  dir?: Direction;
  messages: M;
}

export function extendLocale<M, C extends string = string>(
  locale: Locale<M> & { code: C },
  options: Partial<DefineLocaleOptions<DeepPartial<M>>>,
): Locale<M> & { code: C } {
  return defu<Locale<M>, [DefineLocaleOptions<M>]>(
    options,
    locale,
  ) as unknown as Locale<M> & { code: C };
}

export function createLocaleDefiner<M>() {
  return function <C extends string>(
    options: Omit<DefineLocaleOptions<M>, "code"> & { code: C },
  ): Locale<M> & { code: C } {
    return defu(options, { dir: "ltr" }) as unknown as Locale<M> & { code: C };
  };
}
