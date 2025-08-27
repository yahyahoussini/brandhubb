// Type guards for analytics event props
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function getStringProp(props: any, key: string, defaultValue = ''): string {
  if (!isObject(props)) return defaultValue;
  const value = props[key];
  return typeof value === 'string' ? value : defaultValue;
}

export function getNumberProp(props: any, key: string, defaultValue = 0): number {
  if (!isObject(props)) return defaultValue;
  const value = props[key];
  return typeof value === 'number' ? value : defaultValue;
}

export function getBooleanProp(props: any, key: string, defaultValue = false): boolean {
  if (!isObject(props)) return defaultValue;
  const value = props[key];
  return typeof value === 'boolean' ? value : defaultValue;
}