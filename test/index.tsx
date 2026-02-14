import { createLocaleSystem } from "../src/context";
import { createLocaleDefiner } from "../src/defineLocale";
import { createLocalesRecord } from "../src/utils";

export type MyData = { title: string };

// 1. Bind your data type exactly ONCE
const defineMyLocale = createLocaleDefiner<MyData>();

// 2. Now use it everywhere! No generics or 'as const' needed.
export const en = defineMyLocale({
  code: "en",
  name: "English",
  messages: { title: "Hello" }, // Strictly enforced as MyData automatically
});

export const es = defineMyLocale({
  code: "es",
  name: "Spanish",
  messages: { title: "Hola" },
});

const { LocaleProvider } = createLocaleSystem(createLocalesRecord([en, es]));
