const mongoose = require('mongoose');

const unidadesSchema =
  new mongoose.Schema({
    nombre: {
      type: Number,
      required: true,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  });

module.exports = mongoose.model(
  'Unidades',
  unidadesSchema
);