// غرز: يحفظ نسخة من التطبيق ليفتح حتى بدون إنترنت، ويجلب الأحدث كلما توفر الاتصال
const CACHE = 'ghorz-v20';
const CORE = ['./', './index.html', './staff.html', './staff-manifest.json', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, {cache: 'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    // pages and scripts skip the browser's HTTP cache so a new upload shows on the next open
    fetch((e.request.mode === 'navigate' || /\.(html|js|json)(\?|$)/.test(e.request.url)) ? new Request(e.request.url, {cache: 'no-cache', credentials: 'same-origin'}) : e.request).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
