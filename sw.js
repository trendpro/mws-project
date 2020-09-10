self.addEventListener("install", () => {
  console.log("SW Installed");
});

self.addEventListener("activate", () => {
  console.log("SW Activated");
});

const staticAssets = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/weather.js",
  "./images",
];
self.addEventListener("install", async (event) => {
  const cache = await caches.open("weather-assets");
  cache.addAll("staticAssets");
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function networkFirst(req) {
  const cache = await caches.open("news-articles");
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}
