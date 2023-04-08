self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('m8-bpm-pit-calc--cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles/styles.css',
          '/js/app.js',
          '/js/hex_dec_converters.js',
          '/js/service-worker.js'
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