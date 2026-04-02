/**
 * localStorage-based view history utility
 * Stores recently viewed property IDs with metadata
 */

export interface ViewHistoryItem {
  id: string;
  viewedAt: number; // timestamp
  title?: string;
  price?: number;
  location?: string;
  thumbnailUrl?: string | null;
}

const STORAGE_KEY = "akiyafinder_view_history";
const MAX_ITEMS = 20; // Store up to 20, display 5

export function getViewHistory(): ViewHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ViewHistoryItem[];
  } catch {
    return [];
  }
}

export function addToViewHistory(item: ViewHistoryItem): void {
  if (typeof window === "undefined") return;
  try {
    const history = getViewHistory();
    // Remove existing entry for the same property
    const filtered = history.filter((h) => h.id !== item.id);
    // Add to front
    filtered.unshift({ ...item, viewedAt: Date.now() });
    // Limit
    const trimmed = filtered.slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // silently fail
  }
}

export function clearViewHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}
