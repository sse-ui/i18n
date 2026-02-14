export function interpolate<
  P extends Record<string, string | number> | undefined,
>(message: string, params: P) {
  if (!params) return message;

  return message.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in params ? String(params[key as keyof P]) : `{${key}}`,
  );
}
