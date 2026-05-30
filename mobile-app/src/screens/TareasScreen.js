// import React, {
//   useEffect,
//   useState,
// } from 'react';

// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
//   RefreshControl,
//   Alert,
// } from 'react-native';

// import axios from 'axios';

// import TaskCard from '../components/TaskCard';

// import { useAuth } from '../context/AuthContext';

// import { socket } from '../services/socket';


// // =====================================
// // API
// // =====================================

// const API_URL =
//   'http://10.24.138.167:3000/api/tareas';


// // =====================================
// // SCREEN
// // =====================================

// export default function TareasScreen({
//   navigation,
// }) {

//   const {
//     token,
//     usuario,
//   } = useAuth();

//   const [tareas, setTareas] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [refreshing, setRefreshing] =
//     useState(false);


//   // =====================================
//   // OBTENER TAREAS
//   // =====================================

//   const obtenerTareas =
//     async () => {
//       try {
//         const response =
//           await axios.get(
//             API_URL,
//             {
//               headers: {
//                 Authorization:
//                   `Bearer ${token}`,
//               },
//             }
//           );

//         setTareas(
//           response.data
//         );
//       } catch (error) {
//         console.log(error);

//         Alert.alert(
//           'Error',
//           'No se pudieron cargar las tareas'
//         );
//       } finally {
//         setLoading(false);

//         setRefreshing(false);
//       }
//     };


//   // =====================================
//   // SOCKETS
//   // =====================================

//   useEffect(() => {
//     obtenerTareas();

//     // Nueva tarea realtime
//     socket.on(
//       'nuevaTarea',
//       (nuevaTarea) => {
//         setTareas((prev) => [
//           nuevaTarea,
//           ...prev,
//         ]);
//       }
//     );

//     // Estado actualizado realtime
//     socket.on(
//       'estadoActualizado',
//       (
//         tareaActualizada
//       ) => {
//         setTareas((prev) =>
//           prev.map((t) =>
//             t._id ===
//             tareaActualizada._id
//               ? tareaActualizada
//               : t
//           )
//         );
//       }
//     );

//     return () => {
//       socket.off(
//         'nuevaTarea'
//       );

//       socket.off(
//         'estadoActualizado'
//       );
//     };
//   }, []);


//   // =====================================
//   // REFRESH
//   // =====================================

//   const onRefresh =
//     async () => {
//       setRefreshing(true);

//       await obtenerTareas();
//     };


//   // =====================================
//   // ACTUALIZAR ESTADO
//   // =====================================

//   const actualizarEstado =
//     async (
//       tareaId,
//       estado
//     ) => {
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

//         setTareas((prev) =>
//           prev.map((t) =>
//             t._id ===
//             tareaId
//               ? response.data
//               : t
//           )
//         );

//         Alert.alert(
//           'Éxito',
//           `Tarea marcada como ${estado}`
//         );
//       } catch (error) {
//         console.log(error);

//         Alert.alert(
//           'Error',
//           'No se pudo actualizar'
//         );
//       }
//     };


//   // =====================================
//   // FILTRAR POR TURNO
//   // =====================================

//   const tareasTurno =
//     tareas.filter(
//       (t) =>
//         t.turno ===
//         usuario?.turnoActual
//     );


//   // =====================================
//   // RENDER ITEM
//   // =====================================

//   const renderItem = ({
//     item,
//   }) => (
//     <TaskCard
//       tarea={item}

//       usuario={usuario}

//       onPress={() =>
//         navigation.navigate(
//           'TareaDetalle',
//           {
//             tareaId:
//               item._id,
//           }
//         )
//       }

//       onLeido={() =>
//         actualizarEstado(
//           item._id,
//           'LEIDO'
//         )
//       }

//       onAceptar={() =>
//         actualizarEstado(
//           item._id,
//           'ACEPTADO'
//         )
//       }
//     />
//   );


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
//   // EMPTY
//   // =====================================

