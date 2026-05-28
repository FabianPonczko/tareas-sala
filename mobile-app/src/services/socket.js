import { io } from 'socket.io-client';


// =====================================
// URL BACKEND
// =====================================

// Cambiar por IP local
// Ejemplo:
// http://192.168.0.15:3000

const SOCKET_URL =
  'https://tareas-sala.onrender.com';


// =====================================
// SOCKET INSTANCE
// =====================================

export const socket = io(
  SOCKET_URL,
  {
    transports: [
      'websocket',
    ],

    autoConnect: false,

    reconnection: true,

    reconnectionAttempts: 20,

    reconnectionDelay: 1000,

    timeout: 15000,
  }
);


// =====================================
// CONECTAR SOCKET
// =====================================

export const connectSocket =
  (token) => {

    // Auth JWT socket
    socket.auth = {
      token,
    };

    if (
      !socket.connected
    ) {
      socket.connect();
    }
  };


// =====================================
// DESCONECTAR SOCKET
// =====================================

export const disconnectSocket =
  () => {
    if (
      socket.connected
    ) {
      socket.disconnect();
    }
  };


// =====================================
// JOIN ROOM TAREA
// =====================================

export const joinTaskRoom =
  (taskId) => {
    socket.emit(
      'joinTaskRoom',
      taskId
    );
  };


// =====================================
// LEAVE ROOM TAREA
// =====================================

export const leaveTaskRoom =
  (taskId) => {
    socket.emit(
      'leaveTaskRoom',
      taskId
    );
  };


// =====================================
// EVENTOS GENERALES
// =====================================

socket.on(
  'connect',
  () => {
    console.log(
      '✅ Socket conectado:',
      socket.id
    );
  }
);

socket.on(
  'disconnect',
  (reason) => {
    console.log(
      '❌ Socket desconectado:',
      reason
    );
  }
);

socket.on(
  'connect_error',
  (error) => {
    console.log(
      '⚠️ Error socket:',
      error.message
    );
  }
);

socket.on(
  'reconnect',
  (attempt) => {
    console.log(
      '🔄 Reconectado:',
      attempt
    );
  }
);

socket.on(
  'reconnect_attempt',
  (attempt) => {
    console.log(
      '🔄 Intentando reconectar:',
      attempt
    );
  }
);


// =====================================
// EXPORT DEFAULT
// =====================================

// este para el front
// 1. Conectar al servidor
// const socket = io('http://localhost:3000');

// 2. Enviar el ID del usuario logueado al conectar
socket.on('connect', () => {

  socket.emit(
    'registrar_usuario',
    usuario.id
  );

});

// 3. Escuchar la lista de conectados que envía el servidor
socket.on('usuarios_conectados', (listaUsuarios) => {
  console.log("Usuarios en línea actualmente:", listaUsuarios);
  // Aquí puedes actualizar tu estado de React/Vue o manipular el DOM
});

//

export default socket;