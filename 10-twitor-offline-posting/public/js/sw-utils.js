

// Guardar  en el cache dinamico/static
function actualizaCacheDinamico(dynamicCache, req, res) {


    if (res.ok) {

        return caches.open(dynamicCache).then(cache => {

            cache.put(req, res.clone());

            return res.clone();

        });

    } else {
        return res;
    }

}

// Cache with network update
function actualizaCacheStatico(staticCache, req, APP_SHELL_INMUTABLE) {


    if (APP_SHELL_INMUTABLE.includes(req.url)) {
        // No hace falta actualizar el inmutable
        // console.log('existe en inmutable', req.url );

    } else {
        // console.log('actualizando', req.url );
        return fetch(req)
            .then(res => {
                return actualizaCacheDinamico(staticCache, req, res);
            });
    }



}

// Manejo de api mensajes
// Esta funcion será para el manejo de los mensajes con la estrategia: Network with cache fallback / update. update porque tambien actuaizaremos en cache

function manejoApiMensajes(cacheName, req) {

    // Ya que el cache no maneja el metodo postm entonces tengo que trabajarlo de forma diferente
    if (req.clone().method === 'POST') {
        // Posteo de nuevo mensaje
        // Para asegurarme que mi navegador utiliza sync. (self.register.sync), referencia al Sw
        if (self.registration.sync) {

            return req.clone().text()
                .then(body => {
                    // console.log(body);
                    const bodyObj = JSON.parse(body);
                    return guardarMensaje(bodyObj);
                });
            // Tengo que guardar en indexDB
        } else {

            // si no es soportado, la dejo pasar normalmente
            return fetch(req);
        }


    } else {

        return fetch(req)
            .then(res => {
                // Si lo hace correctamente, si trae bien los datos.
                if (res.ok) {
                    // Actualizo el cache dinamico para almacenar lo nuevo ahi!!
                    actualizaCacheDinamico(cacheName, req, res.clone());
                    return res.clone();
                } else {
                    // si la respuesta no es existosa por alguna razon, respondo con la informacion que tenga en cache
                    return caches.match(req);
                }
            })
            // En dado caso que no haya internet ni nada. respondo con la informacion que tenga en cache
            .catch(err => caches.match(req));
    }
}

