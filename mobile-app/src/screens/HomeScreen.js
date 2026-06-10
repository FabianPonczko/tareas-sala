import React , {useEffect,useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';

import { socket } from '../services/socket';


import axios from 'axios';

const API_URL =
  'https://tareas-sala.onrender.com/api/tareas';

// =====================================
// HOME SCREEN
// =====================================

export default function HomeScreen() {
  const navigation =
    useNavigation();

  const {
    usuario,
    token,
    logout,
    actualizarTurno,
  } = useAuth();

  const [tareas, setTareas] =
    useState([]);

  

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
          
          console.log("error",error);
          
       

      } finally {
        console.log("tareas",tareas)
        
        
      }
    };

  // =====================================
  // CAMBIAR TURNO
  // =====================================

  const cambiarTurno =
    async (turno) => {
      await actualizarTurno(
        turno
      );
    };

    useEffect(() => {
      obtenerTareas()
       socket.on(
              'nuevaTarea',
              (nuevaTarea) => {
                console.log("llego una tarea",nuevaTarea)
                 setTareas(prev =>
          prev.map(t =>
            t._id === nuevaTarea._id
              ? {
                  ...t,
                  tareasPendientes:
                    (t.tareasPendientes || 0) + 1
                }
              : t
          )
        );
              }
            );
    }, []);


  // =====================================
  // UI
  // =====================================

  return (
    <ScrollView
      style={styles.container}
    >

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Hola{' '}
          {usuario?.nombre}
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          Sistema de tareas
          Sala de bebidas
        </Text>
      </View>


      {/* ========================= */}
      {/* USUARIO */}
      {/* ========================= */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Información del
          usuario
        </Text>

        <Text style={styles.info}>
          Rol:{' '}
          <Text
            style={
              styles.bold
            }
          >
            {usuario?.rol}
          </Text>
        </Text>

        <Text style={styles.info}>
          Turno actual:{' '}
          <Text
            style={
              styles.bold
            }
          >
            {
              usuario?.turnoActual
            }
          </Text>
        </Text>
      </View>


      {/* ========================= */}
      {/* TURNOS */}
      {/* ========================= */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Seleccionar turno
        </Text>

        <View
          style={
            styles.turnosContainer
          }
        >

          <TouchableOpacity
            style={[
              styles.turnoButton,

              usuario?.turnoActual ===
                'MAÑANA' &&
                styles.turnoSelected,
            ]}
            onPress={() =>
              cambiarTurno(
                'MAÑANA'
              )
            }
          >
            <Text
              style={
                styles.turnoText
              }
            >
              Mañana
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={[
              styles.turnoButton,

              usuario?.turnoActual ===
                'TARDE' &&
                styles.turnoSelected,
            ]}
            onPress={() =>
              cambiarTurno(
                'TARDE'
              )
            }
          >
            <Text
              style={
                styles.turnoText
              }
            >
              Tarde
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={[
              styles.turnoButton,

              usuario?.turnoActual ===
                'NOCHE' &&
                styles.turnoSelected,
            ]}
            onPress={() =>
              cambiarTurno(
                'NOCHE'
              )
            }
          >
            <Text
              style={
                styles.turnoText
              }
            >
              Noche
            </Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* ========================= */}
      {/* ACCIONES */}
      {/* ========================= */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Acciones
        </Text>


        {/* TAREAS */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            navigation.navigate(
              'Tareas'
            )
          }
        >
          <Text
            style={
              styles.actionText
            }
          >
            Ver tareas
          </Text>
          {tareas.tareasPendientes > 0 &&
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {tareas.tareasPendientes}
            </Text>
          </View>
          }
        </TouchableOpacity>


        {/* ADMIN */}
        {usuario?.rol ===
          'ADMIN' && (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor:
                  '#007AFF',
              },
            ]}
            onPress={() =>
              navigation.navigate(
                'Admin'
              )
            }
          >
            <Text
              style={
                styles.actionText
              }
            >
              Panel administrador
            </Text>
          </TouchableOpacity>
        )}


        {/* LOGOUT */}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            {
              backgroundColor:
                '#DC3545',
            },
          ]}
          onPress= {logout} >

          <Text
            style={
              styles.actionText
            }
          >
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>


      {/* ========================= */}
      {/* INFO TURNOS */}
      {/* ========================= */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Horarios turnos
        </Text>

        <Text style={styles.info}>
          🌅 Mañana:
          06:00 - 14:00
        </Text>

        <Text style={styles.info}>
          🌇 Tarde:
          14:00 - 22:00
        </Text>

        <Text style={styles.info}>
          🌙 Noche:
          22:00 - 06:00
        </Text>
      </View>

      <View
        style={{
          height: 40,
        }}
      />
    </ScrollView>
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
        '#F4F6F8',
      padding: 16,
    },

    header: {
      marginBottom: 20,
    },

    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#222',
    },

    subtitle: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
    },

    card: {
      backgroundColor:
        '#fff',
      borderRadius: 18,
      padding: 18,
      marginBottom: 18,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.08,

      shadowRadius: 4,

      elevation: 3,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 14,
      color: '#222',
    },

    info: {
      fontSize: 16,
      marginBottom: 10,
      color: '#444',
    },

    bold: {
      fontWeight: 'bold',
      color: '#111',
    },

    turnosContainer: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
    },

    turnoButton: {
      flex: 1,
      backgroundColor:
        '#DDD',
      paddingVertical: 14,
      marginHorizontal: 4,
      borderRadius: 14,
      alignItems: 'center',
    },

    turnoSelected: {
      backgroundColor:
        '#28A745',
    },

    turnoText: {
      color: '#fff',
      fontWeight: 'bold',
    },

    actionBtn: {
      backgroundColor:
        '#28A745',
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: 'center',
      marginBottom: 12,
    },

    actionText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
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