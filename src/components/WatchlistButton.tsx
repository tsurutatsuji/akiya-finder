"use client";

import { useState, useEffect } from "react";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";

interface WatchlistButtonProps {
  id: string;
  title?: string;
  price?: number;
  location?: string;
  thumbnailUrl?: string | null;
  /** Size variant */
  size?: "sm" | "md";
}

export default function WatchlistButton({
  id,
  title,
  price,
  location,
  thumbnailUrl,
  size = "sm",
}: WatchlistButtonProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isInWatchlist(id));
  }, [id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation when inside a card
    e.stopPropagation();
    const added = toggleWatchlist({ id, title, price, location, thumbnailUrl });
    setActive(added);
    // Dispatch custom event so WatchlistDropdown can update
    window.dispatchEvent(new CustomEvent("watchlist-changed"));
  };

  const iconSize = size === "md" ? "w-7 h-7" : "w-5 h-5";
  const padding = size === "md" ? "p-2" : "p-1.5";

  return (
    <button
      onClick={handleClick}
      className={`${padding} rounded-full transition-all duration-200 hover:scale-110 ${
        active
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-400"
      }`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={iconSize}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        />
      </svg>
    </button>
  );
}
