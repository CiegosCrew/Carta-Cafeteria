const CACHE_NAME = 'photomarket-v1';
const urlsToCache = [
  '/Carta-Cafeteria/',
  '/Carta-Cafeteria/index.html',
  '/Carta-Cafeteria/fotografia.html',
  '/Carta-Cafeteria/admin-dashboard.html',
  '/Carta-Cafeteria/styles.css',
  '/Carta-Cafeteria/features.css',
  '/Carta-Cafeteria/admin-dashboard.css',
  '/Carta-Cafeteria/app.js',
  '/Carta-Cafeteria/features.js',
  '/Carta-Cafeteria/fotografia.js',
  '/Carta-Cafeteria/admin-dashboard.js',
  '/Carta-Cafeteria/data/menu.json'
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
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
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
