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
  RefreshControl,
} from 'react-native';

import axios from 'axios';

import { useAuth } from '../context/AuthContext';


// =====================================
// API
// =====================================

const API_URL =
  'https://tareas-sala.onrender.com/api/tareas/historial';


// =====================================
// SCREEN
// =====================================

export default function HistorialTareasScreen() {

  const {
    token,
  } = useAuth();

  const [tareas, setTareas] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing,
    setRefreshing] =
    useState(false);


  // =====================================
  // OBTENER HISTORIAL
  // =====================================

  const obtenerHistorial =
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

      } finally {

        setLoading(false);

        setRefreshing(false);
      }
    };


  // =====================================
  // INIT
  // =====================================

  useEffect(() => {

    obtenerHistorial();

  }, []);


  // =====================================
  // REFRESH
  // =====================================

  const onRefresh =
    async () => {

      setRefreshing(true);

      await obtenerHistorial();
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
  // EMPTY
  // =====================================

  if (!tareas.length) {

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
          Sin historial
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
        Historial de tareas
      </Text>


      <FlatList
        data={tareas}

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
            style={
              styles.card
            }
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
              {item.turno}
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


            <Text
              style={
                styles.fecha
              }
            >
              Fecha:
              {' '}
              {
                new Date(
                  item.createdAt
                ).toLocaleString(
                  'es-AR'
                )
              }
            </Text>

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

    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#222',
    },

    card: {
      backgroundColor:
        '#fff',
      padding: 16,
      borderRadius: 16,
      marginBottom: 14,
    },

    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },

    cardText: {
      color: '#555',
      marginBottom: 5,
    },

    estado: {
      marginTop: 10,
      fontWeight: 'bold',
      color: '#007AFF',
    },

    fecha: {
      marginTop: 8,
      color: '#777',
      fontSize: 12,
    },
  });