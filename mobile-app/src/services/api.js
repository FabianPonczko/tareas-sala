// import axios from 'axios';


// // =====================================
// // CONFIG API
// // =====================================

// // Cambiar por IP local backend
// // Ejemplo:
// // http://192.168.0.15:3000/api

// const BASE_URL =
//   'http://10.24.138.167:3000';


// // =====================================
// // INSTANCIA AXIOS
// // =====================================

// const api = axios.create({
//   baseURL: BASE_URL,

//   timeout: 15000,

//   headers: {
//     'Content-Type':
//       'application/json',
//   },
// });


// // =====================================
// // SET TOKEN
// // =====================================

// export const setAuthToken =
//   (token) => {
//     if (token) {
//       api.defaults.headers.common.Authorization =
//         `Bearer ${token}`;
//     } else {
//       delete api.defaults
//         .headers.common
//         .Authorization;
//     }
//   };


// // =====================================
// // INTERCEPTOR REQUEST
// // =====================================

// api.interceptors.request.use(
//   async (config) => {
//     return config;
//   },

//   (error) => {
//     return Promise.reject(
//       error
//     );
//   }
// );


// // =====================================
// // INTERCEPTOR RESPONSE
// // =====================================

// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {

//     // Token expirado
//     if (
//       error?.response
//         ?.status === 401
//     ) {
//       console.log(
//         'Sesión expirada'
//       );
//     }

//     return Promise.reject(
//       error
//     );
//   }
// );


// // =====================================
// // AUTH
// // =====================================

// export const loginRequest =
//   (data) =>
//     api.post(
//       '/auth/login',
//       data
//     );

// export const meRequest =
//   () =>
//     api.get('/auth/me');

// export const logoutRequest =
//   () =>
//     api.post(
//       '/auth/logout'
//     );

// export const updateTurnoRequest =
//   (turnoActual) =>
//     api.put(
//       '/auth/turno',
//       {
//         turnoActual,
//       }
//     );


// // =====================================
// // TAREAS
// // =====================================

// export const getTareasRequest =
//   () => api.get('/tareas');

// export const getTareaRequest =
//   (id) =>
//     api.get(
//       `/tareas/${id}`
//     );

// export const crearTareaRequest =
//   (data) =>
//     api.post(
//       '/tareas',
//       data
//     );

// export const updateEstadoRequest =
//   (
//     id,
//     estado
//   ) =>
//     api.put(
//       `/tareas/${id}/estado`,
//       {
//         estado,
//       }
//     );

// export const getTareasPrefijadasRequest =
//   () =>
//     api.get(
//       '/tareas/prefijadas'
//     );


// // =====================================
// // CHAT
// // =====================================

// export const getMensajesRequest =
//   (tareaId) =>
//     api.get(
//       `/chat/${tareaId}`
//     );

// export const enviarMensajeRequest =
//   (data) =>
//     api.post(
//       '/chat',
//       data
//     );

// export const eliminarMensajeRequest =
//   (mensajeId) =>
//     api.delete(
//       `/chat/${mensajeId}`
//     );

// export const marcarLeidosRequest =
//   (tareaId) =>
//     api.put(
//       `/chat/leidos/${tareaId}`
//     );


// // =====================================
// // EXPORT
// // =====================================

// export default api;

import axios from 'axios';


// =====================================
// BASE URL
// =====================================

// CAMBIAR POR TU IP LOCAL
//
// Ejemplo:
// http://192.168.0.15:3000/api

const BASE_URL =
  'http://10.24.138.167:3000/api';


// =====================================
// AXIOS INSTANCE
// =====================================

const api = axios.create({
  baseURL: BASE_URL,

  timeout: 15000,

  headers: {
    'Content-Type':
      'application/json',
  },
});


// =====================================
// TOKEN
// =====================================

export const setAuthToken =
  (token) => {

    if (token) {

      api.defaults.headers.common.Authorization =
        `Bearer ${token}`;

    } else {

      delete api.defaults
        .headers.common
        .Authorization;
    }
  };


// =====================================
// REQUEST INTERCEPTOR
// =====================================

api.interceptors.request.use(
  async (config) => {
    return config;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);


// =====================================
// RESPONSE INTERCEPTOR
// =====================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {

    console.log(
      'API ERROR:',
      error?.response?.data ||
      error.message
    );

    return Promise.reject(
      error
    );
  }
);


// =====================================
// AUTH
// =====================================

// LOGIN
export const loginRequest =
  (data) =>
    api.post(
      '/auth/login',
      data
    );


// REGISTER
export const registerRequest =
  (data) =>
    api.post(
      '/auth/register',
      data
    );


// PERFIL
export const meRequest =
  () =>
    api.get('/auth/me');


// LOGOUT
export const logoutRequest =
  () =>
    api.post(
      '/auth/logout'
    );


// ACTUALIZAR TURNO
export const updateTurnoRequest =
  (turnoActual) =>
    api.put(
      '/auth/turno',
      {
        turnoActual,
      }
    );


// =====================================
// TAREAS
// =====================================

// TODAS LAS TAREAS
export const getTareasRequest =
  () =>
    api.get('/tareas');


// UNA TAREA
export const getTareaRequest =
  (id) =>
    api.get(
      `/tareas/${id}`
    );


// CREAR TAREA
export const crearTareaRequest =
  (data) =>
    api.post(
      '/tareas',
      data
    );


// ACTUALIZAR ESTADO
export const updateEstadoRequest =
  (
    id,
    estado
  ) =>
    api.put(
      `/tareas/${id}/estado`,
      {
        estado,
      }
    );


// TAREAS PREFIJADAS
export const getTareasPrefijadasRequest =
  () =>
    api.get(
      '/tareas/prefijadas'
    );


// =====================================
// CHAT
// =====================================

// MENSAJES
export const getMensajesRequest =
  (tareaId) =>
    api.get(
      `/chat/${tareaId}`
    );


// ENVIAR MENSAJE
export const enviarMensajeRequest =
  (data) =>
    api.post(
      '/chat',
      data
    );


// ELIMINAR MENSAJE
export const eliminarMensajeRequest =
  (mensajeId) =>
    api.delete(
      `/chat/${mensajeId}`
    );


// MARCAR LEÍDOS
export const marcarLeidosRequest =
  (tareaId) =>
    api.put(
      `/chat/leidos/${tareaId}`
    );


// =====================================
// USUARIOS
// =====================================

// TODOS LOS USUARIOS
export const getUsuariosRequest =
  () =>
    api.get(
      '/usuarios'
    );


// UN USUARIO
export const getUsuarioRequest =
  (id) =>
    api.get(
      `/usuarios/${id}`
    );


// ACTUALIZAR USUARIO
export const updateUsuarioRequest =
  (
    id,
    data
  ) =>
    api.put(
      `/usuarios/${id}`,
      data
    );


// ELIMINAR USUARIO
export const deleteUsuarioRequest =
  (id) =>
    api.delete(
      `/usuarios/${id}`
    );


// =====================================
// NOTIFICATIONS
// =====================================

// GUARDAR PUSH TOKEN
export const guardarPushTokenRequest =
  (pushToken) =>
    api.post(
      '/auth/push-token',
      {
        pushToken,
      }
    );


// =====================================
// EXPORT
// =====================================

export default api;