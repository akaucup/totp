const CACHE_NAME = "otp-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/assets/style.css",
  "/assets/script.js",
  "/assets/site.webmanifest",
  "assets/favicon-96x96.png",
  "assets/favicon.svg",
  "assets/favicon.ico",
  "assets/apple-touch-icon.png",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
  "https://cdn.jsdelivr.net/npm/otpauth/dist/otpauth.umd.min.js"
];

// Install event: cache file
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        URLS_TO_CACHE.map(url =>
          fetch(url)
            .then(response => {
              if (!response.ok) throw new Error(`Request failed for ${url}`);
              return cache.put(url, response.clone());
            })
            .catch(err => {
              console.error("❌ Failed to cache:", url, err);
            })
        )
      );
    })
  );
});

// Fetch event: respond from cache or network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Activate event: clean up old cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
});
