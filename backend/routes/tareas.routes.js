const express = require('express');

const auth =
  require('../middleware/auth');

  const router =
  express.Router();

const {
  crearTareaAsignada,
  actualizarEstado,
  obtenerTareasAsignadas,
  obtenerTareasPrefijadas,
} = require(
  '../controllers/tareas.controller'
);

router.get(
  '/',auth,
     obtenerTareasAsignadas,
);

router.post(
  '/',
  crearTareaAsignada
);

router.put(
  '/:id/estado',
  actualizarEstado
);
router.get('/prefijadas', obtenerTareasPrefijadas);

module.exports = router;