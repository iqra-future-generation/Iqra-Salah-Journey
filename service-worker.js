const CACHE_NAME = "iqra-v21-letters-past-days";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./favicon-64.png",
  "./iqra-logo.png",
  "./Salah-Tracker-Jungen.pdf",
  "./Salah-Tracker-Maedchen.pdf",
  "./A2CDCF3C-20F4-4A11-BFFC-277BAC953323.jpeg",
  "./824B99E3-92AB-447A-A7DF-1E09AA39543B.jpeg"
,
  "./letterpads/pad-school-kawaii.jpeg",
  "./letterpads/pad-happy-garden.jpeg",
  "./letterpads/pad-summer-beach.jpeg",
  "./letterpads/pad-islamic-pastel.jpeg",
  "./letterpads/pad-moon-garden.jpeg",
  "./letterpads/pad-school-adventure.jpeg",
  "./letterpads/pad-soft-moon.jpeg",
  "./letterpads/pad-blue-sky.jpeg",
  "./letterpads/pad-peach-floral.jpeg",
  "./letterpads/pad-flower-border.jpeg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
    )
  );
});
