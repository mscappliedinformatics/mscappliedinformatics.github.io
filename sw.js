self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                '/to-do.html',
                '/to-do.css',
                '/to-do.js',
                '/favicon.ico',
                '/assets/close.svg',
                '/assets/complete.svg',
                '/assets/delete.svg',
                '/assets/downArrow.svg',
                '/assets/edit.svg',
                '/assets/logo.svg',
                '/assets/reactivate.svg',
                '/assets/SourceSansPro.ttf',
                '/assets/upArrow.svg'
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith( caches.match(event.request) );
});
