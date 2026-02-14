import type { DeepKeys, DeepValue, LocaleMessages, ParamsOf } from "./types";
import { LocaleStore } from "./store";
import { interpolate } from "./interpolate";
import { resolvePlural, type PluralForms } from "./plural";

export class I18n<T extends LocaleMessages> {
  private locale: string;
  private messages: Record<string, T>;
  private store = new LocaleStore();

  constructor(locale: string, messages: Record<string, T>) {
    this.locale = locale;
    this.messages = messages;
  }

  get currentLocale() {
    return this.locale;
  }

  setLocale = (locale: string) => {
    this.locale = locale;
    this.store.notify();
  };

  subscribe = this.store.subscribe;

  private getMessage<K extends DeepKeys<T>>(
    key: K,
  ): DeepValue<T, K> | undefined {
    return key
      .split(".")
      .reduce((o, k) => o?.[k], this.messages[this.locale]) as
      | DeepValue<T, K>
      | undefined;
  }

  t<K extends DeepKeys<T>>(
    key: K,
    ...args: ParamsOf<T, K> extends undefined ? [] : [params: ParamsOf<T, K>]
  ): string {
    const msg = this.getMessage(key);
    if (!msg) return key as string;

    if (typeof msg === "object" && msg !== null && "other" in msg) {
      const params = args[0] as Record<string, string | number> | undefined;

      const pluralTarget = params
        ? (Object.values(params).find((v) => typeof v === "number") ?? 0)
        : 0;

      const resolvedString = resolvePlural(
        this.locale,
        pluralTarget as number,
        msg as PluralForms,
      );

      return interpolate(resolvedString, params);
    }

    if (typeof msg === "string") {
      return interpolate(msg, args[0] as ParamsOf<T, K>);
    }

    return key as string;
  }
}
