const mongoose = require('mongoose');
require('dotenv').config();

const TareaPrefijada = require('./models/TareaPrefijada');

// =====================================
// DATA DE EJEMPLO
// =====================================

const tareas = [
    {
        productoTrabajo: 'Coca cola Zero',
        ubicacionTanque: 'Tanque D50',
        equipoMaquina: 'Disolutor 1',
    },
    {
        productoTrabajo: 'Sprite Fenix',
        ubicacionTanque: 'Tanque D51',
        equipoMaquina: 'Disolutor 2',
    },
    {
        productoTrabajo: 'Fanta naranja Fenix',
        ubicacionTanque: 'Tanque D52',
        equipoMaquina: 'Disolutor 3',
    }
    
];

// =====================================
// CONEXIÓN + SEED
// =====================================

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ Conectado a MongoDB');

    // Limpia colección antes de insertar (evita duplicados)
    await TareaPrefijada.deleteMany();

    console.log('🧹 Colección limpiada');

    // Inserta datos
    await TareaPrefijada.insertMany(tareas);

    console.log('🌱 Tareas prefijadas cargadas correctamente');

    process.exit();
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seed();