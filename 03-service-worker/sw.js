
// Ciclo de vida del SW

// El INSTALL del SW se va a disparar cada vez que haya un nuevo cambio en el SW. si le SW es el mismo, El INSTALL no se ejecuta
self.addEventListener('install', event => {

    // Descargar assets
    // Creamos un caché
    console.log('SW: Instalando SW!!');

    // Para activar directamente el SW nuevo
    // No lo usaremos así porque puede ser que algun usuario esté usando ese SW o esperando alguna informacion y si lo activamos directamente se perdera esa informacion, no es un error pero no es algo bueno, mejor es esperar a que el usuario cierre la aplicacion para que el nuevo SW se active
    // self.skipWaiting();

    const instalaciones = new Promise((resolve, reject) => {

        setTimeout(() => {
            console.log('Instalaciones Terminadas!!');
            self.skipWaiting();
            resolve();
        }, 1);

    });

    //Espera hasta que temine todas las instalaciones! Todos los eventos son PROMESAS
    event.waitUntil(instalaciones);


});

// cuando el SW se activa. Toma control de la aplicacion!

self.addEventListener('activate', event => {
    // Quiere ecir que el viejo SW se murio por lo tanto borramos todos los caches que ese SW manejaba.
    // Borrar cache viejo

    console.log('SW2: ACtivo y listo para controlar la Aplicacion');

});

// FETCH: Manejo de peticiones HTTP
self.addEventListener('fetch', event => {

    // Aplicar estrategias del cache
    // console.log('SW:', event.request.url);

    // // intercepto esa peticion

    // if (event.request.url.includes('https://reqres.in/')) {

    //     const resp = new Response(`{ ok: false, mensaje: 'jajaja' }`);

    //     event.respondWith(resp);
    // }

});

//  SYNC: Cuando recuperamos la conexion a internet
self.addEventListener('sync', event => {

    console.log('Tenemos Conexion!');
    console.log(event);
    console.log(event.tag);
    
});

// Push: manejar las push notificaciones
self.addEventListener('push', event => {

    console.log('Notificacion Recibida');
    
});