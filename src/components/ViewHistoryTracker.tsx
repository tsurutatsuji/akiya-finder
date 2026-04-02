"use client";

import { useEffect } from "react";
import { addToViewHistory } from "@/lib/view-history";

interface Props {
  id: string;
  title?: string;
  price?: number;
  location?: string;
  thumbnailUrl?: string | null;
}

export default function ViewHistoryTracker({ id, title, price, location, thumbnailUrl }: Props) {
  useEffect(() => {
    addToViewHistory({
      id,
      viewedAt: Date.now(),
      title,
      price,
      location,
      thumbnailUrl,
    });
  }, [id, title, price, location, thumbnailUrl]);

  return null;
}
