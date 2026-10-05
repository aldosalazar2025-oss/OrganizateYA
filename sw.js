/*======================================================
    TAREAS
    SERVICE WORKER
    Cachea el "app shell" para que la app cargue rápido
    y funcione sin conexión en Android. Los datos siguen
    yendo a Firebase por red cuando hay conexión.
======================================================*/

const CACHE_NAME = "tareas-shell-v1";

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/variables.css",
    "./css/style.css",
    "./css/components.css",
    "./css/modal.css",
    "./css/dashboard.css",
    "./css/responsive.css",
    "./css/settings-modern.css",
    "./css/auth.css",
    "./css/tema-global.css",
    "./css/enhanced-design.css",
    "./js/main.js",
    "./js/app.js",
    "./js/config/config.js",
    "./js/config/firebase-config.js",
    "./js/controllers/TaskController.js",
    "./js/models/Task.js",
    "./js/views/TaskView.js",
    "./js/components/CalendarView.js",
    "./js/components/Filters.js",
    "./js/components/HomeView.js",
    "./js/components/Modal.js",
    "./js/components/ProgressBar.js",
    "./js/services/AuthService.js",
    "./js/services/CloudSyncService.js",
    "./js/services/FirebaseService.js",
    "./js/services/StorageService.js",
    "./js/utils/CardGlow.js",
    "./js/utils/Helpers.js",
    "./js/utils/Validator.js",
    "./icon-192.png",
    "./icon-512.png",
    "./icon-maskable-512.png"
];

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            cache.addAll(APP_SHELL).catch(() => {
                // Si algún archivo falla, no bloquea la instalación
            })
        )
    );

    self.skipWaiting();

});

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );

    self.clients.claim();

});

self.addEventListener("fetch", event => {

    const { request } = event;

    // Solo interceptamos peticiones GET del mismo origen (no Firebase, CDNs, etc.)
    if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(request).then(cached => {

            const network = fetch(request)
                .then(response => {
                    if (response && response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => cached);

            return cached || network;

        })
    );

});
