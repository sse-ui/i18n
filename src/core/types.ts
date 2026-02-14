export type Primitive = string | number | boolean | null | undefined;
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7];
export type LocaleMessages = Record<string, any>;

export type DeepKeys<
  T,
  Depth extends number = 5,
  IsRoot extends boolean = true,
> = [Depth] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends Primitive
          ? K
          : IsRoot extends true
            ? `${K}:${DeepKeys<T[K], Prev[Depth], false>}`
            : `${K}.${DeepKeys<T[K], Prev[Depth], false>}` | K;
      }[keyof T & string]
    : never;

export type DeepValue<T, K extends string, Depth extends number = 5> = [
  Depth,
] extends [never]
  ? never
  : K extends `${infer Ns}:${infer Rest}`
    ? Ns extends keyof T
      ? DeepValue<T[Ns], Rest, Prev[Depth]>
      : never
    : K extends `${infer H}.${infer R}`
      ? H extends keyof T
        ? DeepValue<T[H], R, Prev[Depth]>
        : never
      : K extends keyof T
        ? T[K]
        : never;

type ExtractParams<S> = S extends string
  ? S extends `${string}{${infer P}}${infer R}`
    ? P | ExtractParams<R>
    : never
  : never;

export type PluralForms = {
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};

type ExtractPluralParams<T> = T extends PluralForms
  ?
      | ExtractParams<T["other"]>
      | ExtractParams<T["one"]>
      | ExtractParams<T["two"]>
      | ExtractParams<T["few"]>
      | ExtractParams<T["many"]>
  : never;

export type ParamsOf<T, K extends DeepKeys<T>> =
  DeepValue<T, K> extends string
    ? ExtractParams<DeepValue<T, K>> extends never
      ? undefined
      : Record<ExtractParams<DeepValue<T, K>>, string | number>
    : DeepValue<T, K> extends PluralForms
      ? Record<ExtractPluralParams<DeepValue<T, K>> | "count", string | number>
      : undefined;
