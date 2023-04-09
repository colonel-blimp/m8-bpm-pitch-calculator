const BASE_URL = '/m8-bpm-pitch-calculator';

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('m8-bpm-pit-calc--cache').then(function(cache) {
        return cache.addAll([
          `${BASE_URL}/`,
          `${BASE_URL}/index.html`,
          `${BASE_URL}/styles/styles.css`,
          `${BASE_URL}/js/app.js`,
          `${BASE_URL}/js/hex_dec_converters.js`,
          `${BASE_URL}/js/service-worker.js`
        ]);
      })
    );
  });
  
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});