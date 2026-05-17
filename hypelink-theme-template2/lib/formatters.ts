export function safeText(value: string | undefined | null, fallback = ''): string {
  return value?.trim() || fallback
}
