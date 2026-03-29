export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: string
): string {
  if (locale === "ar") {
    const arField = `${field}Ar`;
    const arValue = obj[arField];
    if (arValue && typeof arValue === "string") return arValue;
  }
  const value = obj[field];
  return typeof value === "string" ? value : "";
}
