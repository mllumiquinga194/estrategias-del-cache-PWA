// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();
const push = require('./push');


const mensajes = [

  {
    _id: 'XXX',
    user: 'spiderman',
    mensaje: 'Hola Mundo'
  }

];


// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
  res.json(mensajes);
});


// Post mensaje
router.post('/', function (req, res) {

  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user
  };

  mensajes.push(mensaje);

  console.log(mensajes);


  res.json({
    ok: true,
    mensaje
  });
});

// Almacenar la suscription que los clientes mandan. tlefonos o dispositivos
router.post('/suscribe', (req, res) => {

  const suscripcion = req.body;

  push.addSubscription(suscripcion);

  res.json('suscribe');
});

// Key publico manda el key publico a los clientes para que ellos lo procecen para luego envien la suscripcion
router.get('/key', (req, res) => {

  const key = push.getKey();
  // Ya no tengo que mandarla como JSON() porque yo usare esta resopuesta como un arrayUinit entonces lo mando como send nada mas
  // res.json(key);
  res.send(key);
});

// Enviar notificacion PUSH a las personas que nosotros querramos.
// esto no se maneja como un servicio rest, esto se maneja del lado del cliente
router.post('/push', (req, res) => {

  const post = {
    titulo: req.body.titulo,
    cuerpo: req.body.cuerpo,
    usuario: req.body.usuario
  };

  push.sendPush(post);

  res.json(post);
});



module.exports = router;