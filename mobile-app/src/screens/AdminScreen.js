import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';

import axios from 'axios';

import { useAuth } from '../context/AuthContext';


// =====================================
// API
// =====================================

const API_URL =
  'http://10.24.138.167:3000/api';


// =====================================
// TURNOS
// =====================================

const TURNOS = [
  {
    label:
      'Mañana (06-14)',
    value: 'MANANA',
  },

  {
    label:
      'Tarde (14-22)',
    value: 'TARDE',
  },

  {
    label:
      'Noche (22-06)',
    value: 'NOCHE',
  },
];


// =====================================
// SCREEN ADMIN
// =====================================

export default function AdminScreen() {
  const {
    token,
    usuario,
  } = useAuth();

  const [tareas, setTareas] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [selectedTurno, setSelectedTurno] =
    useState('MANANA');

  const [fecha, setFecha] =
    useState(
      new Date()
        .toISOString()
        .split('T')[0]
    );


  // =====================================
  // OBTENER TAREAS PREFIJADAS
  // =====================================

  const obtenerTareas =
    async () => {
      try {
        const response =
          await axios.get(
            `${API_URL}/tareas/prefijadas`,
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
      }
    };


  useEffect(() => {
    obtenerTareas();
  }, []);


  // =====================================
  // ENVIAR TAREA
  // =====================================

  const enviarTarea =
    async () => {
      try {
        if (!selectedTask) {
          return Alert.alert(
            'Seleccioná una tarea'
          );
        }

        await axios.post(
          `${API_URL}/tareas`,
          {
            tareaId:
              selectedTask._id,

            turno:
              selectedTurno,

            fecha,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        Alert.alert(
          'Éxito',
          'Tarea enviada correctamente'
        );

        setSelectedTask(
          null
        );
      } catch (error) {
        console.log(error);

        Alert.alert(
          'Error',
          'No se pudo enviar la tarea'
        );
      }
    };


  // =====================================
  // RENDER TAREA
  // =====================================

  const renderTask = ({
    item,
  }) => {
    const selected =
      selectedTask?._id ===
      item._id;

    return (
      <TouchableOpacity
        style={[
          styles.taskCard,

          selected &&
            styles.selectedCard,
        ]}
        onPress={() =>
          setSelectedTask(
            item
          )
        }
      >
        <Text
          style={
            styles.taskTitle
          }
        >
          {
            item.productoTrabajo
          }
        </Text>

        <Text
          style={
            styles.taskText
          }
        >
          Tanque:{' '}
          {
            item.ubicacionTanque
          }
        </Text>

        <Text
          style={
            styles.taskText
          }
        >
          Máquina:{' '}
          {
            item.equipoMaquina
          }
        </Text>
      </TouchableOpacity>
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
    <ScrollView
      style={styles.container}
    >
      <Text style={styles.title}>
        Panel Administrador
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Bienvenido{' '}
        {usuario?.nombre}
      </Text>


      {/* ========================= */}
      {/* TAREAS */}
      {/* ========================= */}

      <Text
        style={
          styles.sectionTitle
        }
      >
        Seleccionar tarea
      </Text>

      <FlatList
        data={tareas}
        keyExtractor={(item) =>
          item._id
        }
        renderItem={renderTask}
        scrollEnabled={
          false
        }
      />


      {/* ========================= */}
      {/* TURNOS */}
      {/* ========================= */}

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
        {TURNOS.map(
          (turno) => (
            <TouchableOpacity
              key={
                turno.value
              }
              style={[
                styles.turnoButton,

                selectedTurno ===
                  turno.value &&
                  styles.turnoSelected,
              ]}
              onPress={() =>
                setSelectedTurno(
                  turno.value
                )
              }
            >
              <Text
                style={
                  styles.turnoText
                }
              >
                {
                  turno.label
                }
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>


      {/* ========================= */}
      {/* FECHA */}
      {/* ========================= */}

      <Text
        style={
          styles.sectionTitle
        }
      >
        Fecha
      </Text>

      <TextInput
        value={fecha}
        onChangeText={
          setFecha
        }
        style={styles.input}
        placeholder="YYYY-MM-DD"
      />


      {/* ========================= */}
      {/* RESUMEN */}
      {/* ========================= */}

      {selectedTask && (
        <View
          style={
            styles.summaryCard
          }
        >
          <Text
            style={
              styles.summaryTitle
            }
          >
            Resumen
          </Text>

          <Text>
            Producto:{' '}
            {
              selectedTask.productoTrabajo
            }
          </Text>

          <Text>
            Tanque:{' '}
            {
              selectedTask.ubicacionTanque
            }
          </Text>

          <Text>
            Máquina:{' '}
            {
              selectedTask.equipoMaquina
            }
          </Text>

          <Text>
            Turno:{' '}
            {
              selectedTurno
            }
          </Text>

          <Text>
            Fecha:{' '}
            {fecha}
          </Text>
        </View>
      )}


      {/* ========================= */}
      {/* BOTÓN */}
      {/* ========================= */}

      <TouchableOpacity
        style={styles.sendButton}
        onPress={
          enviarTarea
        }
      >
        <Text
          style={
            styles.sendButtonText
          }
        >
          Enviar tarea
        </Text>
      </TouchableOpacity>

      <View
        style={{
          height: 50,
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
      marginBottom: 6,
      color: '#222',
    },

    subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 10,
      color: '#222',
    },

    taskCard: {
      backgroundColor:
        '#fff',
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor:
        'transparent',
    },

    selectedCard: {
      borderColor:
        '#007AFF',
    },

    taskTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },

    taskText: {
      color: '#555',
    },

    turnosContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 10,
    },

    turnoButton: {
      backgroundColor:
        '#ddd',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      marginRight: 10,
      marginBottom: 10,
    },

    turnoSelected: {
      backgroundColor:
        '#007AFF',
    },

    turnoText: {
      color: '#fff',
      fontWeight: 'bold',
    },

    input: {
      backgroundColor:
        '#fff',
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 20,
    },

    summaryCard: {
      backgroundColor:
        '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
    },

    summaryTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 10,
    },

    sendButton: {
      backgroundColor:
        '#28A745',
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 10,
    },

    sendButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
  });