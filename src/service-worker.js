const BASE_URL = '/m8-bpm-pitch-calculator';
const CACHE_VERSION = '0.3.1';
const CURRENT_CACHES = {
  m8calc: `m8-bpm-pit-calc--v${CACHE_VERSION}`,
};


self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CURRENT_CACHE_NAME.m8calc).then(function(cache) {
        return cache.addAll([
          `${BASE_URL}/`,
          `${BASE_URL}/index.html`,
          `${BASE_URL}/img/tpo2pit.png`,
          `${BASE_URL}/styles/styles.css`,
          `${BASE_URL}/js/app.js`,
          `${BASE_URL}/js/hex_dec_converters.js`,
          `${BASE_URL}/service-worker.js`
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


self.addEventListener("activate", (event) => {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic
  // will handle the case where there are multiple versioned caches.
  const expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHES));
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!expectedCacheNamesSet.has(cacheName)) {
            // If this cache name isn't present in the set of
            // "expected" cache names, then delete it.
            console.log("Deleting out of date cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
