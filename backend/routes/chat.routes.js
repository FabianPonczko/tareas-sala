const express =
  require('express');

const router =
  express.Router();

const auth =
  require('../middleware/auth');

const chatController =
  require('../controllers/chat.controller');


// =====================================
// OBTENER MENSAJES
// =====================================

router.get(
  '/:tareaId',
  auth,
  chatController.obtenerMensajes
);


// =====================================
// ENVIAR MENSAJE
// =====================================

router.post(
  '/',
  auth,
  chatController.enviarMensaje
);


// =====================================
// ELIMINAR MENSAJE
// =====================================

router.delete(
  '/:mensajeId',
  auth,
  chatController.eliminarMensaje
);


// =====================================
// EXPORT
// =====================================

module.exports =
  router;