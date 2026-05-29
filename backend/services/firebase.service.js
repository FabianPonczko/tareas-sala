// // const admin = require(
// //   '../config/firebase'
// // );

// // const enviarPushGrupal =
// //   async ({
// //     tokens,
// //     titulo,
// //     mensaje,
// //     data = {},
// //   }) => {
// //     if (!tokens.length) return;

// //     const message = {
// //       notification: {
// //         title: titulo,
// //         body: mensaje,
// //       },

// //       data,

// //       tokens,
// //     };

// //     try {
// //       const response =
// //         await admin
// //           .messaging()
// //           .sendEachForMulticast(
// //             message
// //           );

// //       console.log(
// //         'Push enviados:',
// //         response.successCount
// //       );

// //       return response;
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// // module.exports = {
// //   enviarPushGrupal,
// // };

// const admin =
//   require('../config/firebase');

// const enviarPushGrupal =
//   async ({
//     tokens = [],
//     titulo,
//     mensaje,
//     data = {},
//   }) => {

//     if (!tokens.length) {
//       console.log(
//         '⚠️ Sin tokens'
//       );

//       return;
//     }

//     try {

//       const response =
//         await admin
//           .messaging()
//           .sendEachForMulticast({
//             notification: {
//               title: titulo,
//               body: mensaje,
//             },

//             data,

//             tokens,
//           });

//       console.log(
//         `✅ Push enviados: ${response.successCount}`
//       );

//       console.log(
//         `❌ Push fallidos: ${response.failureCount}`
//       );

//       response.responses.forEach(
//         (r, i) => {

//           if (!r.success) {

//             console.log(
//               `❌ Error token ${tokens[i]}`
//             );

//             console.log(
//               r.error
//             );
//           }
//         }
//       );

//       return response;

//     } catch (error) {

//       console.log(
//         '🔥 Firebase error'
//       );

//       console.log(error);
//     }
//   };

// module.exports = {
//   enviarPushGrupal,
// };
// el de arriba es para notivicaciones en android nativo no expo

const {
  Expo,
} = require('expo-server-sdk');

const expo =
  new Expo();

const enviarPushGrupal =
  async ({
    tokens,
    titulo,
    mensaje,
    data = {},
  }) => {

    try {

      const mensajes = [];

      for (const token of tokens) {

        if (
          !Expo.isExpoPushToken(
            token
          )
        ) {

          console.log(
            `❌ Token inválido ${token}`
          );

          continue;
        }

        mensajes.push({
          to: token,

          sound: 'default',

          title: titulo,

          body: mensaje,

          data,
        });
      }

      const chunks =
        expo.chunkPushNotifications(
          mensajes
        );

      const tickets = [];

      for (const chunk of chunks) {

        const ticketChunk =
          await expo.sendPushNotificationsAsync(
            chunk
          );

        tickets.push(
          ...ticketChunk
        );
      }

      console.log(
        '✅ Push enviados'
      );

      return tickets;

    } catch (error) {

      console.log(error);
    }
  };

module.exports = {
  enviarPushGrupal,
};