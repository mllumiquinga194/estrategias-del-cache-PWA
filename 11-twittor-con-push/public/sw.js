// imports
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js')

importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v2';
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

    if (e.request.url.includes('/api')) {

        // return respuesta????
        respuesta = manejoApiMensajes(DYNAMIC_CACHE, e.request);

    } else {

        respuesta = caches.match(e.request).then(res => {

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


// tareas asíncronas
self.addEventListener('sync', e => {

    console.log('SW: Sync');

    if (e.tag === 'nuevo-post') {

        // postear a BD cuando hay conexión
        const respuesta = postearMensajes();

        e.waitUntil(respuesta);
    }



});

// Escuchar PUSH
self.addEventListener('push', e => {

    const data = JSON.parse(e.data.text());

    const title = data.titulo;
    const options = {
        body: data.cuerpo,
        // icon: 'img/icons/icon-72x72.png'
        icon: `img/avatars/${data.usuario}.jpg`,
        badge: 'img/favicon.ico',
        image: 'https://datainfox.com/wp-content/uploads/2017/10/avengers-tower.jpg',
        vibrate: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600],
        openUrl: '/',
        data: {
            // url: 'www.google.co.ve',
            url: '/',
            id: data.usuario
        },
        actions: [{
            action: 'Thor-Action',
            title: 'Thor',
            icon: 'img/avatars/thor.jpg'
        },
        {
            action: 'IronMan-Action',
            title: 'Ironman',
            icon: 'img/avatars/ironman.jpg'
        }
        ]
    };



    e.waitUntil(self.registration.showNotification(title, options));

});

// Cuando se cierra la notificacion
self.addEventListener('notificationclose', e => {
    console.log('Notificacion Cerrada', e);
});

// Cuando se hace click sobre la notificacion
// La notificacio viene en el evento e. en e ya tenemos referencias a todoas las opciones de la notificacion
self.addEventListener('notificationclick', e => {

    const notificacion = e.notification;
    const accion = e.accion;

    // utilizando destructuracion de datos
    console.log({ notificacion, accion });

    // Para agarrar todas las pestañas que esten abiertas del mismo sitio
    const resp = clients.matchAll()
        // clientes es un arreglo de todas las pestañas que tengo abiertas con mi aplicacion, si no hay ninguna abierta, regreso un arreglo vacio o undefined
        .then(clientes => {

            // Busco el cliente que se encuentra visible
            let cliente = clientes.find(c => {
                return c.visibilityState === 'visible';
            }); 
                 
            // let cliente = clientes.find(c => c.url.includes('localhost'));

            // Si consigo al menos un cliente visible
            if (cliente !== undefined) {
                // entonces navego ese cliente a la pantalla que yo quiero
                cliente.navigate(notificacion.data.url);
                // y le pongo el foco para que ese tag sea el activo en el navegador
                cliente.focus();
            } else {
                // si no hay ninguna vemntana abierta o el navegador esta cerrado entonces abro la aplicacion
                // clients es un objeto que hace referencia a todas las pestañas del navegador que esten abiertos!!
                clients.openWindow(notificacion.data.url);
            }

            // en el momento que se llame esta funcion, se cierra la notiicaicon
            return notificacion.close();
        });

    e.waitUntil(resp);
});