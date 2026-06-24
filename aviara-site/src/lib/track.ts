/*
 * Thin gtag wrapper. Lets every CTA fire a structured event without each
 * component having to know GA exists or care whether window.gtag has loaded.
 *
 * Use:
 *   import { track } from "@/lib/track";
 *   <a href="tel:…" onClick={() => track("phone_click", { surface: "footer" })}>
 *
 * Safe to call before GA loads (drops silently) and during SSR (no-op).
 */
type EventName =
  | "form_submit"
  | "phone_click"
  | "email_click"
  | "sms_click"
  | "cta_click"
  | "portfolio_open";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: EventParams) => void;
  }
}

export function track(event: EventName, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", event, params);
  } catch {
    /* GA failed to load or browser blocked — ignore */
  }
}
