const mongoose = require('mongoose');

const tanqueSchema =
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
  'Tanque',
  tanqueSchema
);