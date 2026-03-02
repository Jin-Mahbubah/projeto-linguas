// ARQUIVO SW.JS "ASSASSINO" DE CACHE (LIMPEZA TOTAL)
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força a atualização imediata no telemóvel da pessoa
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomesDasCaches) => {
      // Apaga absolutamente todas as memórias guardadas da App antiga
      return Promise.all(nomesDasCaches.map((cache) => {
        return caches.delete(cache); 
      }));
    }).then(() => {
      // O Service Worker comete "suicídio" (desinstala-se sozinho)
      return self.registration.unregister(); 
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Ignora o offline e força a ir sempre buscar à internet (Render)
  event.respondWith(fetch(event.request));
});
