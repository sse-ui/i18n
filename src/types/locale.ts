export type Direction = "ltr" | "rtl";

export type Locale<M> = {
  name: string;
  code: string;
  dir: Direction;
  messages: M;
};