//   if (
//     !tareasTurno.length
//   ) {
//     return (
//       <View
//         style={
//           styles.emptyContainer
//         }
//       >
//         <Text
//           style={
//             styles.emptyTitle
//           }
//         >
//           No hay tareas
//         </Text>

//         <Text
//           style={
//             styles.emptyText
//           }
//         >
//           No existen tareas
//           asignadas para el
//           turno{' '}
//           {
//             usuario?.turnoActual
//           }
//         </Text>

//         <TouchableOpacity
//           style={
//             styles.reloadButton
//           }
//           onPress={
//             obtenerTareas
//           }
//         >
//           <Text
//             style={
//               styles.reloadText
//             }
//           >
//             Recargar
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }


//   // =====================================
//   // UI
//   // =====================================

//   return (
//     <View style={styles.container}>
//       {/* ========================= */}
//       {/* HEADER */}
//       {/* ========================= */}

//       <View style={styles.header}>
//         <Text style={styles.title}>
//           Tareas del turno
//         </Text>

//         <Text
//           style={
//             styles.subtitle
//           }
//         >
//           Turno:{' '}
//           {
//             usuario?.turnoActual
//           }
//         </Text>
//       </View>


//       {/* ========================= */}
//       {/* LISTA */}
//       {/* ========================= */}

//       <FlatList
//         data={tareasTurno}

//         keyExtractor={(item) =>
//           item._id
//         }

//         renderItem={renderItem}

//         contentContainerStyle={{
//           paddingBottom: 40,
//         }}

//         refreshControl={
//           <RefreshControl
//             refreshing={
//               refreshing
//             }
//             onRefresh={
//               onRefresh
//             }
//           />
//         }
//       />
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
//       padding: 16,
//     },

//     loadingContainer: {
//       flex: 1,
//       justifyContent:
//         'center',
//       alignItems: 'center',
//     },

//     header: {
//       marginBottom: 20,
//     },

//     title: {
//       fontSize: 28,
//       fontWeight: 'bold',
//       color: '#222',
//     },

//     subtitle: {
//       fontSize: 16,
//       color: '#666',
//       marginTop: 5,
//     },

//     emptyContainer: {
//       flex: 1,
//       justifyContent:
//         'center',
//       alignItems: 'center',
//       padding: 30,
//       backgroundColor:
//         '#F5F5F5',
//     },

//     emptyTitle: {
//       fontSize: 24,
//       fontWeight: 'bold',
//       marginBottom: 10,
//       color: '#222',
//     },

//     emptyText: {
//       fontSize: 16,
//       textAlign: 'center',
//       color: '#666',
//       marginBottom: 20,
//     },

//     reloadButton: {
//       backgroundColor:
//         '#007AFF',
//       paddingHorizontal: 20,
//       paddingVertical: 14,
//       borderRadius: 14,
//     },

//     reloadText: {
//       color: '#fff',
//       fontWeight: 'bold',
//       fontSize: 16,
//     },
//   });

import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';

import axios from 'axios';

import { useAuth } from '../context/AuthContext';

import { socket } from '../services/socket';
import ChatBox from '../components/ChatBox';

import {
  useNavigation,
} from '@react-navigation/native';

// =====================================
// API
// =====================================

const API_URL =
  'https://tareas-sala.onrender.com/api/tareas';


// =====================================
// SCREEN
// =====================================

