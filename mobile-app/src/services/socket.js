import { io } from 'socket.io-client';


// =====================================
// URL BACKEND
// =====================================

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

export const connectSocket = (token, usuario) => {
  socket.auth = { token };

  socket.off("connect");

  socket.on("connect", () => {
    console.log("✅ Socket conectado:", socket.id);

    if (usuario?.turnoActual) {
      socket.emit(
        "joinShiftRoom",
        usuario.turnoActual
      );
    }
  });

  if (!socket.connected) {
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


export default socket;