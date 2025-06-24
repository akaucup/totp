const CACHE_NAME = "otp-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/assets/style.css",
  "/assets/script.js",
  "/assets/site.webmanifest",
  "/assets/favicon-96x96.png",
  "/assets/favicon.svg",
  "/assets/favicon.ico",
  "/assets/apple-touch-icon.png",
  "https://cdn.jsdelivr.net/npm/otpauth/dist/otpauth.umd.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    }).catch(err => {
      console.warn("⚠️ Some files failed to cache", err);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});
