"use client";

import { useState, useEffect, useCallback } from "react";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("akf-visitor-id");
  if (!id) {
    id = Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem("akf-visitor-id", id);
  }
  return id;
}

export default function ViewerCount() {
  const [count, setCount] = useState<number | null>(null);

  const sendHeartbeat = useCallback(async () => {
    const visitorId = getVisitorId();
    if (!visitorId) return;
    try {
      const res = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          page: window.location.pathname,
        }),
      });
      const data = await res.json();
      setCount(data.count);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 30_000);
    return () => clearInterval(interval);
  }, [sendHeartbeat]);

  if (count === null || count < 1) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span>
        {count} {count === 1 ? "viewer" : "viewers"}
      </span>
    </div>
  );
}
