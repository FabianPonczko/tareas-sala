const TareaAsignada = require('../models/TareaAsignada');
const TareaPrefijada = require('../models/TareaPrefijada');
const Usuario = require('../models/Usuario');

// =====================
// PREFIJADAS
// =====================
const obtenerTareasPrefijadas = async (req, res) => {
  try {
    const tareas = await TareaPrefijada.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// ASIGNADAS
// =====================
const obtenerTareasAsignadas = async (req, res) => {
  try {
    const tareas = await TareaAsignada.find()
      .populate('tarea');

    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// CREAR ASIGNADA
// =====================
const crearTareaAsignada = async (req, res) => {
  try {
    const { tareaId, turno, fecha } = req.body;

    const prefijada = await TareaPrefijada.findById(tareaId);

    if (!prefijada) {
      return res.status(404).json({ message: 'Tarea prefijada no existe' });
    }

    const nueva = await TareaAsignada.create({
      tarea: tareaId,
      turno,
      fecha,
      estado: 'PENDIENTE',
    });

    // usuarios del turno
    const usuarios = await Usuario.find({ turnoActual: turno });

    const tokens = usuarios
      .map(u => u.pushToken)
      .filter(Boolean);

    global.io.emit('nuevaTarea', nueva);

    res.json(nueva);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// ACTUALIZAR ESTADO
// =====================
const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;

    const tarea = await TareaAsignada.findByIdAndUpdate(
      req.params.id,
      {
        estado,
        actualizadoPor: req.user.id,
      },
      { new: true }
    ).populate('tarea');

    global.io.emit('estadoActualizado', tarea);

    res.json(tarea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  obtenerTareasAsignadas,
  crearTareaAsignada,
  actualizarEstado,
  obtenerTareasPrefijadas,
};