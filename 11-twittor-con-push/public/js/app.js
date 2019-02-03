
var url = window.location.href;
var swLocation = '/twittor/sw.js';
var swReg; // Guarda el registro del SW

if (navigator.serviceWorker) {


    if (url.includes('localhost')) {
        swLocation = '/sw.js';
    }

    // Haremos el registro del SW una vez que la pagina esté completamente cargada
    window.addEventListener('load', function () {

        navigator.serviceWorker.register(swLocation)
            .then(function (reg) {

                swReg = reg;
                // una vez carga el navegador web, yo quiero confirmar si ya estoy suscrito a las notificaciones push.
                // swReg.pushManager.getSubscription() esto me retorna un objeto, ese objeto lo mando rirecto a verificaSuscrip
                swReg.pushManager.getSubscription().then(verificaSuscrip);
            });
    });

}

// Referencias de jQuery

var titulo = $('#titulo');
var nuevoBtn = $('#nuevo-btn');
var salirBtn = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn = $('#post-btn');
var avatarSel = $('#seleccion');
var timeline = $('#timeline');

var modal = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns = $('.seleccion-avatar');
var txtMensaje = $('#txtMensaje');

var btnActivadas = $('.btn-noti-activadas');
var btnDesactivadas = $('.btn-noti-desactivadas');

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;




// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje) {

    var content = `
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${ personaje}.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje}</h3>
                <br/>
                ${ mensaje}
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();

}



// Globals
function logIn(ingreso) {

    if (ingreso) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');

    }

}


// Seleccion de personaje
avatarBtns.on('click', function () {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function () {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function () {

    modal.removeClass('oculto');
    modal.animate({
        marginTop: '-=1000px',
        opacity: 1
    }, 200);

});


// Boton de cancelar mensaje
cancelarBtn.on('click', function () {
    if (!modal.hasClass('oculto')) {
        modal.animate({
            marginTop: '+=1000px',
            opacity: 0
        }, 200, function () {
            modal.addClass('oculto');
            txtMensaje.val('');
        });
    }
});

// Boton de enviar mensaje
postBtn.on('click', function () {

    var mensaje = txtMensaje.val();
    if (mensaje.length === 0) {
        cancelarBtn.click();
        return;
    }

    var data = {
        mensaje: mensaje,
        user: usuario
    };


    fetch('api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(res => console.log('app.js', res))
        .catch(err => console.log('app.js error:', err));



    crearMensajeHTML(mensaje, usuario);

});



// Obtener mensajes del servidor
function getMensajes() {

    fetch('api')
        .then(res => res.json())
        .then(posts => {

            console.log(posts);
            posts.forEach(post =>
                crearMensajeHTML(post.mensaje, post.user));
        });
}

getMensajes();

// Detectar cambios de conexion

function isOnline() {

    if (navigator.onLine) {
        // Conexion

        var myToast = mdtoast('Online.', { interaction: true, interactionTimeout: 3000, init: true, type: mdtoast.SUCCESS, actionText: 'Ok!!' });

        // Displays the toast
        myToast.show();

    } else {
        // sin conexion

        var myToast = mdtoast('Offline.', { interaction: true, init: true, type: mdtoast.ERROR, actionText: 'Ok!!' });

        // Displays the toast
        myToast.show();

    }
}

// Para estar pendiente de esta funcion
window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);

isOnline();

// Notificaciones
// Esta funcion se llama al inicio, despues que se carga toda la pagina, al registrar el SW
function verificaSuscrip(activadas) {

    if (activadas) {

        btnActivadas.removeClass('oculto');
        btnDesactivadas.addClass('oculto');
    } else {

        btnActivadas.addClass('oculto');
        btnDesactivadas.removeClass('oculto');
    }
}
// Notificaciones con Cuerpo. Ejemplo
function enviarNotificaciones() {

    const notificationOpt = {
        body: 'Cuerpo de la notificacion',
        icon: 'img/icons/icon-72x72.png'
    };

    const n = new Notification('Hola Mundo - ', notificationOpt);

    n.onclick = () => {
        console.log('Click');
    }
}
function notificarme() {

    // Preguntar si el navegador acepta notificaciones
    if (!window.Notification) {

        console.log('Este navegador no soporta notificaciones');
        return;

    }

    // Si ya se le preguntó anteriormente al usuario si desea recibir notificaciones
    if (Notification.permission === 'granted') {

        // new Notification('Hola mundo! - Granted');
        enviarNotificaciones();

        // Si no se ha negado o está por defecto
    } else if (Notification.permission !== 'denied' || Notification.permission === 'default') {

        Notification.requestPermission(function (permission) {

            console.log(permission);


            if (permission === 'granted') {

                // new Notification('Hola mundo! - Pregunta');
                enviarNotificaciones();
            }
        });
    }
}
// notificarme();

// Get Key

function getPublicKey() {

    // fetch('/api/key')
    //     .then(res => res.text())
    //     .then(console.log);

    return fetch('/api/key')
        // Asi lo utilizare
        .then(res => res.arrayBuffer())
        // REturn este arreglo pero como un UinitArray
        // Esto retorna una promesa
        .then(key => new Uint8Array(key));
}

// getPublicKey().then(console.log);


// Programamos el evento click del boton que activa la suscripcion
btnDesactivadas.on('click', function () {

    if (!swReg) return console.log('No hay registro de SW');

    getPublicKey().then(function (key) {

        // Del registro del SW me suscribo al pushManager con estas opciones necesarias
        swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key //KEY lo recibo del backend
        })
            .then(res => res.toJSON()) // Es necesario retornarlo asi
            .then(suscripcion => { //Recibo mi suscripcion y la mando como peticion post al servidor
                // En este punto tuve que ir al SW y configurar los fetch post para que no me los maneje como mensajes(guardar en base de datos y esas cosas)

                // Peticion POST a mi servidor con el suscripcion
                fetch('api/suscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(suscripcion)
                })
                    // Si todo sale bien, actualizo los botones :)
                    .then(verificaSuscrip)
                    // Si ocurre un error al suscribirme, simplemente llamo a cancelar suscripcion
                    .catch(cancelarSuscripcion)

            });

    });
});

// Para cancelar suscripcion
function cancelarSuscripcion() {

    // Obtenemos la suscripcion actual.
    swReg.pushManager.getSubscription()
        .then(subs => {

            // cuando ya la tenemos, cancelamos la suscripcion, eso devuelve una promesa y no me interesa, en ese punto lo que hago es mandar false a verificaSuscrip(false) para cambiar los botones
            subs.unsubscribe()
                .then(() => verificaSuscrip(false))
        });
}

// Para cancelar suscripcion

btnActivadas.on('click', function () {

    cancelarSuscripcion();
});