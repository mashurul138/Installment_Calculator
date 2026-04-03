'use strict';

// ─── Cache Names ──────────────────────────────────────────────────────────────
// Bump CACHE_VERSION whenever you deploy updated app assets.
// The activate handler will automatically delete all caches from older versions,
// so users always get a fresh copy on their next visit.
const CACHE_VERSION = 1;
const CORE_CACHE    = `ic-core-v${CACHE_VERSION}`;
const FONT_CACHE    = `ic-fonts-v${CACHE_VERSION}`;

// ─── Assets to Pre-cache ─────────────────────────────────────────────────────
// These files are fetched and stored during the install phase so the app
// is fully functional on the very first offline visit.
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
];

// ═══════════════════════════════ LIFECYCLE ════════════════════════════════════

/**
 * Install
 *
 * Pre-cache the entire app shell, then call skipWaiting() so this SW
 * activates immediately instead of waiting for existing tabs to close.
 * This ensures users always run the latest version after a reload.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

/**
 * Activate
 *
 * Delete every cache that was created by a previous version of this SW,
 * then call clients.claim() to take control of all open tabs right away
 * (without requiring a page reload).
 */
self.addEventListener('activate', (event) => {
  const KNOWN_CACHES = new Set([CORE_CACHE, FONT_CACHE]);

  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !KNOWN_CACHES.has(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ═══════════════════════════════ FETCH ROUTING ════════════════════════════════

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only intercept GET requests — let POST / PUT / DELETE pass through normally.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // ── Google Fonts CSS (fonts.googleapis.com) ───────────────────────────────
  // Use stale-while-revalidate so the stylesheet is served from cache
  // instantly on every visit while being silently refreshed in the background.
  if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(staleWhileRevalidate(request, FONT_CACHE));
    return;
  }

  // ── Google Fonts binaries (fonts.gstatic.com) ─────────────────────────────
  // Font files are content-addressed: the URL itself encodes the exact version,
  // so a cached copy is always valid and never needs revalidation.
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // ── App shell — same origin ───────────────────────────────────────────────
  // Stale-while-revalidate gives instant offline loads from the pre-cached
  // shell while transparently refreshing assets whenever the network is up.
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, CORE_CACHE));
    return;
  }
});

// ═══════════════════════════════ STRATEGIES ═══════════════════════════════════

/**
 * Stale-While-Revalidate
 *
 * 1. Open the cache and check for a stored response.
 * 2. Always fire a background network request to refresh the cache entry.
 * 3. If a cached response exists, return it immediately (fast path).
 * 4. If there is no cached response, await the network response instead.
 *
 * Result:
 *   - Offline  + cached  → instant load from cache              ✓
 *   - Online   + cached  → instant load from cache + BG refresh ✓
 *   - First visit / cache miss → network response (then cached) ✓
 *   - Offline  + no cache → graceful offline fallback           ✓
 *
 * @param {Request} request
 * @param {string}  cacheName
 * @returns {Promise<Response>}
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Kick off a revalidation fetch regardless of whether we have a cached copy.
  // When `cached` is returned immediately below, this promise keeps running
  // silently in the background and updates the cache for the next visit.
  const revalidation = fetch(request)
    .then((res) => {
      if (res?.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);

  // Serve the cached version instantly; fall back to the network on a miss.
  return cached ?? (await revalidation) ?? offlineFallback(request);
}

/**
 * Cache-First
 *
 * 1. Return the cached response immediately if one exists.
 * 2. On a cache miss, fetch from the network, store the result, and return it.
 *
 * Ideal for immutable / content-addressed assets that never change once cached.
 *
 * @param {Request} request
 * @param {string}  cacheName
 * @returns {Promise<Response>}
 */
async function cacheFirst(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const res = await fetch(request).catch(() => null);
  if (res?.ok) cache.put(request, res.clone());
  return res ?? offlineFallback(request);
}

// ═══════════════════════════════ HELPERS ══════════════════════════════════════

/**
 * Offline Fallback
 *
 * Returns a minimal synthetic Response when both the cache and the network
 * are unavailable.  For the core app shell this path should never be reached
 * (every asset is pre-cached on install).  For third-party resources (fonts)
 * the browser will simply skip the asset and fall back to system fonts.
 *
 * @param {Request} request
 * @returns {Response}
 */
function offlineFallback(request) {
  const accept     = request.headers.get('Accept') ?? '';
  const isDocument = accept.includes('text/html');

  const body = isDocument
    ? '<!doctype html><meta charset="utf-8"><title>Offline</title>'
      + '<p style="font-family:system-ui,sans-serif;padding:2rem">'
      + 'You are offline and this page has not been cached yet. '
      + 'Please reconnect and try again.</p>'
    : '';

  return new Response(body, {
    status:  503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': isDocument ? 'text/html;charset=utf-8' : 'text/plain' },
  });
}
