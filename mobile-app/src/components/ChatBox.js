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

import { socket } from '../services/socket';


// =====================================
// CONFIG API
// =====================================

const API_URL =
  'http://TU_IP_LOCAL:3000/api/chat';


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

        setMensajes(res.data);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd(
            {
              animated: true,
            }
          );
        }, 200);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };


  // =====================================
  // SOCKETS
  // =====================================

  useEffect(() => {
    obtenerMensajes();

    // Entrar sala tarea
    socket.emit(
      'joinTaskRoom',
      tareaId
    );

    // Nuevo mensaje realtime
    socket.on(
      'nuevoMensaje',
      (nuevoMensaje) => {
        setMensajes((prev) => [
          ...prev,
          nuevoMensaje,
        ]);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd(
            {
              animated: true,
            }
          );
        }, 100);
      }
    );

    // Mensaje eliminado
    socket.on(
      'mensajeEliminado',
      ({
        mensajeId,
      }) => {
        setMensajes((prev) =>
          prev.filter(
            (m) =>
              m._id !==
              mensajeId
          )
        );
      }
    );

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
      if (!texto.trim())
        return;

      try {
        await axios.post(
          API_URL,
          {
            tarea: tareaId,
            mensaje: texto,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setTexto('');
      } catch (error) {
        console.log(error);
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
        console.log(error);
      }
    };


  // =====================================
  // RENDER MENSAJE
  // =====================================

  const renderItem = ({
    item,
  }) => {
    const esMio =
      item.usuarioId?._id ===
        usuario?.id ||
      item.usuarioId ===
        usuario?.id;

    return (
      <View
        style={[
          styles.messageContainer,

          esMio &&
            styles.myMessage,
        ]}
      >
        <Text style={styles.user}>
          {item.nombreUsuario}
        </Text>

        <Text style={styles.message}>
          {item.mensaje}
        </Text>

        <View
          style={
            styles.footerMessage
          }
        >
          <Text style={styles.time}>
            {new Date(
              item.createdAt
            ).toLocaleTimeString(
              'es-AR',
              {
                hour: '2-digit',
                minute:
                  '2-digit',
              }
            )}
          </Text>

          {item.editado && (
            <Text
              style={
                styles.editado
              }
            >
              editado
            </Text>
          )}
        </View>

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
                styles.delete
              }
            >
              Eliminar
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <Text style={styles.title}>
        Notas / Chat
      </Text>

      <FlatList
        ref={flatListRef}
        data={mensajes}
        keyExtractor={(item) =>
          item._id
        }
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="Escribí un mensaje..."
          style={styles.input}
          multiline
        />

        <TouchableOpacity
          style={styles.button}
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
      alignSelf: 'flex-start',
    },

    myMessage: {
      backgroundColor:
        '#DCF8C5',
      alignSelf: 'flex-end',
    },

    user: {
      fontWeight: 'bold',
      marginBottom: 5,
    },

    message: {
      fontSize: 16,
    },

    footerMessage: {
      flexDirection: 'row',
      marginTop: 5,
      alignItems: 'center',
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
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginTop: 10,
    },

    input: {
      flex: 1,
      minHeight: 45,
      maxHeight: 120,
      borderWidth: 1,
      borderColor: '#ccc',
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
  });