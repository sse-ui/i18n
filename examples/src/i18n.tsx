import { createI18n, defineLocale } from "../../src";

const en = defineLocale({
  name: "English",
  code: "en",
  messages: {
    app: {
      title: "Advanced i18n",
      welcome: "Welcome {{ name }} {{ last? }}",
      items: {
        one: "{{count}} item",
        other: "{{count}} items",
      },
      switch: "Switch Language",
    },

    agree: "I accept the <terms>Terms</terms> and <link>Privacy Policy</link>.",
  },
});

const es = defineLocale({
  name: "Español",
  code: "es",
  dir: "ltr",
  messages: {
    app: {
      title: "Advanced i18n",
      welcome: "Welcome {{ name }} {{ last? }}",
      items: {
        one: "{{count}} item",
        other: "{{count}} items",
      },
      switch: "Switch Language",
    },

    agree: "I accept the <terms>Terms</terms> and <link>Privacy Policy</link>.",
  },
});

// export const { i18n, useTranslation, Provider, useLocale } = createI18n({
//   locale: "en",
//   supportedLocales: ["en", "es"],
//   locales: [en, es],
//   persistKey: "i18n-locale"
// });

export const { i18n, useTranslation, Provider, useLocale } = createI18n({
  locale: "en",
  supportedLocales: ["en", "es"],
  persistKey: "i18n-locale",
  locales: [en, es],
  fallbackLocales: ["en"],

  loader: async (locale) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(`/locales/${locale}.json`);
    if (!res.ok) {
      throw new Error(`Failed to load locale ${locale}`);
    }
    return res.json();
  },
});
