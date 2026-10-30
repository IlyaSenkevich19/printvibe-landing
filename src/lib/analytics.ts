declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Public counter id from Yandex Metrika. */
export const YANDEX_METRIKA_ID = 113919155;

const CONSENT_KEY = "pv-analytics-consent";

type YmStub = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };

export type AnalyticsConsent = "accepted" | "declined" | null;

let metrikaStarted = false;

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  if (value === "1") return "accepted";
  if (value === "0") return "declined";
  return null;
}

export function setAnalyticsConsent(accepted: boolean) {
  window.localStorage.setItem(CONSENT_KEY, accepted ? "1" : "0");
  if (accepted) initYandexMetrika();
}

/** Loads the Metrika tag once and sends the first hit. Call only after consent. */
export function initYandexMetrika() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (metrikaStarted) {
    hitYandexMetrika(window.location.href);
    return;
  }
  metrikaStarted = true;

  window.dataLayer = window.dataLayer || [];

  const stub: YmStub = function (...args: unknown[]) {
    (stub.a = stub.a || []).push(args);
  };
  stub.l = Date.now();
  window.ym = stub as unknown as NonNullable<Window["ym"]>;

  const k = document.createElement("script");
  k.async = true;
  k.src = `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}`;
  const first = document.getElementsByTagName("script")[0];
  first?.parentNode?.insertBefore(k, first);

  window.ym?.(YANDEX_METRIKA_ID, "init", {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
}

export function hitYandexMetrika(url: string) {
  window.ym?.(YANDEX_METRIKA_ID, "hit", url);
}

export function reachYandexGoal(name: string) {
  window.ym?.(YANDEX_METRIKA_ID, "reachGoal", name);
}
