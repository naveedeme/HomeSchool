const CACHE_NAME = "homeschool-static-v4";
const APP_SHELL = [
  "./css/app.css",
  "./HomeSchool.html",
  "./img/grade-5/science/human-body-systems/Circulatory_System.webp",
  "./img/grade-5/science/human-body-systems/digestive-system.jpg",
  "./img/grade-5/science/human-body-systems/human-circulatory-system-detail.jpg",
  "./img/grade-5/science/human-body-systems/human-circulatory-system.jpg",
  "./img/grade-5/science/human-body-systems/respiration-process-2-1.jpg",
  "./img/grade-5/science/human-body-systems/respiratory-system.png",
  "./img/pwa/icon-maskable.svg",
  "./img/pwa/icon.svg",
  "./index.html",
  "./js/app.bundle.js",
  "./js/app.js",
  "./js/data-version.js",
  "./js/data/bootstrap.js",
  "./js/data/english/adjectives.js",
  "./js/data/english/adverb-phrases.js",
  "./js/data/english/adverbs.js",
  "./js/data/english/collective-nouns.js",
  "./js/data/english/conjunctions.js",
  "./js/data/english/grade-1.js",
  "./js/data/english/grade-10.js",
  "./js/data/english/grade-2.js",
  "./js/data/english/grade-3.js",
  "./js/data/english/grade-4.js",
  "./js/data/english/grade-5.js",
  "./js/data/english/grade-6.js",
  "./js/data/english/grade-7.js",
  "./js/data/english/grade-8.js",
  "./js/data/english/grade-9.js",
  "./js/data/english/opposites.js",
  "./js/data/english/prepositions.js",
  "./js/data/english/pronouns.js",
  "./js/data/english/quizzes.js",
  "./js/data/english/sentences.js",
  "./js/data/english/tenses.js",
  "./js/data/english/verbs.js",
  "./js/data/english/vocabulary.js",
  "./js/data/index.js",
  "./js/data/math/grade-1.js",
  "./js/data/math/grade-10.js",
  "./js/data/math/grade-2.js",
  "./js/data/math/grade-3.js",
  "./js/data/math/grade-4.js",
  "./js/data/math/grade-5.js",
  "./js/data/math/grade-6.js",
  "./js/data/math/grade-7.js",
  "./js/data/math/grade-8.js",
  "./js/data/math/grade-9.js",
  "./js/data/math/quizzes.js",
  "./js/data/meta.js",
  "./js/data/science/grade-1.js",
  "./js/data/science/grade-10.js",
  "./js/data/science/grade-2.js",
  "./js/data/science/grade-3.js",
  "./js/data/science/grade-4.js",
  "./js/data/science/grade-5.js",
  "./js/data/science/grade-6.js",
  "./js/data/science/grade-7.js",
  "./js/data/science/grade-8.js",
  "./js/data/science/grade-9.js",
  "./js/data/science/quizzes.js",
  "./js/data/social/grade-1.js",
  "./js/data/social/grade-10.js",
  "./js/data/social/grade-2.js",
  "./js/data/social/grade-3.js",
  "./js/data/social/grade-4.js",
  "./js/data/social/grade-5.js",
  "./js/data/social/grade-6.js",
  "./js/data/social/grade-7.js",
  "./js/data/social/grade-8.js",
  "./js/data/social/grade-9.js",
  "./js/data/social/quizzes.js",
  "./js/data/urdu/grade-1.js",
  "./js/data/urdu/grade-10.js",
  "./js/data/urdu/grade-2.js",
  "./js/data/urdu/grade-3.js",
  "./js/data/urdu/grade-4.js",
  "./js/data/urdu/grade-5.js",
  "./js/data/urdu/grade-6.js",
  "./js/data/urdu/grade-7.js",
  "./js/data/urdu/grade-8.js",
  "./js/data/urdu/grade-9.js",
  "./js/data/urdu/quizzes.js",
  "./js/data/version.js",
  "./js/db.js",
  "./js/settings/SettingsPanel.js",
  "./js/utils.js",
  "./manifest.webmanifest",
  "./vendor/dexie.min.js",
  "./vendor/react-dom.production.min.js",
  "./vendor/react.production.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const failures = [];

    await Promise.all(APP_SHELL.map(async (path) => {
      try {
        const response = await fetch(path, { cache: "no-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        await cache.put(path, response);
      } catch (error) {
        failures.push({ path, error: String(error?.message || error) });
      }
    }));

    if (failures.length) {
      console.warn("[HomeSchool SW] Some assets were not precached.", failures);
    }

    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  const isAppShellAsset = event.request.mode === "navigate"
    || /\.(?:js|css|html|webmanifest)$/i.test(requestUrl.pathname);

  if (isAppShellAsset) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || !response.ok) throw new Error(`HTTP ${response?.status || "network"}`);
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || (event.request.mode === "navigate" ? caches.match("./index.html") : null);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
