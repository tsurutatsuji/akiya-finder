/**
 * localStorage-based watchlist (favorites) utility
 * Stores favorited property IDs with metadata
 */

export interface WatchlistItem {
  id: string;
  title?: string;
  price?: number;
  location?: string;
  thumbnailUrl?: string | null;
  addedAt: number; // timestamp
}

const STORAGE_KEY = "akiyafinder_watchlist";
const MAX_ITEMS = 50;

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WatchlistItem[];
  } catch {
    return [];
  }
}

export function isInWatchlist(id: string): boolean {
  return getWatchlist().some((item) => item.id === id);
}

export function addToWatchlist(item: Omit<WatchlistItem, "addedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const list = getWatchlist();
    // Already exists — do nothing
    if (list.some((h) => h.id === item.id)) return;
    // Add to front
    list.unshift({ ...item, addedAt: Date.now() });
    // Limit
    const trimmed = list.slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // silently fail
  }
}

export function removeFromWatchlist(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getWatchlist();
    const filtered = list.filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // silently fail
  }
}

export function toggleWatchlist(item: Omit<WatchlistItem, "addedAt">): boolean {
  if (isInWatchlist(item.id)) {
    removeFromWatchlist(item.id);
    return false; // removed
  } else {
    addToWatchlist(item);
    return true; // added
  }
}
