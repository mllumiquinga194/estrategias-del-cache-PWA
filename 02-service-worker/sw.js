self.addEventListener('fetch', event => {

    const resp = fetch(event.request)
    // Como es una sola linea, esa contiene el return
                    .then( resp => resp.ok? resp : fetch('img/main.jpg'));

                    // .then(resp => { 

                        //  puedo retornar cualquiera de estas opciones :) incluso la primera

                        // if (resp.ok) {
                        //     return resp;
                        // } else {
                        //     return fetch('img/main.jpg');
                        // }

                        // if (resp.ok) return resp; else return fetch('img/main.jpg');

                        // return resp.ok? resp : fetch('img/main.jpg');
                    // });

    event.respondWith( resp );
});