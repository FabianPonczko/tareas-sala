const express = require('express');

const auth =
  require('../middleware/auth');

  const router =
  express.Router();

const {
  crearTarea,
  obtenerTareas,
  actualizarEstado,
   obtenerTareasActivas,
   actualizarSap,
  // crearTareaAsignada,
  // obtenerTareasAsignadas,
  // obtenerTareasPrefijadas,
  
} = require(
  '../controllers/tareas.controller'
);

router.get(
  '/',auth,
  obtenerTareas
);

router.get(
  '/activas',
  obtenerTareasActivas
);


router.post(
  '/',
  crearTarea
);

router.put(
  '/:id/estado',
  auth,
  actualizarEstado
);

router.put(
  '/:id/sap',
  auth,
  actualizarSap
);
// router.get('/prefijadas', obtenerTareasPrefijadas);


// router.get(
//   '/activas',
//   auth,
//   async (req, res) => {

//     try {

//       const tareas =
//         await Tarea.find({
//           finalizada: false,
//         })
//           .populate('sabor')
//           .populate('tanque')
//           .populate('disolutor')
//           .sort({
//             createdAt: -1,
//           });

//       res.json(tareas);

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         message:
//           'Error obteniendo tareas activas',
//       });
//     }
//   }
// );

module.exports = router;