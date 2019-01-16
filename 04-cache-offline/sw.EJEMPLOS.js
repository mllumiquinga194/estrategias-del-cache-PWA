self.addEventListener('fetch', event => {

    // const offLineResp = new Response(`
    //     Bienvenido a mi Pag Web!!

    //     Para usarla necesitas estar conectado a Internet!!
    // `);

    // El response necesita recibir unos header para saber que tipo de respuesta es. JSON, TEXT, HTML....
    // const offLineResp = new Response(`
    //     <!DOCTYPE html>
    //     <html lang="en">
    //     <head>
    //         <meta charset="UTF-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <meta http-equiv="X-UA-Compatible" content="ie=edge">
    //         <title>Mi PWA</title>
    //     </head>
    //     <body class="container p-3">
    //         <h1>Offline Mode</h1>
    //     </body>
    //     </html>
    // `, {
    //     headers:{
    //         'Content-Type': 'text/html'
    //     }
    // });

    //en modo offline no puedo hacer esto porque el fetch hace la peticion a travez del http y en modo offline, el http esta bloqueado.
    const offLineResp = fetch('pages/offline.html');


    // Con este codigo lo que estoy haciendo es, para cada peticion fetch que se haga, responda con esa misma peticion que se está pidiendo pero en ese caso sera el serviceWorker quien hara la peticion
    const resp = fetch(event.request)
        .catch(() => offLineResp); // En dado caso que la peticion falle

    event.respondWith(resp);
});