import { createI18n } from "../../src";

export const { i18n, useTranslation, Provider, useLocale } = createI18n({
  locale: "en",
  supportedLocales: ["en", "es"],
  persistKey: "i18n-locale",
  fallbackLocales: ["en"],
  messages: {
    en: {
      app: {
        title: "Advanced i18n",
        welcome: "Welcome {name}",
        items: {
          one: "{count} item",
          other: "{count} items",
        },
        switch: "Switch Language",
      },
    },
    // fr: {
    //   app: {
    //     title: "i18n Avancé",
    //     welcome: "Bienvenue {name}",
    //     items: {
    //       one: "{count} article",
    //       other: "{count} articles",
    //     },
    //     switch: "Changer de langue",
    //   },
    // },
  },

  loader: async (locale) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(`/locales/${locale}.json`);
    if (!res.ok) {
      throw new Error(`Failed to load locale ${locale}`);
    }
    return res.json();
  },
});
