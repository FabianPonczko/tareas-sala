const mongoose = require('mongoose');

const saborSchema =
  new mongoose.Schema({
    nombre: {
      type: String,
      required: true,
      unique: true,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  });

module.exports = mongoose.model(
  'Sabor',
  saborSchema
);