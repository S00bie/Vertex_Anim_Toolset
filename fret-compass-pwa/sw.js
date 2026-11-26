// Bump VERSION whenever you change any file, so installed apps pick up the update.
const VERSION = 'fret-compass-v1';
const ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'fonts/fonts.css',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(ASSETS);
    const css = await (await fetch('fonts/fonts.css')).text();
    const fonts = [...css.matchAll(/url\(([^)]+\.ttf)\)/g)].map(m => 'fonts/' + m[1]);
    await cache.addAll(fonts);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

// Cache-first, falling back to network; navigations fall back to the cached page.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).catch(() =>
    e.request.mode === 'navigate' ? caches.match('index.html') : Response.error())));
});
