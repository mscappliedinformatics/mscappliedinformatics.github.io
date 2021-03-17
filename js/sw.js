self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                '/favicon.ico',
                '/to-do.css',
                '/to-do.html',
                '/manifest.json',
                '/assets/close.svg',
                '/assets/complete.svg',
                '/assets/delete.svg',
                '/assets/downArrow.svg',
                '/assets/edit.svg',
                '/assets/logo.svg',
                '/assets/reactivate.svg',
                '/assets/SourceSansPro.ttf',
                '/assets/upArrow.svg',
                '/js/common.js',
                '/js/controller.js',
                '/js/model.js',
                '/js/myApp.js',
                '/js/pubSub.js',
                '/js/view.js'
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith( caches.match(event.request) );
});
