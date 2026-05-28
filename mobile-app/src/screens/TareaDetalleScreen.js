// import React, {
//   useEffect,
//   useState,
// } from 'react';

// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';

// import axios from 'axios';

// import ChatBox from '../components/ChatBox';

// import { useAuth } from '../context/AuthContext';

// import { socket } from '../services/socket';


// // =====================================
// // API
// // =====================================

// const API_URL =
//   'https://tareas-sala.onrender.com/api/tareas';


// // =====================================
// // SCREEN
// // =====================================

// export default function TareaDetalleScreen({
//   route,
//   navigation,
// }) {

//   const { tareaId } =
//     route.params;

//   const {
//     token,
//     usuario,
//   } = useAuth();

//   const [tarea, setTarea] =
//     useState(null);

//   const [loading, setLoading] =
//     useState(true);


//   // =====================================
//   // OBTENER TAREA
//   // =====================================

//   const obtenerTarea =
//     async () => {
//       try {
//         const response =
//           await axios.get(
//             `${API_URL}/${tareaId}`,
//             {
//               headers: {
//                 Authorization:
//                   `Bearer ${token}`,
//               },
//             }
//           );

//         setTarea(
//           response.data
//         );
//       } catch (error) {
//         console.log(error);

//         Alert.alert(
//           'Error',
//           'No se pudo cargar la tarea'
//         );
//       } finally {
//         setLoading(false);
//       }
//     };


//   // =====================================
//   // SOCKETS
//   // =====================================

//   useEffect(() => {
//     obtenerTarea();

//     socket.emit(
//       'joinTaskRoom',
//       tareaId
//     );

//     socket.on(
//       'estadoActualizado',
//       (
//         tareaActualizada
//       ) => {
//         if (
//           tareaActualizada._id ===
//           tareaId
//         ) {
//           setTarea(
//             tareaActualizada
//           );
//         }
//       }
//     );

//     return () => {
//       socket.emit(
//         'leaveTaskRoom',
//         tareaId
//       );

//       socket.off(
//         'estadoActualizado'
//       );
//     };
//   }, []);


//   // =====================================
//   // ACTUALIZAR ESTADO
//   // =====================================

//   const actualizarEstado =
//     async (estado) => {
//       try {
//         const response =
//           await axios.put(
//             `${API_URL}/${tareaId}/estado`,
//             {
//               estado,
//             },
//             {
//               headers: {
//                 Authorization:
//                   `Bearer ${token}`,
//               },
//             }
//           );

//         setTarea(
//           response.data
//         );

//         Alert.alert(
//           'Éxito',
//           `Tarea marcada como ${estado}`
//         );
//       } catch (error) {
//         console.log(error);

//         Alert.alert(
//           'Error',
//           'No se pudo actualizar el estado'
//         );
//       }
//     };


//   // =====================================
//   // LOADING
//   // =====================================

//   if (
//     loading ||
//     !tarea
//   ) {
//     return (
//       <View
//         style={
//           styles.loadingContainer
//         }
//       >
//         <ActivityIndicator
//           size="large"
//         />
//       </View>
//     );
//   }


//   // =====================================
//   // DATOS
//   // =====================================

//   const producto =
//     tarea?.tarea
//       ?.productoTrabajo;

//   const tanque =
//     tarea?.tarea
//       ?.ubicacionTanque;

//   const maquina =
//     tarea?.tarea
//       ?.equipoMaquina;


//   // =====================================
//   // UI
//   // =====================================

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         style={styles.content}
//       >

//         {/* ========================= */}
//         {/* HEADER */}
//         {/* ========================= */}

//         <View style={styles.card}>
//           <Text
//             style={
//               styles.title
//             }
//           >
//             {producto}
//           </Text>

//           <Text
//             style={
//               styles.info
//             }
//           >
//             🏭 Tanque:{' '}
//             {tanque}
//           </Text>

//           <Text
//             style={
//               styles.info
//             }
//           >
//             ⚙️ Máquina:{' '}
//             {maquina}
//           </Text>

