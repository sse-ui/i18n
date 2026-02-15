import { PluralForms } from "./types";

export function resolvePlural(
  locale: string,
  count: number,
  forms: PluralForms,
) {
  try {
    const rule = new Intl.PluralRules(locale).select(count);
    return forms[rule as keyof PluralForms] ?? forms.other;
  } catch (error) {
    console.warn(`Invalid locale for PluralRules: ${locale}`);
    return forms.other;
  }
}
