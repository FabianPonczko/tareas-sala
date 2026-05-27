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

const crearTarea = async (req, res) => {
  try {
    const {
      sabor,
      tanque,
      disolutor,
      turno,
      fecha,
    } = req.body;

    // Buscar combinación existente
    let tareaPrefijada =
      await TareaPrefijada.findOne({
        sabor,
        tanque,
        disolutor,
      });

    // Crear si no existe
    if (!tareaPrefijada) {
      tareaPrefijada =
        await TareaPrefijada.create({
          sabor,
          tanque,
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
            path: 'disolutor',
          },
        ],
      });

    global.io.emit(
      'nuevaTarea',
      populated
    );

    res.json(populated);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Error creando tarea',
    });
  }
};

const obtenerTareas =
  async (req, res) => {
    try {
      const tareas =
        await TareaAsignada.find()
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
        message: 'Error obteniendo tareas',
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
  obtenerTareasActivas,
};