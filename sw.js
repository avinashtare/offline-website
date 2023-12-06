// add here you offline required file to store in chache
const staticAssets = ["/", "/index.html", "/about.html", "/services.html", "/css/style.css", "/images/1.png","/js/script.js",""];
const CACHE_NAME = "static_cache_v1.0.0";

// Function to pre-cache static assets during service worker installation
async function preCache() {
    // Open the cache storage if exist then othe otherwise create
    const cache = await caches.open(CACHE_NAME);
    // Add static assets to the cache storage
    return cache.addAll(staticAssets);
}

// Event: Service worker installation
self.addEventListener("install", (event) => {
    console.log("SW installed");
    
    
    // Wait for the caching of static assets to complete before installation is considered complete
    event.waitUntil(preCache());

    // Skip waiting to activate the new service worker immediately
    self.skipWaiting();

});

// Function to handle fetching of assets, either from the network or from the cache
async function fetchAssets(event) {
    console.log("SW fetched")
    // Try to fetch the requested resource from the online server
    try {
        const response = await fetch(event.request);

        // Cache the latest request in the cache storage but it's also add all the request new that files
        // if you want to add new request files also you can comment this 
        // const cache = await caches.open(CACHE_NAME);
        // cache.put(event.request, response.clone());

        // Return the response from the online server
        return response;
    }
    catch (error) {
        // If the online server request fails, attempt to fetch from the local cache
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        // If the file exists in the cache, return it; otherwise, return a custom 404 response
        return cachedResponse || new Response("<h1>404 | page not found</h1>", { headers: { "Content-Type": "text/html" } });
    }
}

// Event: Intercepting fetch requests
self.addEventListener("fetch", (event) => {
    // Respond to fetch requests by either fetching from the online server or serving from the cache
    event.respondWith(fetchAssets(event));
});




// cleanup cache
const clearCache = async ()=>{
    const keys = await caches.keys()
    const keyToDelete = keys.map(key=>{
        if(key!==CACHE_NAME){
            return caches.delete(key)
        }
    });

    return Promise.all(keyToDelete)
}

// this is run for clear cache 
self.addEventListener("activate", (event) => {
    console.log("SW activated");
    event.waitUntil(clearCache())
});