self.addEventListener('install', function (event) {
    console.log('The service worker is being installed.');
    event.waitUntil(
        caches.open('to-do').then(function(cache) {
            return cache.addAll([
                '/index.html',
                '/favicon.ico',
                '/to-do.css',
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
    console.log('The service worker is serving the asset.');
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || caches.match('/index.html');
        })
    );
});