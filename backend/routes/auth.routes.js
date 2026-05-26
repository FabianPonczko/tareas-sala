const express =
  require('express');

const router =
  express.Router();

const authController =
  require('../controllers/auth.controller');

const auth =
  require('../middleware/auth');


// =====================================
// REGISTER
// =====================================

router.post(
  '/register',
  authController.register
);


// =====================================
// LOGIN
// =====================================

router.post(
  '/login',
  authController.login
);


// =====================================
// PERFIL
// =====================================

router.get(
  '/me',
  auth,
  authController.me
);


// =====================================
// PUSH TOKEN
// =====================================

router.post(
  '/push-token',
  auth,
  authController.guardarPushToken
);


// =====================================
// ACTUALIZAR TURNO
// =====================================

router.put(
  '/turno',
  auth,
  authController.actualizarTurno
);


// =====================================
// EXPORT
// =====================================

module.exports =
  router;