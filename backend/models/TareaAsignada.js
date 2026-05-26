const mongoose = require('mongoose');

const tareaAsignadaSchema =
  new mongoose.Schema(
    {
      tarea: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'TareaPrefijada',
      },

      turno: {
        type: String,
        enum: [
          'MANANA',
          'TARDE',
          'NOCHE',
        ],
      },

      fecha: Date,

      estado: {
        type: String,
        enum: [
          'PENDIENTE',
          'LEIDO',
          'ACEPTADO',
        ],
        default: 'PENDIENTE',
      },

      actualizadoPor: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  'TareaAsignada',
  tareaAsignadaSchema
);