export function excludeFromObject<T, K extends keyof T>(
  obj: any,
  keys: any[],
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;
}
