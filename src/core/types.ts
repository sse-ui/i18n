import { ReactNode } from "react";

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

export type PluralForms = {
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};

type ExtractTokens<S> = S extends `${string}{${infer P}}${infer R}`
  ? P | ExtractTokens<R>
  : never;

type ExtractReqVars<S> =
  ExtractTokens<S> extends infer V
    ? V extends `${string}?`
      ? never
      : V
    : never;

type ExtractOptVars<S> =
  ExtractTokens<S> extends infer V
    ? V extends `${infer Name}?`
      ? Name
      : never
    : never;

type ExtractTags<S> = S extends `${string}<${infer T}>${infer R}`
  ? T extends `/${string}`
    ? ExtractTags<R>
    : T | ExtractTags<R>
  : never;

type ExtractAllReqVars<T> = T extends PluralForms
  ? ExtractReqVars<T["other"] | T["one"] | T["two"] | T["few"] | T["many"]>
  : never;

type ExtractAllOptVars<T> = T extends PluralForms
  ? ExtractOptVars<T["other"] | T["one"] | T["two"] | T["few"] | T["many"]>
  : never;

type ExtractAllTags<T> = T extends PluralForms
  ? ExtractTags<T["other"] | T["one"] | T["two"] | T["few"] | T["many"]>
  : never;

export type ParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ((children: ReactNode) => ReactNode);

type Simplify<T> = { [K in keyof T]: T[K] } & {};

type CheckUndefined<Req, Opt> = [Req] extends [never]
  ? [Opt] extends [never]
    ? undefined
    : Simplify<Partial<Record<Opt & string, ParamValue>>>
  : Simplify<
      Record<Req & string, ParamValue> &
        Partial<Record<Opt & string, ParamValue>>
    >;

export type ParamsOf<T, K extends DeepKeys<T>> =
  DeepValue<T, K> extends string
    ? CheckUndefined<
        ExtractReqVars<DeepValue<T, K>>,
        ExtractOptVars<DeepValue<T, K>> | ExtractTags<DeepValue<T, K>>
      >
    : DeepValue<T, K> extends PluralForms
      ? Simplify<
          Record<
            "count" | (ExtractAllReqVars<DeepValue<T, K>> & string),
            ParamValue
          > &
            Partial<
              Record<
                (
                  | ExtractAllOptVars<DeepValue<T, K>>
                  | ExtractAllTags<DeepValue<T, K>>
                ) &
                  string,
                ParamValue
              >
            >
        >
      : undefined;
