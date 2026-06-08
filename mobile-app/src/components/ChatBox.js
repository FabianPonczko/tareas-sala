// import React, {
//   useEffect,
//   useRef,
//   useState,
// } from 'react';

// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';

// import axios from 'axios';

// import { socket } from '../services/socket';


// // =====================================
// // CONFIG API
// // =====================================

// const API_URL =
//   'https://tareas-sala.onrender.com/api/chat';


// // =====================================
// // COMPONENTE CHAT
// // =====================================

// export default function ChatBox({
//   tareaId,
//   token,
//   usuario,
// }) {
//   const [mensajes, setMensajes] =
//     useState([]);

//   const [texto, setTexto] =
//     useState('');

//   const [loading, setLoading] =
//     useState(true);

//   const flatListRef =
//     useRef(null);


//   // =====================================
//   // CARGAR MENSAJES
//   // =====================================

//   const obtenerMensajes =
//     async () => {
//       try {
//         const res =
//           await axios.get(
//             `${API_URL}/${tareaId}`,
//             {
//               headers: {
//                 Authorization:
//                   `Bearer ${token}`,
//               },
//             }
//           );

//         setMensajes(res.data);

//         setTimeout(() => {
//           flatListRef.current?.scrollToEnd(
//             {
//               animated: true,
//             }
//           );
//         }, 200);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };


//   // =====================================
//   // SOCKETS
//   // =====================================

//   useEffect(() => {
//   if (
//     socket.connected &&
//     usuario?.id
//   ) {

//     socket.emit(
//       'registrar_usuario',
//       usuario.id
//     );
//   }
//     obtenerMensajes();

//     // Entrar sala tarea
//     socket.emit(
//       'joinTaskRoom',
//       tareaId
//     );

//     // Nuevo mensaje realtime
//     socket.on(
//       'nuevoMensaje',
//       (nuevoMensaje) => {
//         setMensajes((prev) => [
//           ...prev,
//           nuevoMensaje,
//         ]);

//         setTimeout(() => {
//           flatListRef.current?.scrollToEnd(
//             {
//               animated: true,
//             }
//           );
//         }, 100);
//       }
//     );

//     // Mensaje eliminado
//     socket.on(
//       'mensajeEliminado',
//       ({
//         mensajeId,
//       }) => {
//         setMensajes((prev) =>
//           prev.filter(
//             (m) =>
//               m._id !==
//               mensajeId
//           )
//         );
//       }
//     );

//     return () => {
//       socket.emit(
//         'leaveTaskRoom',
//         tareaId
//       );

//       socket.off(
//         'nuevoMensaje'
//       );

//       socket.off(
//         'mensajeEliminado'
//       );
//     };
//   }, []);


//   // =====================================
//   // ENVIAR MENSAJE
//   // =====================================

//   const enviarMensaje =
//     async () => {
//       if (!texto.trim())
//         return;

//       try {
//         await axios.post(
//           API_URL,
//           {
//             tarea: tareaId,
//             mensaje: texto,
//           },
//           {
//             headers: {
//               Authorization:
//                 `Bearer ${token}`,
//             },
//           }
//         );

//         setTexto('');
//       } catch (error) {
//          console.log(
//         'ERROR CHAT:',
//         error.response?.data ||
//         error.message
//       );
//       }
//     };


//   // =====================================
//   // ELIMINAR MENSAJE
//   // =====================================

//   const eliminarMensaje =
//     async (
//       mensajeId
//     ) => {
//       try {
//         await axios.delete(
//           `${API_URL}/${mensajeId}`,
//           {
//             headers: {
//               Authorization:
//                 `Bearer ${token}`,
//             },
//           }
//         );
//       } catch (error) {
//         console.log(error);
//       }
//     };


//   // =====================================
//   // RENDER MENSAJE
//   // =====================================

//   const renderItem = ({
//     item,
//   }) => {
//     const esMio =
//       item.usuarioId?._id ===
//         usuario?.id ||
//       item.usuarioId ===
//         usuario?.id;

