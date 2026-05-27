import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';


// =====================================
// COLORES ESTADOS
// =====================================

const estadoColors = {
  PENDIENTE: '#FF9800',

  LEIDO: '#2196F3',

  ACEPTADO: '#4CAF50',
};


// =====================================
// COMPONENTE TASK CARD
// =====================================

export default function TaskCard({
  tarea,
  onPress,
  onAceptar,
  onLeido,
  usuario,
}) {

  // =====================================
  // DATOS TAREA
  // =====================================

  const producto =
    tarea?.tarea
      ?.productoTrabajo ||
    'Sin producto';

  const tanque =
    tarea?.tarea
      ?.ubicacionTanque ||
    'Sin tanque';

  const maquina =
    tarea?.tarea
      ?.equipoMaquina ||
    'Sin máquina';

  const estado =
    tarea?.estado ||
    'PENDIENTE';

  const colorEstado =
    estadoColors[
      estado
    ] || '#999';


  // =====================================
  // FECHA
  // =====================================

  const fecha =
    tarea?.fecha
      ? new Date(
          tarea.fecha
        ).toLocaleDateString(
          'es-AR'
        )
      : 'Sin fecha';


  // =====================================
  // ACTUALIZADO POR
  // =====================================

  const actualizadoPor =
    tarea?.actualizadoPor
      ?.nombre ||
    'Sin actualizar';


  // =====================================
  // UI
  // =====================================

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {producto}
        </Text>

        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                colorEstado,
            },
          ]}
        >
          <Text
            style={
              styles.badgeText
            }
          >
            {estado}
          </Text>
        </View>
      </View>


      {/* INFO */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>
          Tanque:
        </Text>

        <Text style={styles.value}>
          {tanque}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>
          Máquina:
        </Text>

        <Text style={styles.value}>
          {maquina}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>
          Turno:
        </Text>

        <Text style={styles.value}>
          {tarea.turno}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>
          Fecha:
        </Text>

        <Text style={styles.value}>
          {fecha}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>
          Última acción:
        </Text>

        <Text style={styles.value}>
          {actualizadoPor}
        </Text>
      </View>


      {/* BOTONES */}
      <View style={styles.buttonsRow}>

        {/* LEÍDO */}
        {estado ===
          'PENDIENTE' && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.readButton,
            ]}
            onPress={
              onLeido
            }
          >
            <Text
              style={
                styles.buttonText
              }
            >
              Marcar leído
            </Text>
          </TouchableOpacity>
        )}


        {/* ACEPTAR */}
        {estado !==
          'ACEPTADO' && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.acceptButton,
            ]}
            onPress={
              onAceptar
            }
          >
            <Text
              style={
                styles.buttonText
              }
            >
              Aceptar tarea
            </Text>
          </TouchableOpacity>
        )}
      </View>


      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tocar para abrir
          detalles y chat
        </Text>
      </View>
    </TouchableOpacity>
  );
}


// =====================================
// STYLES
// =====================================

const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        '#fff',
      borderRadius: 18,
      padding: 16,
      marginBottom: 16,
      elevation: 3,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.1,

      shadowRadius: 5,
    },

    header: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },

    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 10,
      color: '#222',
    },

    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 50,
    },

    badgeText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 12,
    },

    infoRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },

    label: {
      fontWeight: 'bold',
      width: 120,
      color: '#555',
    },

    value: {
      flex: 1,
      color: '#222',
    },

    buttonsRow: {
      flexDirection: 'row',
      marginTop: 18,
      justifyContent:
        'space-between',
    },

    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },

    readButton: {
      backgroundColor:
        '#2196F3',
      marginRight: 8,
    },

    acceptButton: {
      backgroundColor:
        '#4CAF50',
      marginLeft: 8,
    },

    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },

    footer: {
      marginTop: 14,
      borderTopWidth: 1,
      borderTopColor:
        '#eee',
      paddingTop: 10,
    },

    footerText: {
      color: '#777',
      fontSize: 12,
      textAlign: 'center',
    },
  });