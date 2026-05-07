/**
 * Service Worker - Financeiro Pro
 * Versão: 1.0.0
 */

const CACHE_NAME = 'financeiro-pro-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Evento de Instalação: Guarda os ficheiros na cache
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberta: a guardar recursos do sistema');
      return cache.addAll(urlsToCache);
    })
  );
});

// Evento de Ativação: Limpa versões antigas da cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('A remover cache antiga:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento de Fetch: Tenta carregar da internet; se falhar, usa a cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
