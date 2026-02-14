export function getClientPersistence(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setClientPersistence(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail if localStorage is not available
  }
}
