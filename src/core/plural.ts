export type PluralForms = {
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};

export function resolvePlural(
  locale: string,
  count: number,
  forms: PluralForms,
) {
  const rule = new Intl.PluralRules(locale).select(count);
  return forms[rule as keyof PluralForms] ?? forms.other;
}
