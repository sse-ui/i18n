import type {
  DeepKeys,
  DeepValue,
  LocaleMessages,
  ParamsOf,
  PluralForms,
} from "./types";
import { LocaleStore } from "./store";
import { interpolate } from "./interpolate";
import { resolvePlural } from "./plural";

interface I18nConfig<T, L extends string> {
  locale: L;
  supportedLocales: readonly L[];
  messages: Record<string, any>;
  fallbackLocales?: L[];
  persistKey?: string;
  loader?: (locale: string) => Promise<any>;
}

export class I18n<T extends LocaleMessages, L extends string = string> {
  private locale: L;
  private messages: Record<string, any>;
  private store = new LocaleStore();
  private config: I18nConfig<T, L>;
  public isLoading = false;

  constructor(config: I18nConfig<T, L>) {
    this.config = config;
    this.messages = config.messages || {};

    const savedLocale =
      typeof window !== "undefined" && config.persistKey
        ? (localStorage.getItem(config.persistKey) as L | null)
        : null;

    if (savedLocale && config.supportedLocales.includes(savedLocale)) {
      this.locale = savedLocale;
    } else {
      this.locale = config.locale;
    }
  }

  public async init() {
    if (this.config.loader && !this.messages[this.locale]) {
      await this.fetchLocale(this.locale);
    }
  }

  private async fetchLocale(locale: L) {
    this.isLoading = true;
    this.store.notify();

    try {
      const data = await this.config.loader!(locale);
      this.messages[locale] = { ...this.messages[locale], ...data };
    } catch (e) {
      console.error(`Failed to load locale: ${locale}`, e);
    } finally {
      this.isLoading = false;
      this.store.notify();
    }
  }

  get currentLocale() {
    return this.locale;
  }

  subscribe = this.store.subscribe;

  setLocale = async (locale: L) => {
    if (this.config.loader && !this.messages[locale]) {
      this.isLoading = true;
      this.store.notify();

      try {
        const data = await this.config.loader(locale);
        this.messages[locale] = data;
      } catch (e) {
        console.error(`Failed to load locale: ${locale}`, e);
      } finally {
        this.isLoading = false;
      }
    }

    this.locale = locale;

    if (this.config.persistKey && typeof window !== "undefined") {
      localStorage.setItem(this.config.persistKey, locale);
    }

    this.store.notify();
  };

  private getMessage<K extends DeepKeys<T>>(
    key: K,
  ): DeepValue<T, K> | undefined {
    const localesToCheck = [
      this.locale,
      ...(this.config.fallbackLocales || []),
    ];

    const path = (key as string).split(/[:.]/);
    for (const l of localesToCheck) {
      if (!this.messages[l]) continue;

      const msg = path.reduce((o, k) => o?.[k], this.messages[l]) as
        | DeepValue<T, K>
        | undefined;

      if (msg !== undefined) return msg;
    }

    return undefined;
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
