const MensajeChat =
  require('../models/MensajeChat');


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
          })
          .sort({
            createdAt: 1,
          });

      res.json(mensajes);

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
        texto,
      } = req.body;

      const nuevoMensaje =
        await MensajeChat.create({
          tarea,

          texto,

          usuario:
            req.user.id,
        });

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

      await MensajeChat
        .findByIdAndDelete(
          req.params
            .mensajeId
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