// const MensajeChat =
//   require('../models/MensajeChat');


// // =====================================
// // OBTENER MENSAJES
// // =====================================

// const obtenerMensajes =
//   async (req, res) => {

//     try {

//       const mensajes =
//         await MensajeChat
//           .find({
//             tarea:
//               req.params
//                 .tareaId,
//           })
//           .sort({
//             createdAt: 1,
//           });

//       res.json(mensajes);

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         message:
//           'Error obteniendo mensajes',
//       });
//     }
//   };


// // =====================================
// // ENVIAR MENSAJE
// // =====================================

// const enviarMensaje =
//   async (req, res) => {

//     try {

//       const {
//         tarea,
//         texto,
//       } = req.body;

//       const nuevoMensaje =
//         await MensajeChat.create({
//           tarea,

//           texto,

//           usuario:
//             req.user.id,
//         });

//       res.status(201).json(
//         nuevoMensaje
//       );

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         message:
//           'Error enviando mensaje',
//       });
//     }
//   };


// // =====================================
// // ELIMINAR MENSAJE
// // =====================================

// const eliminarMensaje =
//   async (req, res) => {

//     try {

//       await MensajeChat
//         .findByIdAndDelete(
//           req.params
//             .mensajeId
//         );

//       res.json({
//         message:
//           'Mensaje eliminado',
//       });

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({
//         message:
//           'Error eliminando mensaje',
//       });
//     }
//   };


// // =====================================
// // EXPORTS
// // =====================================

// module.exports = {
//   obtenerMensajes,

//   enviarMensaje,

//   eliminarMensaje,
// };

const MensajeChat =
  require('../models/MensajeChat');

const Usuario =
  require('../models/Usuario');


// =====================================
// OBTENER MENSAJES
// =====================================

const obtenerMensajes =
  async (req, res) => {

    try {

      const mensajes =
        await MensajeChat
          .find({
            tarea:
              req.params
                .tareaId,

            eliminado: false,
          })
          .sort({
            createdAt: 1,
          });

      res.json(
        mensajes
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Error obteniendo mensajes',
      });
    }
  };


// =====================================
// ENVIAR MENSAJE
// =====================================

const enviarMensaje =
  async (req, res) => {

    try {

      const {
        tarea,
        mensaje,
      } = req.body;

      const usuario =
        await Usuario
          .findById(
            req.user.id
          );

      if (!usuario) {

        return res
          .status(404)
          .json({
            message:
              'Usuario no encontrado',
          });
      }

      const nuevoMensaje =
        await MensajeChat.create({

          tarea,

          mensaje,

          usuarioId:
            usuario._id,

          nombreUsuario:
            usuario.nombre,

          rolUsuario:
            usuario.rol,

          turno:
            usuario.turnoActual,
        });

      global.io
        .to(
          `task_${tarea}`
        )
        .emit(
          'nuevoMensaje',
          nuevoMensaje
        );
        
      global.io.emit(
          'mensajeNoLeido',
        {
          tareaId: tarea,
        }
        );

      res.status(201).json(
        nuevoMensaje
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Error enviando mensaje',
      });
    }
  };


// =====================================
// ELIMINAR MENSAJE
// =====================================

const eliminarMensaje =
  async (req, res) => {

    try {

      const mensaje =
        await MensajeChat
          .findByIdAndUpdate(
            req.params
              .mensajeId,
            {
              eliminado: true,
              eliminadoAt:
                new Date(),
            },
            {
              new: true,
            }
          );

      global.io.emit(
        'mensajeEliminado',
        {
          tareaId:
            mensaje.tarea,

          mensajeId:
            mensaje._id,
        }
      );

      res.json({
        message:
          'Mensaje eliminado',
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Error eliminando mensaje',
      });
    }
  };


// =====================================
// EXPORTS
// =====================================

module.exports = {

  obtenerMensajes,

  enviarMensaje,

  eliminarMensaje,
};