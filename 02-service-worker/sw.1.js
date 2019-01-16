self.addEventListener('fetch', event => {

    // si el event incluye estas propiedades "request.url" y en esa url (como es un string), con es6 puedo consultar si contiene "style.css" respondo NULL, simulando que no encontro el archivo.
    // if( event.request.url.includes('style.css') ){

    //     let respuesta = new Response(`
    //         body {
    //             background-color: red !important;
    //             color: pink;
    //         }
    //     `, {
    //         headers: {
    //             'Content-Type': 'text/css'
    //         }
    //     });

    //     event.respondWith( respuesta );
    // }


    if( event.request.url.includes('.jpg') ){
        console.log( event.request.url );
        
        // let fotoReq = fetch('img/main.jpg');
        // let fotoReq = fetch( event.request.url );
        let fotoReq = fetch( 'img/main-patas-arriba.jpg' );
        
        event.respondWith( fotoReq );
        // event.respondWith( null );
    }
    
});