'use strict';

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function (error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}

var myApp = {};
