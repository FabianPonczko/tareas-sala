const bcrypt =
  require('bcryptjs');

const jwt =
  require('jsonwebtoken');

const Usuario =
  require('../models/Usuario');


// =====================================
// REGISTER
// =====================================

const register =
  async (req, res) => {

    try {

      const {
        nombre,
        email,
        password,
        turnoActual,
      } = req.body;


      const existe =
        await Usuario.findOne({
          email,
        });

      if (existe) {
        return res
          .status(400)
          .json({
            message:
              'Usuario ya existe',
          });
      }


      const salt =
        await bcrypt.genSalt(
          10
        );

      const hashedPassword =
        await bcrypt.hash(
          password,
          salt
        );


      const usuario =
        await Usuario.create({
          nombre,

          email,

          password:
            hashedPassword,

          turnoActual:
            turnoActual ||
            'MANANA',

          rol:
            'OPERARIO',
        });


      const token =
        jwt.sign(
          {
            id:
              usuario._id,
          },

          process.env
            .JWT_SECRET,

          {
            expiresIn:
              '7d',
          }
        );


      res.status(201).json({
        token,

        usuario,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Error servidor',
      });
    }
  };


// =====================================
// LOGIN
// =====================================

const login =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      const usuario =
        await Usuario.findOne({
          email,
        });

      if (!usuario) {
        return res
          .status(400)
          .json({
            message:
              'Usuario no existe',
          });
      }


      const match =
        await bcrypt.compare(
          password,
          usuario.password
        );

      if (!match) {
        return res
          .status(400)
          .json({
            message:
              'Contraseña incorrecta',
          });
      }


      const token =
        jwt.sign(
          {
            id:
              usuario._id,
          },

          process.env
            .JWT_SECRET,

          {
            expiresIn:
              '7d',
          }
        );


      res.json({
        token,

        usuario,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Error servidor',
      });
    }
  };


// =====================================
// PERFIL
// =====================================

const me =
  async (req, res) => {

    try {

      const usuario =
        await Usuario
          .findById(
            req.user.id
          )
          .select(
            '-password'
          );

      res.json(usuario);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Error servidor',
      });
    }
  };


// =====================================
// PUSH TOKEN
// =====================================

const guardarPushToken =
  async (req, res) => {

    try {

      const {
        pushToken,
      } = req.body;

      await Usuario
        .findByIdAndUpdate(
          req.user.id,
          {
            pushToken,
          }
        );

      res.json({
        message:
          'Push token guardado',
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Error servidor',
      });
    }
  };


// =====================================
// TURNO
// =====================================

const actualizarTurno =
  async (req, res) => {

    try {

      const {
        turnoActual,
      } = req.body;

      const usuario =
        await Usuario
          .findByIdAndUpdate(
            req.user.id,

            {
              turnoActual,
            },

            {
              new: true,
            }
          );

      res.json(usuario);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Error servidor',
      });
    }
  };


// =====================================
// EXPORTS
// =====================================

module.exports = {
  register,

  login,

  me,

  guardarPushToken,

  actualizarTurno,
};