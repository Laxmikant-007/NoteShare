export function parseJson<T>(value: string | null): T[] {
  if (!value) return [];
  try {
    return JSON.parse(value) as T[];
  } catch {
    return [];
  }
}

export function stringifyJson(value: any): string {
  return JSON.stringify(value);
}
