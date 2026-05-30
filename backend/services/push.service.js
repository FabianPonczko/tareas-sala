const { Expo } =
  require('expo-server-sdk');

const expo =
  new Expo();

const enviarPushGrupal =
  async ({
    tokens,
    titulo,
    mensaje,
    data = {},
  }) => {

    const messages =
      tokens
        .filter(
          token =>
            Expo.isExpoPushToken(
              token
            )
        )
        .map(
          token => ({
            to: token,
            sound:
              'default',
            title:
              titulo,
            body:
              mensaje,
            data,
          })
        );

    const chunks =
      expo.chunkPushNotifications(
        messages
      );

    for (
      const chunk
      of chunks
    ) {

      try {

        const tickets =
          await expo
            .sendPushNotificationsAsync(
              chunk
            );

        console.log(
          'Tickets:',
          tickets
        );

      } catch (error) {

        console.log(
          error
        );
      }
    }
  };

module.exports = {
  enviarPushGrupal,
};