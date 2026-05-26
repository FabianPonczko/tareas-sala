const jwt =
  require('jsonwebtoken');


// =====================================
// MIDDLEWARE
// =====================================

const auth =
  (req, res, next) => {

    try {

      const token =
        req.header(
          'Authorization'
        )?.replace(
          'Bearer ',
          ''
        );

      if (!token) {
        return res
          .status(401)
          .json({
            message:
              'Token requerido',
          });
      }


      const decoded =
        jwt.verify(
          token,
          process.env
            .JWT_SECRET
        );

      req.user = decoded;

      next();

    } catch (error) {

      console.log(error);

      res.status(401).json({
        message:
          'Token inválido',
      });
    }
  };


// =====================================
// EXPORT
// =====================================

module.exports = auth;