const CACHE = 'chef-cost-v10';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './favicon.ico'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    e.request.mode === 'navigate'
      ? fetch(e.request).catch(() => caches.match('./index.html'))
      : caches.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok) { const cl = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); } return res; }).catch(() => caches.match(e.request)))
  );
});
