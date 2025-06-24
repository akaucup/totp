const CACHE_NAME = "otp-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "assets/style.css",
  "assets/script.js",
  "https://cdn.jsdelivr.net/npm/otpauth/dist/otpauth.umd.min.js",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // Optionally return a fallback page
      })
  );
});
