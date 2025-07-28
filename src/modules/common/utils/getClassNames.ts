export function getClassNames<T extends Record<string, string>>(
  className: string | Partial<T> | undefined,
  defaultKey: keyof T,
): Partial<T> {
  if (!className || typeof className === "string") {
    return { [defaultKey]: className ?? "" } as Partial<T>;
  }

  return className;
}
