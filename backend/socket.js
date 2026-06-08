const jwt = require('jsonwebtoken');


// =====================================
// SOCKET SERVER
// =====================================

const usuariosOnline =
  new Map();


const configureSocket = (
  io
) => {

  // =====================================
  // MIDDLEWARE AUTH
  // =====================================

  io.use(
    async (
      socket,
      next
    ) => {
      try {
        const token =
          socket.handshake
            .auth?.token;

        if (!token) {
          return next(
            new Error(
              'Token requerido'
            )
          );
        }

        const decoded =
          jwt.verify(
            token,
            process.env.JWT_SECRET
          );

        socket.usuario =
          decoded;

        next();
      } catch (error) {
        console.log(
          'Socket auth error:',
          error.message
        );

        next(
          new Error(
            'Token inválido'
          )
        );
      }
    }
  );


  // =====================================
  // CONNECTION
  // =====================================

  io.on(
    'connection',
    (socket) => {

      console.log(
        `✅ Usuario conectado: ${socket.id}`
      );

      console.log(
        `👤 Usuario: ${socket.usuario?.id}`
      );
      
      usuariosOnline.set(
        socket.usuario.id,
        {
          socketId:
            socket.id,

          _id:
            socket.usuario.id,

          nombre:
            socket.usuario.nombre,

          rol:
            socket.usuario.rol,

          turnoActual:
            socket.usuario.turnoActual,
        }
      );

      io.emit(
        'usuarios_conectados',
        Array.from(
          usuariosOnline.values()
        )
      );

      // =====================================
      // JOIN ROOM TAREA
      // =====================================

      socket.on(
        'joinTaskRoom',
        (
          tareaId
        ) => {

          socket.join(
            `task_${tareaId}`
          );

          console.log(
            `📌 ${socket.id} entró a room task_${tareaId}`
          );
        }
      );


      // =====================================
      // LEAVE ROOM TAREA
      // =====================================

      socket.on(
        'leaveTaskRoom',
        (
          tareaId
        ) => {

          socket.leave(
            `task_${tareaId}`
          );

          console.log(
            `🚪 ${socket.id} salió de room task_${tareaId}`
          );
        }
      );


      // =====================================
      // JOIN ROOM TURNO
      // =====================================

      socket.on(
        'joinShiftRoom',
        (
          turno
        ) => {

          socket.join(
            `shift_${turno}`
          );

          console.log(
            `🕒 ${socket.id} entró a shift_${turno}`
          );
        }
      );


      // =====================================
      // LEAVE ROOM TURNO
      // =====================================

      socket.on(
        'leaveShiftRoom',
        (
          turno
        ) => {

          socket.leave(
            `shift_${turno}`
          );

          console.log(
            `🚪 ${socket.id} salió de shift_${turno}`
          );
        }
      );


      // =====================================
      // MENSAJE CHAT
      // =====================================

      // socket.on(
      //   'mensajeChat',
      //   (
      //     data
      //   ) => {

      //     io.to(
      //       `task_${data.tareaId}`
      //     ).emit(
      //       'nuevoMensaje',
      //       data
      //     );
          
      //     //  io.emit(
      //     //   'mensajeNoLeido',
      //     //   {
      //     //     tareaId: data.tareaId,
      //     //   }
      //     // );
      //      socket.broadcast.emit(
      //         'mensajeNoLeido',
      //         {
      //           tareaId: data.tareaId,
      //         }
      //       );
      //   }
      // );


      // =====================================
      // NUEVA TAREA
      // =====================================

      socket.on(
        'nuevaTarea',
        (
          tarea
        ) => {

          io.to(
            `shift_${tarea.turno}`
          ).emit(
            'nuevaTarea',
            tarea
          );
        }
      );


      // =====================================
      // ESTADO ACTUALIZADO
      // =====================================

      socket.on(
        'estadoActualizado',
        (
          tarea
        ) => {

          io.to(
            `task_${tarea._id}`
          ).emit(
            'estadoActualizado',
            tarea
          );

          io.to(
            `shift_${tarea.turno}`
          ).emit(
            'estadoActualizado',
            tarea
          );
        }
      );


      // =====================================
      // MENSAJE ELIMINADO
      // =====================================

      socket.on(
        'mensajeEliminado',
        ({
          tareaId,
          mensajeId,
        }) => {

          io.to(
            `task_${tareaId}`
          ).emit(
            'mensajeEliminado',
            {
              mensajeId,
            }
          );
        }
      );


      // =====================================
      // TYPING
      // =====================================

      socket.on(
        'typing',
        ({
          tareaId,
          usuario,
        }) => {

          socket.to(
            `task_${tareaId}`
          ).emit(
            'typing',
            usuario
          );
        }
      );


      // =====================================
      // STOP TYPING
      // =====================================

      socket.on(
        'stopTyping',
        (
          tareaId
        ) => {

          socket.to(
            `task_${tareaId}`
          ).emit(
            'stopTyping'
          );
        }
      );


      // =====================================
      // DISCONNECT
      // =====================================

     socket.on(
      'disconnect',
      (reason) => {

        console.log(
          `❌ Usuario desconectado: ${socket.id}`
        );

        console.log(
          'Reason:',
          reason
        );

        usuariosOnline.delete(
          socket.usuario.id
        );

        io.emit(
          'usuarios_conectados',
          Array.from(
            usuariosOnline.values()
          )
        );
      }
    );
    }
  );
};


// =====================================
// EXPORT
// =====================================

module.exports =
  configureSocket;