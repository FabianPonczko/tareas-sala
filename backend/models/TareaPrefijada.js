const mongoose = require('mongoose');

const tareaPrefijadaSchema = new mongoose.Schema({
  sabor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sabor',
    required: true,
  },

  tanque: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tanque',
    required: true,
  },
  unidades: {
    type: Number,
    required: true,
  },

  disolutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disolutor',
    required: true,
  },
  

  activo: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model(
  'TareaPrefijada',
  tareaPrefijadaSchema
);