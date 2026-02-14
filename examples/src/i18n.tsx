import { createI18n } from "../../src";

export const { i18n, useTranslation, Provider, useLocale } = createI18n("en", {
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
  fr: {
    app: {
      title: "i18n Avancé",
      welcome: "Bienvenue {name}",
      items: {
        one: "{count} article",
        other: "{count} articles",
      },
      switch: "Changer de langue",
    },
  },
} as const);