//     return (
//       <View
//         style={[
//           styles.messageContainer,

//           esMio &&
//             styles.myMessage,
//         ]}
//       >
//         <Text style={styles.user}>
//           {item.nombreUsuario}
//         </Text>

//         <Text style={styles.message}>
//           {item.mensaje}
//         </Text>

//         <View
//           style={
//             styles.footerMessage
//           }
//         >
//           <Text style={styles.time}>
//             {new Date(
//               item.createdAt
//             ).toLocaleTimeString(
//               'es-AR',
//               {
//                 hour: '2-digit',
//                 minute:
//                   '2-digit',
//               }
//             )}
//           </Text>

//           {item.editado && (
//             <Text
//               style={
//                 styles.editado
//               }
//             >
//               editado
//             </Text>
//           )}
//         </View>

//         {(esMio ||
//           usuario?.rol ===
//             'ADMIN') && (
//           <TouchableOpacity
//             onPress={() =>
//               eliminarMensaje(
//                 item._id
//               )
//             }
//           >
//             <Text
//               style={
//                 styles.delete
//               }
//             >
//               Eliminar
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };


//   // =====================================
//   // LOADING
//   // =====================================

//   if (loading) {
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
//   // UI
//   // =====================================

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={
//         Platform.OS === 'ios'
//           ? 'padding'
//           : undefined
//       }
//     >
//       <Text style={styles.title}>
//         Notas / Chat
//       </Text>

//       <FlatList
//         ref={flatListRef}
//         data={mensajes}
//         keyExtractor={(item) =>
//           item._id
//         }
//         renderItem={renderItem}
//         contentContainerStyle={{
//           paddingBottom: 20,
//         }}
//       />

//       <View style={styles.inputRow}>
//         <TextInput
//           value={texto}
//           onChangeText={setTexto}
//           placeholder="Escribí un mensaje..."
//           style={styles.input}
//           multiline
//         />

//         <TouchableOpacity
//           style={styles.button}
//           onPress={
//             enviarMensaje
//           }
//         >
//           <Text
//             style={
//               styles.buttonText
//             }
//           >
//             Enviar
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
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
//         '#fff',
//       padding: 10,
//     },

//     title: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       marginBottom: 10,
//     },

//     loadingContainer: {
//       flex: 1,
//       justifyContent:
//         'center',
//       alignItems: 'center',
//     },

//     messageContainer: {
//       backgroundColor:
//         '#f1f1f1',
//       padding: 12,
//       borderRadius: 12,
//       marginBottom: 10,
//       maxWidth: '90%',
//       alignSelf: 'flex-start',
//     },

//     myMessage: {
//       backgroundColor:
//         '#DCF8C5',
//       alignSelf: 'flex-end',
//     },

//     user: {
//       fontWeight: 'bold',
//       marginBottom: 5,
//     },

//     message: {
//       fontSize: 16,
//     },

//     footerMessage: {
//       flexDirection: 'row',
//       marginTop: 5,
//       alignItems: 'center',
//     },

//     time: {
//       fontSize: 11,
//       color: '#777',
//     },

//     editado: {
//       marginLeft: 8,
//       fontSize: 10,
//       color: '#999',
//     },

//     delete: {
//       marginTop: 5,
//       color: 'red',
//       fontSize: 12,
//     },

//     inputRow: {
//       flexDirection: 'row',
//       alignItems: 'flex-end',
//       marginTop: 10,
//     },

//     input: {
//       flex: 1,
//       minHeight: 45,
//       maxHeight: 120,
//       borderWidth: 1,
//       borderColor: '#ccc',
//       borderRadius: 12,
//       paddingHorizontal: 12,
//       paddingVertical: 10,
//       backgroundColor:
//         '#fff',
//     },

//     button: {
//       marginLeft: 10,
//       backgroundColor:
//         '#007AFF',
//       paddingHorizontal: 20,
//       paddingVertical: 12,
//       borderRadius: 12,
//     },

//     buttonText: {
//       color: '#fff',
//       fontWeight: 'bold',
//     },
//   });

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';

import {
  socket,
} from '../services/socket';

import {
  SafeAreaView,
  
} from 'react-native-safe-area-context';

// =====================================
// CONFIG API
// =====================================

const API_URL =
  'https://tareas-sala.onrender.com/api/chat';


// =====================================
// COMPONENTE CHAT
// =====================================

export default function ChatBox({
  tareaId,
  token,
  usuario,
}) {

  const [mensajes, setMensajes] =
    useState([]);

  const [texto, setTexto] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const flatListRef =
    useRef(null);

   

  // =====================================
  // CARGAR MENSAJES
  // =====================================

  const obtenerMensajes =
    async () => {

      try {

        const res =
          await axios.get(
            `${API_URL}/${tareaId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setMensajes(
          res.data
        );

        setTimeout(() => {

          flatListRef.current
            ?.scrollToEnd({
              animated: true,
            });

        }, 200);

      } catch (error) {

        console.log(
          'ERROR OBTENER MENSAJES:',
          error.response?.data ||
          error.message
        );

      } finally {

        setLoading(false);
      }
    };


  // =====================================
  // SOCKETS
  // =====================================

  useEffect(() => {

    // Registrar usuario online
    if (
      socket.connected &&
      usuario?._id
    ) {

      socket.emit(
        'registrar_usuario',
        usuario._id
      );
    }

    // Entrar room tarea
    socket.emit(
      'joinTaskRoom',
      tareaId
    );

    obtenerMensajes();


    // =====================================
    // NUEVO MENSAJE
    // =====================================

    socket.on(
      'nuevoMensaje',
      (
        nuevoMensaje
      ) => {

        setMensajes(
          (prev) => [

            ...prev,

            nuevoMensaje,
          ]
        );

        setTimeout(() => {

          flatListRef.current
            ?.scrollToEnd({
              animated: true,
            });

        }, 100);
      }
    );


    // =====================================
    // MENSAJE ELIMINADO
    // =====================================

    socket.on(
      'mensajeEliminado',
      ({
        mensajeId,
      }) => {

        setMensajes(
          (prev) =>
            prev.filter(
              (m) =>
                m._id !==
                mensajeId
            )
        );
      }
    );


    // =====================================
    // CLEANUP
    // =====================================

    return () => {

      socket.emit(
        'leaveTaskRoom',
        tareaId
      );

      socket.off(
        'nuevoMensaje'
      );

      socket.off(
        'mensajeEliminado'
      );
    };

  }, []);


  // =====================================
  // ENVIAR MENSAJE
  // =====================================

  const enviarMensaje =
    async () => {

      if (
        !texto.trim()
      ) return;

      try {

        const body = {

          tarea:
            tareaId,

          mensaje:
            texto,
        };

        const res =
          await axios.post(
            API_URL,
            body,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

       

        setTexto('');

      } catch (error) {

        console.log(
          'ERROR CHAT:',
          error.response?.data ||
          error.message
        );
      }
    };


  // =====================================
  // ELIMINAR MENSAJE
  // =====================================

  const eliminarMensaje =
    async (
      mensajeId
    ) => {

      try {

        await axios.delete(
          `${API_URL}/${mensajeId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

       

      } catch (error) {

        console.log(
          'ERROR ELIMINAR:',
          error.response?.data ||
          error.message
        );
      }
    };


  // =====================================
  // RENDER ITEM
  // =====================================

 const renderItem = ({
  item,
}) => {

  const esMio =

    item.usuarioId?._id ===
      usuario?._id ||

    item.usuarioId ===
      usuario?._id;

  return (

    <View style={styles.lineMessage}>

      {/* Usuario */}
      <Text
        style={[
          styles.userLine,
          esMio &&
          styles.userLineMine,
        ]}
        >
        {item.nombreUsuario}
      </Text>

      {/* Hora */}
      <Text style={styles.timeLine}>
        {new Date(
          item.createdAt
        ).toLocaleTimeString(
          'es-AR',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        )}
      </Text>

      {/* Mensaje */}
      <Text
        style={[
          styles.messageLine,
          esMio &&
          styles.messageLineMine,
        ]}
        >
        {item.mensaje}
      </Text>

      {/* Editado */}
      {item.editado && (
        <Text style={styles.editadoLine}>
          (editado)
        </Text>
      )}

      {/* Eliminar */}
      {(esMio ||
        usuario?.rol ===
        'ADMIN') && (
          <TouchableOpacity
          onPress={() =>
            eliminarMensaje(
              item._id
            )
          }
          >
          <Text
            style={
              styles.deleteLine
            }
            >
            ✕
          </Text>
        </TouchableOpacity>
      )}

    </View>

  );
};


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
        />
      </View>
    );
  }


  // =====================================
  // UI
  // =====================================

  return (
  <SafeAreaView style={{ flex: 1 }}>
    <KeyboardAvoidingView
      style={
        styles.container
      }
      behavior={
        Platform.OS ===
        'ios'
        ? 'padding'
        : undefined
      }
      >

      <Text
        style={styles.title}
        >
        Notas / Chat
      </Text>

      <FlatList
        ref={flatListRef}
        data={mensajes}
        keyExtractor={(
          item
        ) => item._id}
        renderItem={
          renderItem
        }
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        />

      <View
        style={
          styles.inputRow
        }
      >

        <TextInput
          value={texto}
          onChangeText={
            setTexto
          }
          placeholder="Escribí un mensaje..."
          style={
            styles.input
          }
          multiline
          />

        <TouchableOpacity
          style={
            styles.button
          }
          onPress={
            enviarMensaje
          }
          >

          <Text
            style={
              styles.buttonText
            }
            >
            Enviar
          </Text>

        </TouchableOpacity>

      </View>

    </KeyboardAvoidingView>
  </SafeAreaView>
  );
}


// =====================================
// STYLES
// =====================================

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        '#fff',
      padding: 10,
    },

    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
    },

    messageContainer: {
      backgroundColor:
        '#f1f1f1',
      padding: 12,
      borderRadius: 12,
      marginBottom: 10,
      maxWidth: '90%',
      alignSelf:
        'flex-start',
    },

    myMessage: {
      backgroundColor:
        '#DCF8C5',
      alignSelf:
        'flex-end',
    },

    user: {
      fontWeight: 'bold',
      marginBottom: 5,
    },

    message: {
      fontSize: 16,
    },

    footerMessage: {
      flexDirection:
        'row',
      marginTop: 5,
      alignItems:
        'center',
    },

    time: {
      fontSize: 11,
      color: '#777',
    },

    editado: {
      marginLeft: 8,
      fontSize: 10,
      color: '#999',
    },

    delete: {
      marginTop: 5,
      color: 'red',
      fontSize: 12,
    },

    inputRow: {
      flexDirection:
        'row',
      alignItems:
        'flex-end',
      marginTop: 10,
    },

    input: {
      flex: 1,
      minHeight: 45,
      maxHeight: 120,
      borderWidth: 1,
      borderColor:
        '#ccc',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor:
        '#fff',
    },

    button: {
      marginLeft: 10,
      backgroundColor:
        '#007AFF',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
    },

    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    lineMessage: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
  flexWrap: 'wrap',
},

userLine: {
  fontWeight: 'bold',
  color: '#007AFF',
  marginRight: 6,
  fontSize: 14,
},

userLineMine: {
  color: '#28A745',
},

timeLine: {
  fontSize: 11,
  color: '#999',
  marginRight: 8,
},

messageLine: {
  fontSize: 15,
  color: '#222',
  flexShrink: 1,
},

messageLineMine: {
  color: '#111',
},

editadoLine: {
  marginLeft: 6,
  fontSize: 10,
  color: '#999',
},

deleteLine: {
  marginLeft: 8,
  color: 'red',
  fontSize: 12,
  fontWeight: 'bold',
},
  });