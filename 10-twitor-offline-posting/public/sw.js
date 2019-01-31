// Referencia al PouchDB
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js');

// imports
importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js',
    'https://cdn.jsdelivr.net/gh/dmuy/Material-Toast/mdtoast.min.css',
    'https://cdn.jsdelivr.net/gh/dmuy/Material-Toast/mdtoast.min.js'
];



self.addEventListener('install', e => {


    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));



    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }

            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil(respuesta);

});




self.addEventListener('fetch', e => {

    let respuesta;

    // Cuando se hace alguna peticion que contenga api en su url. (peticiones para mensajes)
    if (e.request.url.includes('/api')) {

        // Ahora implementamos CACHE WITH NETWORK UPDATE
        respuesta = manejoApiMensajes(DYNAMIC_CACHE, e.request);

    } else {
        // Si no hay nada que contenga '/api', entonces seguimos trabajando nromalmente con nuestra estategia 
        // Cache with network update
        respuesta = caches.match(e.request).then(res => {


            // Si la respuesta existe en cache, retorna esa respuesta
            if (res) {

                actualizaCacheStatico(STATIC_CACHE, e.request, APP_SHELL_INMUTABLE);
                return res;
            } else {

                return fetch(e.request).then(newRes => {

                    return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

                });

            }

        });
    }



    e.respondWith(respuesta);

});

// Tareas Asincronas

self.addEventListener( 'sync', e => {
    console.log('SW: Sync');

    if(e.tag === 'nuevo-post'){
        // Postear a dB cuando haya conexion
        const respuesta = postearMensajes();
        e.waitUntil( respuesta );
    }

});


