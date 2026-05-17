export function hasItems<T>(items: T[] | undefined | null): items is T[] {
  return Array.isArray(items) && items.length > 0
}
