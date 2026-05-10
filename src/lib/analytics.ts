// Optional helper for explicit event tracking from components.
// AnalyticsScript already auto-tracks elements with [data-umami-event],
// so this is only needed when a non-click trigger (e.g. timer, scroll)
// must fire an event programmatically. Currently unused — kept for future.

declare global {
  interface Window {
    umami?: {
      track?: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export function track(event: string, data?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  window.umami?.track?.(event, data);
}

export {};
