// Type guards for analytics event props
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function getStringProp(
  props: unknown,
  key: string,
  defaultValue = ''
): string {
  if (!isObject(props)) return defaultValue;
  const value = props[key];
  return typeof value === 'string' ? value : defaultValue;
}

export function getNumberProp(
  props: unknown,
  key: string,
  defaultValue = 0
): number {
  if (!isObject(props)) return defaultValue;
  const value = props[key];
  return typeof value === 'number' ? value : defaultValue;
}

export function getBooleanProp(
  props: unknown,
  key: string,
  defaultValue = false
): boolean {
  if (!isObject(props)) return defaultValue;
  const value = props[key];
  return typeof value === 'boolean' ? value : defaultValue;
}
