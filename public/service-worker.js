const FILES_TO_CACHE = [
"/db.js",
"/index.html",
"/index.js",
"/style.css",
"/manifest.webmanifest",
"/service-worker.js"

];

const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "runtime-cache";

//install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
        .then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== STATIC_CACHE && key !==RUNTIME_CACHE) {
                        console.log("Dumping old cache data", key);
                        return caches.delete(key);
                }
        })
            );
    })
    );
    self.clients.claim();

});


//fetch 
self.addEventListener("fetch", function(event) {
    if (event.request.url.includes("/api/")) {
      event.respondWith(
        caches.open(RUNTIME_CACHE).then(cache => {
          return fetch(event.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(event.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }

 event.respondWith(
     caches.match(event.request).then(function (response) {
         return response || fetch(event.request);
        })
    );
});
        
             
