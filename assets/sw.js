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
              console.error("Failed to cache:", url, err);
            })
        )
      );
    })
  );
});
