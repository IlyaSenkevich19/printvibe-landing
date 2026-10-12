// Template: the serviceWorker() plugin in vite.config.ts fills in the version and file list and emits sw.js.
const VERSION = "__VERSION__";
const ASSETS = __ASSETS__;
const PAGES = ["./", "./privacy"];

const PAGE_CACHE = `pages-${VERSION}`;
const ASSET_CACHE = `assets-${VERSION}`;
const SCOPE = new URL(self.registration.scope);
const NETWORK_TIMEOUT_MS = 3500;

const url = (path) => new URL(path, SCOPE).href;

/** Cached pages are keyed without the trailing slash, hash and query: /privacy/ and /privacy are one page. */
function pageKey(href) {
  const u = new URL(href);
  const path = u.pathname.replace(/index\.html$/, "").replace(/(.)\/$/, "$1");
  return u.origin + path;
}

/** A redirected response cannot answer a navigation, so store a plain copy. */
async function plain(response) {
  if (!response.redirected) return response;
  return new Response(await response.blob(), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGE_CACHE);
      const assets = await caches.open(ASSET_CACHE);
      await Promise.allSettled([
        ...PAGES.map(async (path) => {
          const response = await fetch(url(path), { cache: "no-cache" });
          if (response.ok) await pages.put(pageKey(url(path)), await plain(response));
        }),
        ...ASSETS.map(async (path) => {
          const response = await fetch(url(path));
          if (response.ok) await assets.put(url(path), response);
        }),
      ]);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([PAGE_CACHE, ASSET_CACHE]);
      for (const name of await caches.keys()) {
        if (!keep.has(name)) await caches.delete(name);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const target = new URL(request.url);
  if (target.origin !== SCOPE.origin || !target.pathname.startsWith(SCOPE.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(page(event));
    return;
  }
  if (target.pathname.endsWith("/sw.js")) return;
  event.respondWith(asset(request));
});

/** Pages: fresh from the network when it answers in time, otherwise the saved copy. */
async function page(event) {
  const key = pageKey(event.request.url);
  const cache = await caches.open(PAGE_CACHE);
  const network = fetch(event.request).then(async (response) => {
    if (response.ok) await cache.put(key, await plain(response.clone()));
    return response;
  });
  event.waitUntil(network.catch(() => {}));

  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT_MS));
  try {
    const response = await Promise.race([network, timeout]);
    if (response) return response;
  } catch {
    // Offline: fall through to the saved copy.
  }
  const saved = await cache.match(key);
  if (saved) return saved;
  try {
    return await network;
  } catch {
    return offlinePage();
  }
}

/** Build files have a content hash in the name, so a saved copy never goes stale. */
async function asset(request) {
  const cache = await caches.open(ASSET_CACHE);
  const saved = await cache.match(request, { ignoreSearch: true });
  if (saved) return saved;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") await cache.put(request, response.clone());
  return response;
}

function offlinePage() {
  const home = url("./");
  return new Response(
    `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Нет интернета — PrintVibe</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;padding:2rem 1.25rem;background:#f4f0e8;color:#1c1528;font:1rem/1.5 system-ui,sans-serif;text-align:center}h1{font-size:1.75rem;margin:0}p{color:#5b5466;max-width:26rem;margin:.75rem auto 2rem}a{display:inline-block;padding:.85rem 1.5rem;border:2px solid #1c1528;background:#6b2bff;color:#fff;font-weight:700;text-decoration:none;box-shadow:5px 5px 0 #ff8a3d}</style></head>
<body><main><h1>Нет интернета</h1><p>Эта страница ещё не сохранена на устройстве. Главная открывается и без сети.</p><a href="${home}">На главную</a></main></body></html>`,
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
