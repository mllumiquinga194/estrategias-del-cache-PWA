const CACHE_STATIC_MANE = 'static-v2';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';
const CACHE_DYNAMIC_LIMIT = 50; //Limite para el cache

function limpiarCahe(cacheName, numeroItems) {

    caches.open(cacheName)
        .then(cache => {

            return cache.keys()
                .then(keys => {
                    // si tengo mas keys en el cache que el permitido
                    if (keys.length > numeroItems) {
                        // borro la posicion 0 y llamo nuevamente esta funcion. esto se hará hasta que no hayan mas keys en el cache que el permitido
                        cache.delete(keys[0])
                            .then(limpiarCahe(cacheName, numeroItems));
                    }
                });
        });
}

self.addEventListener('install', e => {
    // Para abrir un cache con nombre CACHE_NAME y guardar ahi mi APP SHELL, o sea, los archivos necesarios para que mi app funcione
    const cacheStatic = caches.open(CACHE_STATIC_MANE)
        .then(cache => {

            // Coloco aquí este return porque cache.addAll() retorna una promesa y yo necesito mandar una promesa en e.waitUntil(), o sea le mando cacheProm porque al hacer el return, guardo el retorno de esa cache.addAll en cacheProm.
            // Debo agregar en el cache tambien ese '/' para que no me de error cuando yo consulto mi aplicacion desde http://localhost:8080 con la estrategia CACHE ONLY.

            // Para abrir un cache con nombre CACHE_STATIC_MANE y guardar ahi mi APP SHELL, o sea, los archivos necesarios para que mi app funcione
            return cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
                '/js/app.js',
                '/img/no-img.jpg',
            ]);
        });

    const cacheDynamic = caches.open(CACHE_INMUTABLE_NAME)
        .then(cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'));

    // Para esperar que guarde todo en cache antes de continuar con otro evento 
    // Espero que terminen todas las promesas Promise.all([cacheStatic, cacheDynamic])
    e.waitUntil(Promise.all([cacheStatic, cacheDynamic]));
});

// Las estrategias del cache las utilizo en mi evento FETCH
self.addEventListener('fetch', e => {
    // ------------------------------------------------------------------------------------------------------------------------------
    // 5- cache & network race. Busca en internet y en cache a ver cualresponde primero

    const respuesta = new Promise((resolve, reject) => {

        let rechazada = false;

        const falloUnaVez = () => {
            if (rechazada) {
                // Si llego hasta aqui significa que ya las dos peticiones fallaron porque rechazada ya es verdadera. Entonces tengo la opcion de consultar si en la request es una imagen. si es imagen yo puedo devolver algo que ya tenga en cache. sino, entonces efectivamente disparo el reject()
                if( /\.(png|jpg)$/i.test( e.request.url ) ){
                    resolve( caches.match('/img/no-img.jpg') );
                }else{
                    reject('No se encontró Respuesta');
                }

            } else {
                rechazada = true;
            }
        };

        // Pongo a competir las dos peticiones, tanto al network como al cache. la que responda primero estara bien. si alguna falla llamo a falloUnaVez()
        fetch(e.request).then(res => {
            res.ok ? resolve(res) : falloUnaVez();
        }).catch(falloUnaVez);

        caches.match(e.request).then(res => {
            res ? resolve(res) : falloUnaVez();
        }).catch(falloUnaVez);

    });

    e.respondWith(respuesta);
    // ------------------------------------------------------------------------------------------------------------------------------
    // 4- Cache with network update. rendimiento critico

    // Abre el cache CACHE_STATIC_MANE, donde estan los archivos mas importantes para que la aplicacion funcione. una vez que abras ese cache, retorna lo que coincida con la peticion que se está realizando que está en e.request. Con el fetch estoy buscando en internet la informacion nueva y la coloco en cache para que en la proxima peticion a sta misma pagina, o al refrescar la pagina, obtener las ultimas actualizaciones. este fetch se hace en el background

    // si en el request tengo algo del bootstrap, lo traigo desde el cache.
    // if (e.request.url.includes('bootstrap')) {

    //     return e.respondWith(caches.match(e.request));
    // }

    // // pero si tengo otras cosas que no sea del bootstrap lo retorno del cache y busco de internet para actualizar cache
    // const respuesta = caches.open(CACHE_STATIC_MANE)
    //     .then(cache => {

    //         fetch(e.request).then(newResp => cache.put(e.request, newResp));

    //         return cache.match(e.request);
    //     });

    // e.respondWith(respuesta);


    // ------------------------------------------------------------------------------------------------------------------------------
    // 3- Network with cache fallback, primero ir a internet, si consigue lo que necesita, muestralo
    // realizo la request a internet primero, 
    // const respuesta = fetch(e.request)
    //     .then(res => {

    //         // En dado caso que la respuesta no exista, hare un return desde el cache
    //         if( !res ) return caches.match(e.request);

    //         // si lo obtengo lo guardo en cache
    //         caches.open(CACHE_DYNAMIC_NAME)
    //             .then(cache => {
    //                 cache.put(e.request, res);
    //                 // Limito mi cache.
    //                 limpiarCahe(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
    //             });
    //         return res.clone();
    //     })
    //     .catch(err => {

    //         //en dado caso que haya algun error buscando en internet, lo que tengo que haces el buscar esa request en el cache.
    //         return caches.match(e.request);
    //     })

    // e.respondWith( respuesta );

    // ------------------------------------------------------------------------------------------------------------------------------
    // 2- Cache with network Fallback. Consulta primero al cache a ver si está lo que yo necesito, si no, me voy a la red
    // const respuesta = caches.match(e.request)
    //     .then(res => {
    //         // Si la respuesta existe en cache, eso es lo que mandaré en el e.respondWith() y ya :)
    //         if (res) return res;

    //         // En este punto no existe el archivo, entonces tendria que irme a la web con el fecth()
    //         console.log('No existe en cache', e.request.url);

    //         return fetch(e.request)
    //             // agrego los archivos obtenidos desde la web al cache para que al reargar, los tome desde el cache
    //             .then(newResp => {

    //                 caches.open(CACHE_DYNAMIC_NAME)
    //                     .then(cache => {

    //                         // Actualizo el cache con la nueva informacion. e.request es la peticion que se hizo, newResp es la nueva informacion
    //                         cache.put(e.request, newResp);

    //                         // Despues que yo actualizo mi cache, es un buen momento para limpiarlo                            
    //                         limpiarCahe(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
    //                     });

    //                 // clono la respuesta ya que en este tipo de funciones, solo la puedo usar una vez. lo hago para evitar errores
    //                 return newResp.clone();
    //             });


    //     });

    // e.respondWith(respuesta);
    // ------------------------------------------------------------------------------------------------------------------------------
    // 1- Cache Only: Esta es usada cuando queremos que toda la aplicacion sea servida solamente desde el cache. es decir, no va a haber peticion que acceda a la web, Todo sale del cache

    // El caches.match() se va a  todos los caches que esten en este mismo dominio, en este caso, localhost:8080 y va a buscar y retornar uno que coincida con el e.request. o sea con la peticion que estoy haciendo. en pocas palabras, yo intercepto el request que estoy haciendo mediante el fetch y busco eso mismo pero en mi cache
    // e.respondWith(caches.match(e.request));

});