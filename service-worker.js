const CACHE_VERSION = 'v3';
const CACHE_NAME = `photomarket-${CACHE_VERSION}`;

// Pre-cache sólo el shell básico; el resto se cachea dinámicamente
const urlsToCache = [
  '/Carta-Cafeteria/',
  '/Carta-Cafeteria/index.html',
  '/Carta-Cafeteria/styles.css',
  '/Carta-Cafeteria/icons.css',
  '/Carta-Cafeteria/app.js',
  '/Carta-Cafeteria/features.js',
  '/Carta-Cafeteria/advanced-features-extended.js',
  '/Carta-Cafeteria/user-system.js',
  '/Carta-Cafeteria/translations.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Activar SW nuevo inmediatamente
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
// Estrategia: network-first para HTML/CSS/JS del propio sitio; fallback a cache
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const isSameOrigin = request.url.includes('/Carta-Cafeteria/');
  if (!isSameOrigin) return;

  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        const cloned = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Tomar control de las páginas abiertas
  self.clients.claim();
});

// Push notification event
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'PHOTOMARKET';
  const options = {
    body: data.message || 'Nueva notificación',
    icon: '/Carta-Cafeteria/icon-192.png',
    badge: '/Carta-Cafeteria/icon-192.png',
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      { action: 'open', title: 'Ver' },
      { action: 'close', title: 'Cerrar' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/Carta-Cafeteria/')
    );
  }
});
