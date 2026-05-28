
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


// =====================================
// SOCKET IO
// =====================================

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

global.io = io;

const configureSocket =
  require('./socket');

configureSocket(io);