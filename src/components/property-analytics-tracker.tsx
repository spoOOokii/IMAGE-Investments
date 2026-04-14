"use client";

import { useEffect } from "react";

type PropertyAnalyticsTrackerProps = {
  slug: string;
};

export function PropertyAnalyticsTracker({
  slug,
}: PropertyAnalyticsTrackerProps) {
  useEffect(() => {
    const controller = new AbortController();

    void fetch(`/api/properties/${slug}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "view" }),
      signal: controller.signal,
    }).catch(() => undefined);

    return () => controller.abort();
  }, [slug]);

  return null;
}
