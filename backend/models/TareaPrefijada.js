const mongoose = require('mongoose');

const tareaPrefijadaSchema =
  new mongoose.Schema({
    productoTrabajo: String,

    ubicacionTanque: String,

    equipoMaquina: String,
  });

module.exports = mongoose.model(
  'TareaPrefijada',
  tareaPrefijadaSchema
);