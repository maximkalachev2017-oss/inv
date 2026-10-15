// Кэширование «Сборщика ШК iPhone»: работа без интернета после первого открытия.
// При обновлении файлов на сайте увеличьте номер версии ниже.
var CACHE = 'inv-iphone-v5.2-1';
var FILES = ['./', 'index.html', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'manifest.json'];
var ZXING = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(FILES).then(function () {
      return fetch(ZXING, { mode: 'no-cors' }).then(function (r) { return c.put(ZXING, r); }).catch(function () {});
    });
  }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  // сначала сеть (обновления), без сети — из кэша
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
