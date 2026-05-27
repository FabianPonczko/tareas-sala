const mongoose = require('mongoose');
require('dotenv').config();

const Sabor = require('./models/Sabor');
const Tanque = require('./models/Tanque');
const Disolutor = require('./models/Disolutor');

const seed = async () => {
  await mongoose.connect(
    process.env.MONGO_URI
  );

  await Sabor.deleteMany();
  await Tanque.deleteMany();
  await Disolutor.deleteMany();

  await Sabor.insertMany([
    {nombre:"Aq limonada"},
    {nombre:"Aq Manzana"},
    {nombre:"Aq Naranja."},
    {nombre:"Aq Pera."},
    {nombre:"Aq Pomelo."},
    {nombre:"Fanta Lim "},
    {nombre:"Fanta Pomelo"},
    {nombre:"FP Fenix"},
    {nombre:"FN Fenix "},
    {nombre:"Fanta Nja"},
    {nombre:"Fanta Chucky"},
    {nombre:"Fanta Uva"},
    {nombre:"Schwe Cit."},
    {nombre:"Schwe Ginger"},
    {nombre:"Schwe L. Limon"},
    {nombre:"Schwe Pomelo"},
    {nombre:"Sw Ton QU"},
    {nombre:"Sprite Fenix"},
    {nombre:"Aq citrus gas zero"},
    {nombre:"Aq limon zero gas"},
    {nombre:"CC MarshMello"},
    {nombre:"CCSA Sugar Move"},
    {nombre:"CCZ Kaizen"},
    {nombre:"CCZ Y3000"},
    {nombre:"COCA CAFÉ"},
    {nombre:"Coca Cola Byte"},
    {nombre:"Coca Zero Oreo"},
    {nombre:"Coca Light"},
    {nombre:"Crush Lim "},
    {nombre:"Crush Nar Zero"},
    {nombre:"Crush Pom zero"},
    {nombre:"Fan Nar Light"},
    {nombre:"Fanta N Zero"},
    {nombre:"FNZ Fenix "},
    {nombre:"Monster Green"},
    {nombre:"Monster Pipeline Punch"},
    {nombre:"Monster Mango Loco"},
    {nombre:"Monster pineapple"},
    {nombre:"Monster Rossi"},
    {nombre:"Monster Ultra Paradise"},
    {nombre:"Monster Ultra Sunrise"},
    {nombre:"Monster Ultra Zero"},
    {nombre:"Monster Water Melon"},
    {nombre:"Monster Green Zero"},
    {nombre:"Monster Peachy Keen"},
    {nombre:"Sch Pom SA"},
    {nombre:"Schw Gin Tonic"},
    {nombre:"Schw Vodka Citrus"},
    {nombre:"Sw Ton SA"},
    {nombre:"Sprite Zero Fenix"},
    {nombre:"Sprite Ice"},
    {nombre:"Aq Anana Zero"},
    {nombre:"TOPO CHICO LIMON"},
    {nombre:"TOPO CHICO PIÑA"},
    {nombre:"Fanta Carmesi"},
  ]);

  await Tanque.insertMany([
    { numero: '50' },
    { numero: '51' },
    { numero: '52' },
    { numero: '53' },
    { numero: '55' },
    { numero: '56' },
    { numero: '57' },
    { numero: '58' },
    { numero: '59' },

  ]);

  await Disolutor.insertMany([
    { numero: '1' },
    { numero: '2' },
    { numero: '3' },
  ]);

  console.log('SEED OK');

  process.exit();
};

seed();