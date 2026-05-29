// // const mongoose = require('mongoose');

// // const tareaAsignadaSchema =
// //   new mongoose.Schema(
// //     {
// //       tarea: {
// //         type:
// //           mongoose.Schema.Types.ObjectId,
// //         ref: 'TareaPrefijada',
// //       },

// //       turno: {
// //         type: String,
// //         enum: [
// //           'MANANA',
// //           'TARDE',
// //           'NOCHE',
// //         ],
// //       },

// //       fecha: Date,

// //       estado: {
// //         type: String,
// //         enum: [
// //           'PENDIENTE',
// //           'LEIDO',
// //           'ACEPTADO',
// //           'FINALIZADO',
// //         ],
// //         default: 'PENDIENTE',
// //       },

// //       actualizadoPor: {
// //         type:
// //           mongoose.Schema.Types.ObjectId,
// //         ref: 'Usuario',
// //       },
// //     },
// //     {
// //       timestamps: true,
// //     }
// //   );

// // module.exports = mongoose.model(
// //   'TareaAsignada',
// //   tareaAsignadaSchema
// // );

// const mongoose =
//   require('mongoose');

// const tareaAsignadaSchema =
//   new mongoose.Schema(
//     {

//       sabor: {
//         type:
//           mongoose.Schema.Types.ObjectId,
//         ref: 'Sabor',
//         required: true,
//       },

//       tanque: {
//         type:
//           mongoose.Schema.Types.ObjectId,
//         ref: 'Tanque',
//         required: true,
//       },

//       disolutor: {
//         type:
//           mongoose.Schema.Types.ObjectId,
//         ref: 'Disolutor',
//         required: true,
//       },

//       turno: {
//         type: String,
//         enum: [
//           'MANANA',
//           'TARDE',
//           'NOCHE',
//         ],
//         required: true,
//       },

//       fecha: {
//         type: Date,
//         required: true,
//       },

//       estado: {
//         type: String,
//         enum: [
//           'PENDIENTE',
//           'LEIDO',
//           'ACEPTADO',
//           'FINALIZADO',
//         ],
//         default:
//           'PENDIENTE',
//       },

//       finalizada: {
//         type: Boolean,
//         default: false,
//       },

//       fechaFinalizacion: {
//         type: Date,
//       },

//       actualizadoPor: {
//         type:
//           mongoose.Schema.Types.ObjectId,
//         ref: 'Usuario',
//       },

//     },
//     {
//       timestamps: true,
//     }
//   );

// module.exports =
//   mongoose.model(
//     'TareaAsignada',
//     tareaAsignadaSchema
//   );

const mongoose =
  require('mongoose');

const tareaAsignadaSchema =
  new mongoose.Schema(
    {
      tarea: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref:
          'TareaPrefijada',
        required: true,
      },

      turno: {
        type: String,
        enum: [
          'MAÑANA',
          'TARDE',
          'NOCHE',
        ],
        required: true,
      },

      fecha: {
        type: Date,
        required: true,
      },

      estado: {
        type: String,
        enum: [
          'PENDIENTE',
          'LEIDO',
          'ACEPTADO',
          'FINALIZADO',
        ],
        default:
          'PENDIENTE',
      },

      finalizada: {
        type: Boolean,
        default: false,
      },

      fechaFinalizacion: {
        type: Date,
      },

      actualizadoPor: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    'TareaAsignada',
    tareaAsignadaSchema
  );