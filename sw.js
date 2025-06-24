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
    caches.open(CACHE_NAME).then(async cache => {
      await Promise.all(URLS_TO_CACHE.map(async url => {
        try {
          const response = await fetch(url, { mode: 'no-cors' });
          await cache.put(url, response);
        } catch (err) {
          console.warn(`⚠️ Failed to cache: ${url}`, err);
        }
      }));
    })
  );
});
