'use strict';

// ─── Cache Names ──────────────────────────────────────────────────────────────
// Bump CACHE_VERSION whenever you deploy updated app assets.
// The activate handler will automatically delete all caches from older versions,
// so users always get a fresh copy on their next visit.
const CACHE_VERSION = 9;
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
  './icon.svg',
];

// ═══════════════════════════════ LIFECYCLE ════════════════════════════════════

/**
 * Install
 *
 * Pre-cache the entire app shell using Promise.allSettled so a single network
 * hiccup or asset issue does not break the entire service worker installation.
 * Then calls skipWaiting() so this SW activates immediately.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then(async (cache) => {
        await Promise.allSettled(
          CORE_ASSETS.map(async (asset) => {
            try {
              const res = await fetch(asset, { cache: 'no-cache' });
              if (res && res.ok) {
                await cache.put(asset, res);
              }
            } catch (err) {
              console.warn('[SW] Pre-cache skip:', asset, err);
            }
          }),
        );
      })
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
  // Use stale-while-revalidate with network timeout so font styles load instantly
  // from cache or fall back seamlessly without stalling.
  if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(staleWhileRevalidate(request, FONT_CACHE, 2500));
    return;
  }

  // ── Google Fonts binaries (fonts.gstatic.com) ─────────────────────────────
  // Font files are immutable content-addressed binaries: cache-first with timeout.
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONT_CACHE, 3500));
    return;
  }

  // ── App shell — same origin ───────────────────────────────────────────────
  // Stale-while-revalidate gives instant (0ms) offline & online loads from
  // the pre-cached shell while refreshing in the background with timeout.
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, CORE_CACHE, 2500));
    return;
  }
});

// ═══════════════════════════════ STRATEGIES ═══════════════════════════════════

/**
 * Safe fetch with AbortController timeout.
 * Prevents requests from hanging indefinitely on dead/throttled cellular connections.
 *
 * @param {Request} request
 * @param {number}  timeoutMs
 * @returns {Promise<Response|null>}
 */
async function fetchWithTimeout(request, timeoutMs = 2500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(request, { signal: controller.signal });
    return res;
  } catch (_err) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Stale-While-Revalidate with Network Timeout
 *
 * 1. Open the cache and check for a stored response.
 * 2. If a cached response exists, return it immediately (0ms fast path).
 * 3. In the background (or foreground if cache miss), fire a timed network request.
 * 4. On cache miss, await network request within timeout; fall back gracefully if offline.
 *
 * @param {Request} request
 * @param {string}  cacheName
 * @param {number}  timeoutMs
 * @returns {Promise<Response>}
 */
async function staleWhileRevalidate(request, cacheName, timeoutMs = 2500) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Background revalidation promise with timeout
  const revalidationPromise = fetchWithTimeout(request, timeoutMs)
    .then(async (res) => {
      if (res && res.ok) {
        await cache.put(request, res.clone());
      }
      return res;
    })
    .catch(() => null);

  // Instant response path (0ms wait time)
  if (cached) {
    return cached;
  }

  // First visit / cache miss path: await bounded network response
  const networkRes = await revalidationPromise;
  if (networkRes) {
    return networkRes;
  }

  // Fallback if navigating to root or index.html
  const url = new URL(request.url);
  if (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
    const fallback = (await cache.match('./index.html')) || (await cache.match('./'));
    if (fallback) return fallback;
  }

  return offlineFallback(request);
}

/**
 * Cache-First with Network Timeout
 *
 * 1. Return the cached response immediately if one exists.
 * 2. On a cache miss, fetch from the network with timeout, store the result, and return it.
 *
 * Ideal for immutable / content-addressed assets that never change once cached.
 *
 * @param {Request} request
 * @param {string}  cacheName
 * @param {number}  timeoutMs
 * @returns {Promise<Response>}
 */
async function cacheFirst(request, cacheName, timeoutMs = 3500) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const res = await fetchWithTimeout(request, timeoutMs);
  if (res && res.ok) {
    await cache.put(request, res.clone());
  }
  return res ?? offlineFallback(request);
}

// ═══════════════════════════════ HELPERS ══════════════════════════════════════

/**
 * Offline Fallback
 *
 * Returns a minimal synthetic Response when both the cache and the network
 * are unavailable. For the core app shell this path should never be reached
 * (every asset is pre-cached on install). For third-party resources (fonts)
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
