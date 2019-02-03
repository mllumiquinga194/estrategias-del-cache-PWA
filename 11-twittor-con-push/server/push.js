const fs = require('fs');
const urlSafeBase64 = require('urlsafe-base64');
const vapid = require('./vapid.json');
const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:mallth194@gmail.com',
    vapid.publicKey,
    vapid.privateKey
);

// para que sean persistentes las suscripciones que tengo. inicializo mi arreglo con la informacion del archivo.
// si por alguna razon elimino las suscripciones, el valor por defecto demi archivo sera un arreglo pero algo debe tener el archivo, asi sea vacio
let suscripciones = require('./subs-db.json');


module.exports.getKey = () => {
    // exporto mi publicKey como urlSafeBase64.decode(), asi no utilizara el cliente
    return urlSafeBase64.decode(vapid.publicKey);
};

// Guardo en mi arreglo de suscripciones las suscripciones que me van llegando
module.exports.addSubscription = (suscripcion) => {

    suscripciones.push(suscripcion);

    // Cada vez que yo guarde en mi arreglo de suscripciones asincronamente grabare en mi archivo subs-db.json que esta en la carpeta server.
    fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscripciones));

};

//el post es lo que yo quiero mandar a travez del push 
module.exports.sendPush = (post) => {

    console.log('Mandando Push');

    const notificacionesEnviadas = [];

    // con el i, indice mas adelante podré borrar las suscripciones que ya no necesite
    suscripciones.forEach((suscripcion, i) => {

        const pushProm = webpush.sendNotification(suscripcion, JSON.stringify(post))
            .then(console.log)
            .catch(err => {
                console.log('Notificacion Falló');

                if (err.statusCode === 410) { //Ya no existe esa suscripcion del lado del cliente
                    suscripciones[i].borrar = true;
                }
            });

        // Las añado a mi arreglo de suscripciones enviadas 
        notificacionesEnviadas.push(pushProm);
    });

    // Espero a que cada una de ellas termine
    Promise.all(notificacionesEnviadas)
        .then(() => {
            suscripciones = suscripciones.filter(subs => !subs.borrar);

            fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscripciones));

        });


};