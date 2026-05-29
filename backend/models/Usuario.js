const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },

    email: String,

    password: String,

    rol: {
      type: String,
      enum: [
        'ADMIN',
        'OPERARIO',
      ],
      default: 'OPERARIO',
    },

    turnoActual: {
      type: String,
      enum: [
        'MAÑANA',
        'TARDE',
        'NOCHE',
      ],
    },

    pushToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'Usuario',
  usuarioSchema
);