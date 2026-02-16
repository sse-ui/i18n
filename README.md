# @sse-ui/i18n

A lightweight, type-safe internationalization (i18n) library for React applications. It features advanced interpolation, pluralization support, and lazy loading capabilities, all while maintaining strict TypeScript types for your translation keys and parameters.

## Features

- **Type-Safe Translations**: Get autocomplete and compile-time errors for your translation keys and variable names.
- **Pluralization**: Built-in support for plural forms (one, other, etc.) based on the `Intl.PluralRules` API.
- **Interpolation**: Supports both string variables and React component interpolation (tags) within translation strings.
- **Lazy Loading**: Load locale files on-demand to optimize bundle size.
- **Persistence**: Automatically persists the user's language preference in `localStorage`.
- **Lightweight**: Zero external dependencies (other than React).

## Installation

```bash
npm install @sse-ui/i18n
# or
yarn add @sse-ui/i18n
```

## Quick Start

### 1. Initialize i18n

Create a configuration file (e.g., `src/i18n.ts`). This is where you define your default language and how to load others.

```typescript
import { createI18n } from "@sse-ui/i18n";

export const { i18n, useTranslation, Provider, useLocale } = createI18n({
  locale: "en",
  supportedLocales: ["en", "es", "fr"],
  persistKey: "i18n-locale",
  fallbackLocales: ["en"],
  messages: {
    en: {
      app: {
        title: "Advanced i18n",
        welcome: "Welcome {{ name }} {{ last? }}",
        items: {
          one: "{{count}} item",
          other: "{{count}} items",
        },
        switch: "Switch Language",
      },

      agree:
        "I accept the <terms>Terms</terms> and <link>Privacy Policy</link>.",
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

  // Not necessary to use it
  loader: async (locale) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(`/locales/${locale}.json`);
    if (!res.ok) {
      throw new Error(`Failed to load locale ${locale}`);
    }
    return res.json();
  },
});
```

### 2. Wrap your Application

> If you want to use in context form and waht to use it in `useLocale` then wrap the code. If not the leave it and go to next step.

Place the Provider at the top level of your component tree.

```typescript
import { Provider } from "./i18n";

function Root() {
  return (
    <Provider>
      <App />
    </Provider>
  );
}
```

### 3. Use in Components

> `useTranslation` doesn't require any context. it can be used directly

The `t` function automatically infers required parameters based on your translation strings.

```typescript
import { useState } from "react";
import { useTranslation } from "./i18n";

export default function App() {
  const { t, setLocale, locale, isLoading } = useTranslation();
  const [count, setCount] = useState(1);

  return (
    <div>
      <h1>{t("app:title")}</h1>

      <p>{t("app:welcome", { name: "SSE", last: undefined })}</p>
      <p>{t("app:items", { count })}</p>

      <button onClick={() => setCount((c) => c + 1)}>+</button>

      <hr />

      {isLoading ? (
        <p>Loading translations...</p>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setLocale("en")} disabled={locale === "en"}>
            English
          </button>
          <button onClick={() => setLocale("es")} disabled={locale === "es"}>
            Español (Lazy Load)
          </button>
        </div>
      )}

      <div>{t("agree", {term: (chunk) => <a>{chunk}</a>}}</div>
    </div>
  );
}
```

or

```
import { useState } from "react";
import { useLocale } from "./i18n";

export default function App() {
  const { t, setLocale, locale, isLoading } = useLocale();
  const [count, setCount] = useState(1);

  return (
    <div>
      <h1>{t("app:title")}</h1>

      <p>{t("app:welcome", { name: "SSE", last: undefined })}</p>
      <p>{t("app:items", { count })}</p>

      <button onClick={() => setCount((c) => c + 1)}>+</button>

      <hr />

      {isLoading ? (
        <p>Loading translations...</p>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setLocale("en")} disabled={locale === "en"}>
            English
          </button>
          <button onClick={() => setLocale("es")} disabled={locale === "es"}>
            Español (Lazy Load)
          </button>
        </div>
      )}

      <div>{t("agree")}</div>
    </div>
  );
}
```

## API Reference

### `createI18n(options)`

Creates the i18n instance, hooks, and context provider.

- `locale`: Initial language.
- `supportedLocales`: Array of allowed locale strings.
- `messages`: Initial translation data.
- `loader`: Async function to fetch translations for new locales.
- `persistKey`: Key used to save the locale in localStorage.
- `fallbackLocales`: If a key is missing in `es`, it checks `en`

### `useTranslation()`

A hook that provides the current state and translation function.

- `t(key, params)`: Translates a key. Supports nested keys using `:` or `.`.
- `locale`: The active locale string.
- `setLocale(locale)`: Changes the language and triggers the loader if necessary.
- `isLoading`: true when a new locale file is being fetched.

### Advanced: Type-Safe Nested Keys

The library supports deep nesting. Use colons for namespaces and dots for properties:

- Key: `"errors:auth.login_failed"`
- Object: `{ errors: { auth: { login_failed: "..." } } }`
