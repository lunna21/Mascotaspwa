const CACHE_INMUTABLE = "cache-inmutable";
// elementos que no van a cambiar, como el framework, librerías, fuentes, etc
const CACHE_STATIC = "cache-static";
// elementos estáticos escenciales para el funcionamiento de la app, como el index.html, css, js, etc
const CACHE_DYNAMIC = "cache-dynamic";

function limpiarCache(cacheName, numeroItems) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > numeroItems) {
        cache.delete(keys[0]).then(() => limpiarCache(cacheName, numeroItems));
      }
    });
  });
}

self.addEventListener("install", (e) => {
  const cacheStatic = caches.open(CACHE_STATIC).then((cache) => {
    return cache.addAll([
      "./",
      "./index.html",
      "./app.js",
      "./favicon.ico",
      "./not-found.html",
      "./img/logo.jpg",
      "./img/imagen-no-encontrada.jpg",
    ]);
  });
  const cacheInmutable = caches.open(CACHE_INMUTABLE).then((cache) => {
    return cache.addAll([
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css",
    ]);
  });
  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener("fetch", (e) => {
  const respuesta = caches
    .match(e.request)
    .then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(e.request).then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_DYNAMIC).then((cache) => {
          cache.put(e.request, responseClone);
          limpiarCache(CACHE_DYNAMIC, 50);
        });
        return networkResponse;
      });
    })
    .catch(() => {
      const acceptHeader = e.request.headers.get("accept") || "";
      if (acceptHeader.includes("text/html")) {
        return caches.match("./not-found.html");
      }
      if (acceptHeader.includes("image")) {
        return caches.match("./img/imagen-no-encontrada.jpg");
      }
    });

  e.respondWith(respuesta);
});
