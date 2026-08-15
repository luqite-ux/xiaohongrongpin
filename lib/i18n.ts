export function pickI18nString(field: unknown, preferred = process.env.NEXT_PUBLIC_DEFAULT_LANG || "en"): string {
  if (!field || typeof field !== "object") return "";
  const values = field as Record<string, unknown>;
  for (const key of [preferred, "en"]) {
    const value = values[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  for (const value of Object.values(values)) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

export function pickI18nArray(field: unknown, preferred = process.env.NEXT_PUBLIC_DEFAULT_LANG || "en"): string[] {
  if (!field || typeof field !== "object") return [];
  const values = field as Record<string, unknown>;
  for (const key of [preferred, "en"]) {
    const value = values[key];
    if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
  }
  for (const value of Object.values(values)) {
    if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
  }
  return [];
}
