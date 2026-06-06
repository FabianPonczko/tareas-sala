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
  TextInput,
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

export default function TareasScreen({route}) {
  
  const fechaAfiltrar =
  route?.params?.fecha;

  const [numeroSap, setNumeroSap] =
  useState("");

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
    

     const [
      mensajesPendientes,
      setMensajesPendientes
    ] = useState({});
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
  socket.on(
    'mensajeNoLeido',
    ({ tareaId }) => {
         
          setMensajesPendientes(
            prev => ({
              ...prev,
              [tareaId]:
                (prev[tareaId] || 0) + 1
            })
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
    socket.off(
      'mensajeNoLeido'
    );
    
  };
  
}, []);




  // =====================================
  // REFRESH
  // =====================================

  const onRefresh =
    async () => {

      setRefreshing(true);

      await obtenerTareas();
    };


  // =====================================
  // ACTUALIZAR SAP
  // =====================================

  const actualizarSap =
    async (
      tareaId,
      sap
    ) => {

      try {

        const response =
          await axios.put(
            `${API_URL}/${tareaId}/sap`,
            {
              sap,
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

 const hoy = new Date().toLocaleDateString('sv-SE');
  


  const tareasTurno =
   tareas.filter(
    (t) =>
      t.turno == usuario?.turnoActual &&
      //  fechaAfiltrar == hoy ? null: t.estado !== 'FINALIZADO' &&
      t.fecha.split("T")[0] ==   (fechaAfiltrar || hoy )
        
      );
     
  

  // =====================================
  // LOADING
  // =====================================
// console.log("tareas ",tareas)
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

  // console.log("tareasTurno",tareasTurno,usuario?.turnoActual)
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
        {usuario?.turnoActual} {" "}{!fechaAfiltrar?hoy:fechaAfiltrar}
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
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}  >

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
            
            
            
            {item.estado === "ACEPTADO" || item.sap && 
            <Text style={
                styles.cardTitle
              }
            >
              
              
              
              Sap: {item.sap || 
              <TextInput    
              placeholder="Número SAP"
              value={numeroSap}
              onChangeText={setNumeroSap} 
              keyboardType="numeric"
              style={{
                borderWidth: 1, }
              }
              />
              }
            </Text>
            }
              </View>

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
                styles.cardText
              }
            >
              Turno:
              {' '}
              {
                item.turno
                  
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

              {usuario?.rol !=="ADMIN" && 
              
              <TouchableOpacity
                style={[
                  styles.leidoButton,
                  item.estado === "LEIDO" || item.estado === "ACEPTADO" ? { backgroundColor: '#A5A5A5' } : null
                ]
                }
                disabled={item.estado === "LEIDO" || item.estado === "ACEPTADO" ? true : null}

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
                style={[

                  item.estado !== "ACEPTADO" ? styles.aceptadoButton : styles.buttonSap,
                  item.estado === "ACEPTADO" ? { backgroundColor: '#18010d' } : null
                ]
                }

                onPress={() => item.estado !== "ACEPTADO" ?
                  actualizarEstado(
                    item._id,
                    'ACEPTADO'
                  ):
                   numeroSap ? actualizarSap(
                    item._id,
                    numeroSap
                  ) : Alert.alert("Error","Ingrese un número de SAP válido")
                }
              >
                <Text 
                  style={
                     styles.buttonText 
                  }
                >
                  {item.estado === "ACEPTADO" ? "MODIFICAR SAP" : "ACEPTAR"}
                </Text>
              </TouchableOpacity>}



              <TouchableOpacity
                disabled = {item.sap ? null : true}
                style={[styles.finalizadoButton,
                  item.estado !== "ACEPTADO" || !item.sap ? { backgroundColor: '#A5A5A5' } : null
                ]}
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
                onPress={() => {

                  setMensajesPendientes(
                    prev => ({
                      ...prev,
                      [item._id]: 0,
                    })
                  );

                  navigation.navigate(
                    'TareaDetalle',
                    {
                      tareaId: item._id,
                    }
                  );
                }}
              >
                <Text style={styles.buttonText}>
                  CHAT
                {mensajesPendientes[item._id] > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {mensajesPendientes[item._id]}
                    </Text>
                  </View>
                )}
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
      backgroundColor: '#FF9500',
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
      fontSize:12,
    },
    buttonSap: {
      flex: 1,
      backgroundColor: '#18010d',   
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
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
  marginTop: 25,
},
badge: {
  position: 'absolute',
  top: -8,
  right: -8,
  backgroundColor: 'red',
  borderRadius: 10,
  minWidth: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 4,
},

badgeText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},
  });