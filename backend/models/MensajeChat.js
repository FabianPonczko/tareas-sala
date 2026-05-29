const mongoose = require('mongoose');


// =====================================
// MODELO MENSAJES CHAT
// =====================================

const mensajeChatSchema =
  new mongoose.Schema(
    {
      // Tarea asociada
      tarea: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'TareaAsignada',

        required: true,
      },

      // Usuario autor
      usuarioId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'Usuario',

        required: true,
      },

      // Nombre cacheado
      // para evitar populate innecesario
      nombreUsuario: {
        type: String,

        required: true,

        trim: true,
      },

      // Rol cacheado
      rolUsuario: {
        type: String,

        enum: [
          'ADMIN',
          'OPERARIO',
        ],

        default: 'OPERARIO',
      },

      // Mensaje
      mensaje: {
        type: String,

        required: true,

        trim: true,

        maxlength: 1000,
      },

      // Turno del usuario
      turno: {
        type: String,

        enum: [
          'MAÑANA',
          'TARDE',
          'NOCHE',
        ],
      },

      // Usuarios que leyeron
      leidoPor: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: 'Usuario',
        },
      ],

      // Editado
      editado: {
        type: Boolean,

        default: false,
      },

      // Fecha edición
      editadoAt: {
        type: Date,
      },

      // Eliminación lógica
      eliminado: {
        type: Boolean,

        default: false,
      },

      eliminadoAt: {
        type: Date,
      },

      // Archivos futuros
      archivos: [
        {
          nombre: String,

          url: String,

          tipo: String,
        },
      ],
    },
    {
      timestamps: true,
    }
  );


// =====================================
// ÍNDICES
// =====================================

// Mejor rendimiento
mensajeChatSchema.index({
  tarea: 1,
  createdAt: 1,
});


// =====================================
// MÉTODOS
// =====================================

// Marcar editado
mensajeChatSchema.methods.marcarEditado =
  function () {
    this.editado = true;

    this.editadoAt =
      new Date();
  };


// =====================================
// EXPORT
// =====================================

module.exports = mongoose.model(
  'MensajeChat',
  mensajeChatSchema
);