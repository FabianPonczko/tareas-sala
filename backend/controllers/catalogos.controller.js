const Sabor = require('../models/Sabor');
const Tanque = require('../models/Tanque');
const Disolutor = require('../models/Disolutor');

const obtenerCatalogos = async (req, res) => {
  try {
    const sabores = await Sabor.find({
      activo: true,
    });

    const tanques = await Tanque.find({
      activo: true,
    });

    const disolutores =
      await Disolutor.find({
        activo: true,
      });

    res.json({
      sabores,
      tanques,
      disolutores,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo catálogos',
    });
  }
};

module.exports = {
  obtenerCatalogos,
};