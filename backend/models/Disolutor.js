const mongoose = require('mongoose');

const disolutorSchema =
  new mongoose.Schema({
    nombre: {
      type: String,
      required: true,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  });

module.exports = mongoose.model(
  'Disolutor',
  disolutorSchema
);