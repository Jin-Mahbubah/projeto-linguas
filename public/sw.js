const CACHE_NAME = 'extrator-offline-v1';

// Lista de tudo o que o telemóvel deve guardar na memória
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/@phosphor-icons/web',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Tajawal:wght@400;500;700&display=swap'
];

// Quando a App é instalada, guarda tudo
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Quando não há internet, o telemóvel vai buscar à memória (Cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devolve a versão guardada na memória se existir, senão vai à internet
        return response || fetch(event.request);
      })
  );
});
