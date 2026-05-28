const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { Server } =
  require('socket.io');

const app = express();

app.use(cors());
app.use(express.json());

const server =
  http.createServer(app);

// =====================================
// ROUTES
// =====================================

const authRoutes =
  require('./routes/auth.routes');

const tareasRoutes =
  require('./routes/tareas.routes');

const chatRoutes =
  require('./routes/chat.routes');

const catalogosRoutes =
  require('./routes/catalogos.routes');

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

global.io = io;

io.on(
  'connection',
  (socket) => {
    console.log(
      'Cliente conectado'
    );

    socket.on(
      'disconnect',
      () => {
        console.log(
          'Cliente desconectado'
        );
      }
    );
  }
);



// Almacena los usuarios conectados (userId: socketId)
const usuariosConectados = new Map();

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // 1. Registrar al usuario cuando inicia sesión/se conecta
  socket.on('registrar_usuario', (userId) => {
    usuariosConectados.set(userId, socket.id);
    
    // Enviar lista actualizada a todos los clientes
    io.emit('usuarios_conectados', Array.from(usuariosConectados.keys()));
    console.log(`Usuario ${userId} registrado.`);
  });

  // 2. Manejar la desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    
    // Buscar y eliminar al usuario que correspondía a este socket
    for (let [userId, socketId] of usuariosConectados.entries()) {
      if (socketId === socket.id) {
        usuariosConectados.delete(userId);
        break;
      }
    }

    // Enviar lista actualizada a todos los clientes
    io.emit('usuarios_conectados', Array.from(usuariosConectados.keys()));
  });
});
//




app.use((err, req, res, next) => {
  console.error("🔥 ERROR GLOBAL:", err);
  res.status(500).json({
    message: "Error interno del servidor",
    error: err.message
  });
});


// =====================================
// ROUTES
// =====================================



app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/tareas',
  tareasRoutes
);

app.use(
  '/api/chat',
  chatRoutes
);

app.get('/', (req, res) => {
  res.send(
    'API funcionando'
  );
});

app.use(
  '/api/catalogos',
  catalogosRoutes
);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     server.listen(3000, () => console.log("Server en puerto 3000"));
//   });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    server.listen(3000, () =>
      console.log("Server en puerto 3000")
    );
  })
  .catch((err) => {
    console.error("❌ Error MongoDB:", err);
  });