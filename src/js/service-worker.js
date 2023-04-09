self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('m8-bpm-pit-calc--cache').then(function(cache) {
        return cache.addAll([
          '/m8-bpm-pitch-calculator/',
          '/m8-bpm-pitch-calculator/index.html',
          '/m8-bpm-pitch-calculator/styles/styles.css',
          '/m8-bpm-pitch-calculator/js/app.js',
          '/m8-bpm-pitch-calculator/js/hex_dec_converters.js',
          '/m8-bpm-pitch-calculator/js/service-worker.js'
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