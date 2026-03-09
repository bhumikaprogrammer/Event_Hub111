function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/** Recursively converts all object keys from snake_case to camelCase. */
export function convertKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(convertKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj as Record<string, unknown>).reduce(
      (acc, [key, val]) => {
        acc[toCamelCase(key)] = convertKeys(val);
        return acc;
      },
      {} as Record<string, unknown>
    );
  }
  return obj;
}