//           <Text
//             style={
//               styles.info
//             }
//           >
//             👷 Turno:{' '}
//             {tarea.turno}
//           </Text>

//           <Text
//             style={
//               styles.info
//             }
//           >
//             📌 Estado:{' '}
//             {tarea.estado}
//           </Text>

//           <Text
//             style={
//               styles.info
//             }
//           >
//             📅 Fecha:{' '}
//             {new Date(
//               tarea.fecha
//             ).toLocaleDateString(
//               'es-AR'
//             )}
//           </Text>
//         </View>


//         {/* ========================= */}
//         {/* BOTONES */}
//         {/* ========================= */}

//         <View
//           style={
//             styles.buttonsRow
//           }
//         >

//           {/* LEÍDO */}
//           {tarea.estado ===
//             'PENDIENTE' && (
//             <TouchableOpacity
//               style={[
//                 styles.button,
//                 styles.readButton,
//               ]}
//               onPress={() =>
//                 actualizarEstado(
//                   'LEIDO'
//                 )
//               }
//             >
//               <Text
//                 style={
//                   styles.buttonText
//                 }
//               >
//                 Marcar leído
//               </Text>
//             </TouchableOpacity>
//           )}


//           {/* ACEPTAR */}
//           {tarea.estado !==
//             'ACEPTADO' && (
//             <TouchableOpacity
//               style={[
//                 styles.button,
//                 styles.acceptButton,
//               ]}
//               onPress={() =>
//                 actualizarEstado(
//                   'ACEPTADO'
//                 )
//               }
//             >
//               <Text
//                 style={
//                   styles.buttonText
//                 }
//               >
//                 Aceptar tarea
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>


//         {/* ========================= */}
//         {/* CHAT */}
//         {/* ========================= */}

//         <View
//           style={
//             styles.chatContainer
//           }
//         >
//           <ChatBox
//             tareaId={tareaId}
//             token={token}
//             usuario={usuario}
//           />
//         </View>

//         <View
//           style={{
//             height: 50,
//           }}
//         />
//       </ScrollView>
//     </View>
//   );
// }


// // =====================================
// // STYLES
// // =====================================

// const styles =
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor:
//         '#F5F5F5',
//     },

//     content: {
//       flex: 1,
//       padding: 16,
//     },

//     loadingContainer: {
//       flex: 1,
//       justifyContent:
//         'center',
//       alignItems: 'center',
//     },

//     card: {
//       backgroundColor:
//         '#fff',
//       borderRadius: 18,
//       padding: 20,
//       marginBottom: 16,

//       shadowColor: '#000',

//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },

//       shadowOpacity: 0.1,

//       shadowRadius: 5,

//       elevation: 3,
//     },

//     title: {
//       fontSize: 24,
//       fontWeight: 'bold',
//       marginBottom: 16,
//       color: '#222',
//     },

//     info: {
//       fontSize: 16,
//       marginBottom: 10,
//       color: '#444',
//     },

//     buttonsRow: {
//       flexDirection: 'row',
//       marginBottom: 20,
//     },

//     button: {
//       flex: 1,
//       paddingVertical: 15,
//       borderRadius: 14,
//       alignItems: 'center',
//     },

//     readButton: {
//       backgroundColor:
//         '#2196F3',
//       marginRight: 8,
//     },

//     acceptButton: {
//       backgroundColor:
//         '#4CAF50',
//       marginLeft: 8,
//     },

//     buttonText: {
//       color: '#fff',
//       fontWeight: 'bold',
//       fontSize: 15,
//     },

//     chatContainer: {
//       backgroundColor:
//         '#fff',
//       borderRadius: 18,
//       padding: 10,
//       minHeight: 450,
//       marginBottom: 20,
//     },
//   });

import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import { useAuth } from '../context/AuthContext';

import ChatBox from '../components/ChatBox';

export default function TareaDetalleScreen({
  route,
}) {

  const { tareaId } =
    route.params;

  const {
    token,
    usuario,
  } = useAuth();

  return (
    <View style={styles.container}>
      <ChatBox
        tareaId={tareaId}
        token={token}
        usuario={usuario}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });