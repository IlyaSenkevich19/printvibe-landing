/** Production builds ship sw.js. In dev there is none, and a leftover worker would serve stale files. */
export function setupOffline() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const base = import.meta.env.BASE_URL;
  if (import.meta.env.PROD) {
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {});
    return;
  }
  void navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => registrations.forEach((r) => void r.unregister()));
}
