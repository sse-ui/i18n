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
