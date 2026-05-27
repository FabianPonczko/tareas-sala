// =====================================
// src/screens/RegisterScreen.js
// =====================================

import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';

import {
  useNavigation,
} from '@react-navigation/native';


// =====================================
// API
// =====================================

const API_URL =
  'http://10.24.138.167:3000/api/auth/register';


// =====================================
// SCREEN
// =====================================

export default function RegisterScreen() {

  const navigation =
    useNavigation();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      nombre: '',
      email: '',
      password: '',
      turnoActual:
        'MANANA',
    });


  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (
    key,
    value
  ) => {
    setForm({
      ...form,
      [key]: value,
    });
  };


  // =====================================
  // REGISTER
  // =====================================

  const register =
    async () => {

      if (
        !form.nombre ||
        !form.email ||
        !form.password
      ) {
        return Alert.alert(
          'Error',
          'Completar todos los campos'
        );
      }

      try {
        setLoading(true);

        await axios.post(
          API_URL,
          form
        );

        Alert.alert(
          'Éxito',
          'Usuario registrado'
        );

        navigation.navigate(
          'Login'
        );

      } catch (error) {

        console.log(
         error?.response?.data
        );

        Alert.alert(
          'Error',
          error?.response?.data
            ?.message ||
            'No se pudo registrar'
        );

      } finally {
        setLoading(false);
      }
    };


  // =====================================
  // UI
  // =====================================

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >

      <View style={styles.card}>

        <Text style={styles.title}>
          Registro
        </Text>


        {/* NOMBRE */}

        <TextInput
          placeholder="Nombre"

          style={styles.input}

          value={form.nombre}

          onChangeText={(text) =>
            handleChange(
              'nombre',
              text
            )
          }
        />


        {/* EMAIL */}

        <TextInput
          placeholder="Email"

          style={styles.input}

          keyboardType="email-address"

          autoCapitalize="none"

          value={form.email}

          onChangeText={(text) =>
            handleChange(
              'email',
              text
            )
          }
        />


        {/* PASSWORD */}

        <TextInput
          placeholder="Contraseña"

          style={styles.input}

          secureTextEntry

          value={form.password}

          onChangeText={(text) =>
            handleChange(
              'password',
              text
            )
          }
        />


        {/* TURNOS */}

        <Text style={styles.label}>
          Turno
        </Text>

        <View
          style={
            styles.turnosContainer
          }
        >

          {[
            'MANANA',
            'TARDE',
            'NOCHE',
          ].map(
            (turno) => (
              <TouchableOpacity
                key={turno}

                style={[
                  styles.turnoButton,

                  form.turnoActual ===
                    turno &&
                    styles.turnoSelected,
                ]}

                onPress={() =>
                  handleChange(
                    'turnoActual',
                    turno
                  )
                }
              >
                <Text
                  style={[
                    styles.turnoText,

                    form.turnoActual ===
                      turno &&
                      styles.turnoTextSelected,
                  ]}
                >
                  {turno}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>


        {/* BUTTON */}

        <TouchableOpacity
          style={styles.button}
          onPress={register}
          disabled={loading}
        >

          {loading ? (
            <ActivityIndicator
              color="#fff"
            />
          ) : (
            <Text
              style={
                styles.buttonText
              }
            >
              Registrarse
            </Text>
          )}
        </TouchableOpacity>


        {/* LOGIN */}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'Login'
            )
          }
        >
          <Text
            style={
              styles.loginText
            }
          >
            ¿Ya tenés cuenta?
            Iniciar sesión
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}


// =====================================
// STYLES
// =====================================

const styles =
  StyleSheet.create({
    container: {
      flexGrow: 1,

      justifyContent:
        'center',

      alignItems: 'center',

      backgroundColor:
        '#F5F5F5',

      padding: 20,
    },

    card: {
      width: '100%',

      backgroundColor:
        '#fff',

      borderRadius: 20,

      padding: 25,

      elevation: 5,
    },

    title: {
      fontSize: 30,

      fontWeight: 'bold',

      marginBottom: 25,

      textAlign: 'center',

      color: '#222',
    },

    input: {
      borderWidth: 1,

      borderColor: '#ddd',

      borderRadius: 14,

      paddingHorizontal: 15,

      paddingVertical: 14,

      marginBottom: 15,

      fontSize: 16,

      backgroundColor:
        '#fafafa',
    },

    label: {
      fontSize: 16,

      fontWeight: 'bold',

      marginBottom: 10,

      color: '#333',
    },

    turnosContainer: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      marginBottom: 25,
    },

    turnoButton: {
      flex: 1,

      paddingVertical: 12,

      borderRadius: 12,

      borderWidth: 1,

      borderColor: '#ccc',

      marginHorizontal: 5,

      alignItems: 'center',
    },

    turnoSelected: {
      backgroundColor:
        '#007AFF',

      borderColor:
        '#007AFF',
    },

    turnoText: {
      color: '#333',

      fontWeight: '600',
    },

    turnoTextSelected: {
      color: '#fff',
    },

    button: {
      backgroundColor:
        '#007AFF',

      paddingVertical: 15,

      borderRadius: 14,

      alignItems: 'center',

      marginBottom: 20,
    },

    buttonText: {
      color: '#fff',

      fontSize: 16,

      fontWeight: 'bold',
    },

    loginText: {
      textAlign: 'center',

      color: '#007AFF',

      fontWeight: '600',
    },
  });