export default function TareasScreen({fechaAfiltrar}) {
  const {
    token,
    usuario,
  } = useAuth();
  
  const [tareas, setTareas] =
  useState([]);
  
  const [loading, setLoading] =
  useState(true);
  
  const [refreshing,
    setRefreshing] =
    useState(false);
    
    const navigation =
    useNavigation();
    
    // =====================================
    // OBTENER TAREAS
    // =====================================
    
    const obtenerTareas =
    async () => {
      
      try {
        
        const response =
        await axios.get(
          API_URL,
          {
            headers: {
              Authorization:
              `Bearer ${token}`,
              },
            }
          );

          setTareas(
            response.data
          );
          
        } catch (error) {
          
          console.log(error);
          
        Alert.alert(
          'Error',
          'No se pudieron cargar las tareas'
        );

      } finally {
        
        setLoading(false);

        setRefreshing(false);
        
      }
    };
    

    // =====================================
    // SOCKETS
    // =====================================
    
    useEffect(() => {
      
      obtenerTareas();
      
      socket.on(
        'nuevaTarea',
        (nuevaTarea) => {
          
          setTareas((prev) => [
            nuevaTarea,
            ...prev,
          ]);
        }
      );
      
      socket.on(
        'estadoActualizado',
        (
          tareaActualizada
        ) => {
          
          setTareas((prev) =>
            prev.map((t) =>
              t._id ===
          tareaActualizada._id
          ? tareaActualizada
          : t
        )
      );
    }
  );
  
  return () => {
    
    socket.off(
      'nuevaTarea'
    );
    
    socket.off(
      'estadoActualizado'
    );
  };
  
}, []);

console.log("fechaafiltrar",fechaAfiltrar)

  // =====================================
  // REFRESH
  // =====================================

  const onRefresh =
    async () => {

      setRefreshing(true);

      await obtenerTareas();
    };


  // =====================================
  // ACTUALIZAR ESTADO
  // =====================================

  const actualizarEstado =
    async (
      tareaId,
      estado
    ) => {

      try {

        const response =
          await axios.put(
            `${API_URL}/${tareaId}/estado`,
            {
              estado,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setTareas((prev) =>
          prev.map((t) =>
            t._id === tareaId
              ? response.data
              : t
          )
        );

      } catch (error) {

        console.log(error);

        Alert.alert(
          'Error',
          'No se pudo actualizar'
        );
      }
    };


  // =====================================
  // FILTRAR TURNO
  // =====================================

  const hoy = new Date()
        .toISOString()
        .split('T')[0]
  
  const tareasTurno =
   tareas.filter(
    (t) =>
      t.turno ==
        usuario?.turnoActual &&
      t.estado !==
        'FINALIZADO' &&
        !fechaAfiltrar?hoy:fechaAfiltrar == t.createdAt.split("T")[0]
        
      );
     

  // =====================================
  // LOADING
  // =====================================
console.log("tareas ",tareas)
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
  // EMPTY
  // =====================================

  console.log("tareasTurno",tareasTurno,usuario?.turnoActual)
  if (!tareasTurno.length ) {
    return (
      <View
        style={
          styles.emptyContainer
        }
      >
        <Text
          style={
            styles.emptyTitle
          }
        >
          No hay tareas
        </Text>

        <Text
          style={
            styles.emptyText
          }
        >
          No existen tareas
          para el turno
          {' '}
          {
            usuario?.turnoActual
          }
        </Text>

      </View>
    );
  }


  // =====================================
  // UI
  // =====================================

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Tareas del turno
      </Text>

      <Text style={styles.subtitle}>
        {usuario?.turnoActual}
      </Text>

      
      <FlatList
        data={tareasTurno}
        
        keyExtractor={(item) =>
          item._id
        }

        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              onRefresh
            }
          />
        }
        
        renderItem={({
          item,
        }) => (

          <View
            style={[
    styles.card,

    item.estado ===
      'PENDIENTE' &&
      styles.pendienteCard,

    item.estado ===
      'LEIDO' &&
      styles.leidoCard,

    item.estado ===
      'ACEPTADO' &&
      styles.aceptadoCard,

    item.estado ===
      'FINALIZADO' &&
      styles.finalizadoCard,
  ]}
          >

            <Text
              style={
                styles.cardTitle
              }
            >
              {
                item.tarea?.sabor
                  ?.nombre
              }
            </Text>
              <Text
              style={
                styles.cardText
              }
            >
              Unidades:
              {' '}
              {
                item.tarea?.unidades
                  
              }
            </Text>
            <Text
              style={
                styles.cardText
              }
            >
              Tanque:
              {' '}
              {
                item.tarea?.tanque
                  ?.numero
              }
            </Text>

            <Text
              style={
                styles.cardText
              }
            >
              Disolutor:
              {' '}
              {
                item.tarea
                  ?.disolutor
                  ?.numero
              }
            </Text>

            <Text
              style={
                styles.estado
              }
            >
              Estado:
              {' '}
              {item.estado}
            </Text>


            <View
              style={
                styles.buttonsRow
              }
            >

              {usuario?.rol !=="ADMIN" && <TouchableOpacity
                style={
                  styles.leidoButton
                }

                onPress={() =>
                  actualizarEstado(
                    item._id,
                    'LEIDO'
                  )
                }
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  LEÍDO
                </Text>
              </TouchableOpacity>}


              
              {usuario?.rol !=="ADMIN" && <TouchableOpacity
                style={
                  styles.aceptadoButton
                }

                onPress={() =>
                  actualizarEstado(
                    item._id,
                    'ACEPTADO'
                  )
                }
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  ACEPTAR
                </Text>
              </TouchableOpacity>}

              <TouchableOpacity
                disabled = {item.estado== "FINALIZADO"?true:null}
                style={styles.finalizadoButton}
                onPress={() =>
                  actualizarEstado(
                    item._id,
                    'FINALIZADO'
                  )
                }
              >
                <Text style={styles.buttonText}>
                  FINALIZAR 
                </Text>
              </TouchableOpacity>
              
            </View>

              <TouchableOpacity
                style={styles.chatButton}
                onPress={() =>
                  navigation.navigate(
                    'TareaDetalle',
                    {
                      tareaId: item._id,
                    }
                  )
                }
              >
                <Text style={styles.buttonText}>
                  CHAT
                </Text>
              </TouchableOpacity>
          </View>
        )}
      />
      </View>
    
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
        '#F5F5F5',
      padding: 16,
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
    },

    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#222',
    },

    subtitle: {
      color: '#666',
      marginBottom: 20,
    },

    emptyContainer: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
    },

    emptyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },

    emptyText: {
      color: '#666',
      marginTop: 10,
    },

    card: {
      backgroundColor:
        '#fff',
      padding: 16,
      borderRadius: 16,
      marginBottom: 20,
      
      margin:20,
      width:"90%",
    },

    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },

    cardText: {
      color: '#555',
      marginBottom: 4,
    },

    estado: {
      marginTop: 10,
      fontWeight: 'bold',
    },

    buttonsRow: {
      flexDirection: 'row',
      marginTop: 16,
    },

    leidoButton: {
      flex: 1,
      backgroundColor:
        '#FF9500',
      padding: 12,
      borderRadius: 12,
      marginRight: 10,
      alignItems: 'center',
    },

    aceptadoButton: {
      flex: 1,
      backgroundColor:
        '#28A745',
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    finalizadoButton: {
      flex: 1,
      backgroundColor: '#DC3545',
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginLeft: 10,
    },

    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    pendienteCard: {
  borderLeftWidth: 8,
  borderRightWidth:8,
  borderRightColor:'#FF3B30',
  borderLeftColor:
    '#FF3B30',
},

leidoCard: {
  borderLeftWidth: 8,
  borderRightWidth:8,
  borderRightColor:'#FF9500',
  borderLeftColor:
    '#FF9500',
},

aceptadoCard: {
  borderLeftWidth: 8,
  borderRightWidth:8,
  borderRightColor:'#34C759',
  borderLeftColor:
    '#34C759',
},

finalizadoCard: {
  borderLeftWidth: 8,
  borderRightWidth:8,
  borderRightColor:'#8E8E93',
  opacity: 0.7,
  borderLeftColor:
    '#8E8E93',
  opacity: 0.7,
},
chatButton: {
  flex: 1,
  backgroundColor: '#007AFF',
  padding: 12,
  borderRadius: 12,
  alignItems: 'center',
  marginLeft: 10,
},
  });