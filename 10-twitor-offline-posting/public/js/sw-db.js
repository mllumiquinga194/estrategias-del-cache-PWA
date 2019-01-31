// Utilidades para guardar en el indexedDB

const db = new PouchDB('mensajes');

function guardarMensaje(mensaje) {
    mensaje._id = new Date().toISOString(); //le agrego un id a ese mensaje

    // Guardar en DB
    return db.put(mensaje)
        .then(() => {

            // hay una nueva tarea por hacer. y esa tarea se llama nuevo-post
            self.registration.sync.register('nuevo-post');

            const newResp = {
                ok: true,
                offline: true
            };

            return new Response(JSON.stringify(newResp));
        });
}

// Postear mensajes a la API
// Esta funcion se ejecuta cuando haya internet, se llama desde el SW self.addEventListener( 'sync', e => { ... }
function postearMensajes() {

    return db.allDocs({ include_docs: true }).then(docs => {

        // Arreglo de posteos
        const posteos = [];

        // Recorro mi base de datos
        docs.rows.forEach(row => {

            // obtengo los documentos
            const doc = row.doc;
            // posteo al api los mensajes que estan ubicados en doc
            // Guardo cada peticion en fetchProm, puede ser un msj o varios
            const fetchProm = fetch('/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(doc)
            }).then(res => {
                // Al llegar hasta aqui significa que tuve exito, de no tener exito, el sync volveria a intentarlo
                // la respuesta no me interesa sino que
                // Remuevo de la base de datos ese documento
                return db.remove(doc);
            });

            // Los agrego a mi arroglo de posteos
            posteos.push( fetchProm );

        });// FIn del forEach

        // retorno una vez que todos teminen
        return Promise.all( posteos );

    });
}