// const TareaAsignada = require('../models/TareaAsignada');
// const TareaPrefijada = require('../models/TareaPrefijada');
// const Usuario = require('../models/Usuario');

// // =====================
// // PREFIJADAS
// // =====================
// const obtenerTareasPrefijadas = async (req, res) => {
//   try {
//     const tareas = await TareaPrefijada.find();
//     res.json(tareas);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // =====================
// // ASIGNADAS
// // =====================
// const obtenerTareasAsignadas = async (req, res) => {
//   try {
//     const tareas = await TareaAsignada.find()
//       .populate('tarea');

//     res.json(tareas);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // =====================
// // CREAR ASIGNADA
// // =====================
// const crearTareaAsignada = async (req, res) => {
//   try {
//     const { tareaId, turno, fecha } = req.body;

//     const prefijada = await TareaPrefijada.findById(tareaId);

//     if (!prefijada) {
//       return res.status(404).json({ message: 'Tarea prefijada no existe' });
//     }

//     const nueva = await TareaAsignada.create({
//       tarea: tareaId,
//       turno,
//       fecha,
//       estado: 'PENDIENTE',
//     });

//     // usuarios del turno
//     const usuarios = await Usuario.find({ turnoActual: turno });

//     const tokens = usuarios
//       .map(u => u.pushToken)
//       .filter(Boolean);

//     global.io.emit('nuevaTarea', nueva);

//     res.json(nueva);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // =====================
// // ACTUALIZAR ESTADO
// // =====================

const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;

    const tarea = await TareaAsignada.findByIdAndUpdate(
  req.params.id,
  {
    estado,
    actualizadoPor: req.user.id,
  },
  { new: true }
      )
      .populate({
        path: 'tarea',
        populate: [
          {
            path: 'tanque',
          }, 
          {
            path: 'unidades',
          },
          {
            path: 'disolutor',
          },
          {
            path: 'sabor',
          },
        ],
      });

    global.io.emit('estadoActualizado', tarea);

    res.json(tarea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // =====================
// // ACTUALIZAR SAP
// // =====================
const actualizarSap = async (req, res) => {
  try {
    const { sap } = req.body;

    const tarea = await TareaAsignada.findByIdAndUpdate(
  req.params.id,
  {
    sap,
    actualizadoPor: req.user.id,
  },
  { new: true }
      )
      .populate({
        path: 'tarea',
        populate: [
          {
            path: 'tanque',
          }, 
          {
            path: 'unidades',
          },
          {
            path: 'disolutor',
          },
          {
            path: 'sabor',
          },
        ],
      });

    global.io.emit('sapActualizado', tarea);

    res.json(tarea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// module.exports = {
//   obtenerTareasAsignadas,
//   crearTareaAsignada,
//   actualizarEstado,
//   obtenerTareasPrefijadas,
// };
const TareaAsignada = require(
  '../models/TareaAsignada'
);

const TareaPrefijada = require(
  '../models/TareaPrefijada'
);

const {
  enviarPushGrupal,
} = require(
  '../services/push.service.js'
);

const Usuario =
  require('../models/Usuario');

const MensajeChat = require('../models/MensajeChat.js')

const crearTarea = async (req, res) => {
  try {
    let {
      sabor,
      tanque,
      unidades,
      disolutor,
      turno,
      fecha,
    } = req.body;
    
    unidades = Number(unidades)

    // Buscar combinación existente
    let tareaPrefijada =
      await TareaPrefijada.findOne({
        sabor,
        tanque,
        unidades,
        disolutor,
      });

    // Crear si no existe
    if (!tareaPrefijada) {
      tareaPrefijada =
        await TareaPrefijada.create({
          sabor,
          tanque,
          unidades,
          disolutor,
        });
    }

    // Crear tarea asignada
    const tareaAsignada =
      await TareaAsignada.create({
        tarea:
          tareaPrefijada._id,

        turno,
        fecha,
      });

    const populated =
      await TareaAsignada.findById(
        tareaAsignada._id
      ).populate({
        path: 'tarea',
        populate: [
          {
            path: 'sabor',
          },
          {
            path: 'tanque',
          },
          {
            path: 'unidades',
          },
          {
            path: 'disolutor',
          },
        ],
      });

    global.io.emit(
      'nuevaTarea',
      populated
    );


    // crear tarea... y push notificaciones

      const usuarios =
        await Usuario.find({
          turnoActual: turno,
        });

      const tokens =
        usuarios
          .map(u => u.pushToken)
          .filter(Boolean);

      await enviarPushGrupal({
        tokens,
        titulo:
          'Sala de bebidas Informa',
        mensaje:
          'Se creó una nueva tarea',
           data: {
              tareaId: populated._id.toString(),
           },
          
      });

    res.json(populated);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Error creando tarea',
    });
  }
};

// const obtenerTareas =
//   async (req, res) => {
//     try {
//       const tareas =
//         await TareaAsignada.find()
//           .populate({
//             path: 'tarea',
//             populate: [
//               {
//                 path: 'sabor',
//               },
//               {
//                 path: 'tanque',
//               },
//               {
//                 path: 'unidades',
//               },
//               {
//                 path: 'disolutor',
//               },
//             ],
//           })
//           .sort({
//             createdAt: -1,
//           });

//       res.json(tareas);
//     } catch (error) {
//       res.status(500).json({
//         message: 'Error obteniendo tareas',
//       });
//     }
//   };

  const obtenerTareas = async (req, res) => {
  try {

    const tareas =
      await TareaAsignada.find()
        .populate({
          path: 'tarea',
          populate: [
            { path: 'sabor' },
            { path: 'tanque' },
            { path: 'unidades' },
            { path: 'disolutor' },
          ],
        })
        .sort({
          createdAt: -1,
        });

    const tareasConContador =
      await Promise.all(

        tareas.map(
          async tarea => {

            const noLeidos =
              await MensajeChat.countDocuments({

                tarea: tarea._id,

                eliminado: false,

                usuarioId: {
                  $ne: req.user.id
                },

                leidoPor: {
                  $ne: req.user.id
                }
              });

            return {
              ...tarea.toObject(),

              mensajesPendientes:
                noLeidos
            };
          }
        )
      );

    res.json(
      tareasConContador
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        'Error obteniendo tareas',
    });
  }
};

  // =====================================
// OBTENER TAREAS ACTIVAS
// =====================================

const obtenerTareasActivas =
  async (req, res) => {

    try {

      const tareas =
        await TareaAsignada.find({
          estado: {
            $ne: 'FINALIZADO',
          },
        })
          .populate({
            path: 'tarea',
            populate: [
              {
                path: 'sabor',
              },
              {
                path: 'tanque',
              },
              {
              path: 'unidades',
              },
              {
                path: 'disolutor',
              },
            ],
          })
          .sort({
            createdAt: -1,
          });

      res.json(tareas);

    } catch (error) {

      res.status(500).json({
        message:
          'Error obteniendo tareas activas',
      });
    }
  };
module.exports = {
  crearTarea,
  obtenerTareas,
  actualizarEstado,
  actualizarSap,
  obtenerTareasActivas,
};