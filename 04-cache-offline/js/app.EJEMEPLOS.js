

if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js');
}

//  Para saber si el navegador soporta caches
if( window.caches ) {

    // Ve al cache e intenta abrir algo llamado 'prueba-1', si no existe, crealo!!
    caches.open('prueba-1');
    caches.open('prueba-2');
    //  Para consultar por la existencia de un cache. esto regresa una promesa
    // caches.has('prueba-2').then( console.log );
    // Para borrar del cache
    // caches.delete('prueba-1').then( console.log );
    caches.open('cache-v1.1').then( cache => {

        //leo un archivo y lo almaceno en cache.
        // cache.add('/index.html');

        // almacena en cache todo lo que especifiquemos en el arreglo. esta funcion es un poco lenta y da tiempo a que cache.delete('/css/style.css'); se ejecute sin exito. entonces para estar seguros de borrar algo en este ejemplo, es hacerlo despues que realmente se haya agregado a mi cache. cache.addAll() es una promesa, en su then() puedo colocar el borrado
        cache.addAll([
            '/index.html',
            '/css/style.css',
            'img/main.jpg'
        ]).then( () => {

            //Para borrar algo del cache
            // cache.delete('/css/style.css');

            // este ejemplo lo colocamos aqui para asegurar que se ejecute una vez que se hayan cargados los archivos en cache.
            cache.put('index.html', new Response('Hola Mundo!!!'));
            
        });

        //Para leer algo del cache.
        // cache.match('/index.html')
        //     .then( resp => {

        //         resp.text().then( console.log )
        //     });

        // para traerme todo el cache. en este ejemplo, el argumento que estoy recibiendo en el then(), lo imprimo por consola inmeditamente, ES6 PAPA... OJO ES CON S, CACHES
        caches.keys().then( console.log );

    });
    
}