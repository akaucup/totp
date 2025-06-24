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
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
  "https://cdn.jsdelivr.net/npm/otpauth/dist/otpauth.umd.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of URLS_TO_CACHE) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
          } else {
            console.warn(`⚠️ Not OK response: ${url}`, response.status);
          }
        } catch (err) {
          console.warn(`⚠️ Failed to cache: ${url}`, err);
        }
      }
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
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
