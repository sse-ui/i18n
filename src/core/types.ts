export type Primitive = string | number | boolean | null | undefined;
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7];
export type LocaleMessages = Record<string, any>;

export type DeepKeys<
  T,
  Depth extends number = 5,
  Prefix extends string = "",
> = [Depth] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends Primitive
          ? `${Prefix}${K}`
          : `${Prefix}${K}` | DeepKeys<T[K], Prev[Depth], `${Prefix}${K}.`>;
      }[keyof T & string]
    : never;

export type DeepValue<T, K extends string, Depth extends number = 5> = [
  Depth,
] extends [never]
  ? never
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

// export type ParamsOf<T, K extends DeepKeys<T>> =
//   DeepValue<T, K> extends string
//     ? ExtractParams<DeepValue<T, K>> extends never
//       ? undefined
//       : Record<ExtractParams<DeepValue<T, K>>, string | number>
//     : undefined;

export type ParamsOf<T, K extends DeepKeys<T>> =
  DeepValue<T, K> extends string
    ? ExtractParams<DeepValue<T, K>> extends never
      ? undefined
      : Record<ExtractParams<DeepValue<T, K>>, string | number>
    : DeepValue<T, K> extends { other: string }
      ? ExtractParams<DeepValue<T, K>["other"]> extends never
        ? undefined
        : Record<ExtractParams<DeepValue<T, K>["other"]>, string | number>
      : undefined;
