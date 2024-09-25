const cacheName = 'quiz-pwa-v3';  // Updated cache version
const assetsToCache = [
  '/',                  // Cache the root directory
  '/index.html',         // Cache the homepage
  '/styles.css',         // Cache the styles
  '/app.js',             // Cache the main JavaScript file
  '/course.html',        // Cache the course page template
  '/course.js',          // Cache the course-specific JS file
  '/quiz.html',          // Cache the quiz page template
  '/quiz.js',            // Cache the quiz-specific JS file
  '/manifest.json',      // Cache the manifest
  '/assets/icon-192.png',// Cache the smaller icon
  '/assets/icon-512.png',// Cache the larger icon
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap', // Google Fonts
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css' // Font Awesome icons
];

// Install event: Cache the required assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();  // Activate the service worker immediately after installation
});

// Activate event: Clean up old caches if there are any
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            return caches.delete(cache);  // Remove old caches
          }
        })
      );
    })
  );
  self.clients.claim();  // Claim any open pages immediately
});

// Fetch event: Serve assets from cache or fall back to the network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return the cached version if available, otherwise fetch from the network
      return cachedResponse || fetch(event.request);
    })
  );
});
