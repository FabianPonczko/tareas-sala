const admin = require(
  '../config/firebase'
);

const enviarPushGrupal =
  async ({
    tokens,
    titulo,
    mensaje,
    data = {},
  }) => {
    if (!tokens.length) return;

    const message = {
      notification: {
        title: titulo,
        body: mensaje,
      },

      data,

      tokens,
    };

    try {
      const response =
        await admin
          .messaging()
          .sendEachForMulticast(
            message
          );

      console.log(
        'Push enviados:',
        response.successCount
      );

      return response;
    } catch (error) {
      console.log(error);
    }
  };

module.exports = {
  enviarPushGrupal,
};