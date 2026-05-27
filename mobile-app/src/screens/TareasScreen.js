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

import TaskCard from '../components/TaskCard';

import { useAuth } from '../context/AuthContext';

import { socket } from '../services/socket';


// =====================================
// API
// =====================================

const API_URL =
  'http://10.24.138.167:3000/api/tareas';


// =====================================
// SCREEN
// =====================================

export default function TareasScreen({
  navigation,
}) {

  const {
    token,
    usuario,
  } = useAuth();

  const [tareas, setTareas] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);


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

    // Nueva tarea realtime
    socket.on(
      'nuevaTarea',
      (nuevaTarea) => {
        setTareas((prev) => [
          nuevaTarea,
          ...prev,
        ]);
      }
    );

    // Estado actualizado realtime
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
            t._id ===
            tareaId
              ? response.data
              : t
          )
        );

        Alert.alert(
          'Éxito',
          `Tarea marcada como ${estado}`
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
  // FILTRAR POR TURNO
  // =====================================

  const tareasTurno =
    tareas.filter(
      (t) =>
        t.turno ===
        usuario?.turnoActual
    );


  // =====================================
  // RENDER ITEM
  // =====================================

  const renderItem = ({
    item,
  }) => (
    <TaskCard
      tarea={item}

      usuario={usuario}

      onPress={() =>
        navigation.navigate(
          'TareaDetalle',
          {
            tareaId:
              item._id,
          }
        )
      }

      onLeido={() =>
        actualizarEstado(
          item._id,
          'LEIDO'
        )
      }

      onAceptar={() =>
        actualizarEstado(
          item._id,
          'ACEPTADO'
        )
      }
    />
  );


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
  // EMPTY
  // =====================================

  if (
    !tareasTurno.length
  ) {
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
          asignadas para el
          turno{' '}
          {
            usuario?.turnoActual
          }
        </Text>

        <TouchableOpacity
          style={
            styles.reloadButton
          }
          onPress={
            obtenerTareas
          }
        >
          <Text
            style={
              styles.reloadText
            }
          >
            Recargar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }


  // =====================================
  // UI
  // =====================================

  return (
    <View style={styles.container}>
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Tareas del turno
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          Turno:{' '}
          {
            usuario?.turnoActual
          }
        </Text>
      </View>


      {/* ========================= */}
      {/* LISTA */}
      {/* ========================= */}

      <FlatList
        data={tareasTurno}

        keyExtractor={(item) =>
          item._id
        }

        renderItem={renderItem}

        contentContainerStyle={{
          paddingBottom: 40,
        }}

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

    header: {
      marginBottom: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#222',
    },

    subtitle: {
      fontSize: 16,
      color: '#666',
      marginTop: 5,
    },

    emptyContainer: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
      padding: 30,
      backgroundColor:
        '#F5F5F5',
    },

    emptyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#222',
    },

    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      color: '#666',
      marginBottom: 20,
    },

    reloadButton: {
      backgroundColor:
        '#007AFF',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 14,
    },

    reloadText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });