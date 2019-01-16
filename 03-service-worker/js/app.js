

// Detectar si podemos usar Service Workers
if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js')
    .then( reg => {
        // setTimeout(() => {
        //     reg.sync.register('Posteo-GAtitos');
        //     console.log('Se enviaron fotos de gatos al server');
        // }, 5000);
        Notification.requestPermission().then( result => {
    
            console.log( result );
            reg.showNotification('Hola Mundo!!!');
            
        });
    });

}



// fetch('https://reqres.in/api/users')
// .then( resp => resp.text())
// //como resp.json() es una promesa, puedo concatenas otro then. y el argumento que recibe ese nuevo then, lo imprimo en la consola
// .then( console.log );
