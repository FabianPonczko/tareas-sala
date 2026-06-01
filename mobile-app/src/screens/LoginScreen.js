// import React, {
//   useState,
// } from 'react';

// import axios from 'axios';

// import {
//   registrarPushToken,
// } from '../services/notifications';

// export default function LoginScreen() {
//   const [email, setEmail] =
//     useState('');

//   const [password, setPassword] =
//     useState('');

//   const login = async () => {
//     try {
//       // Obtener token push
//       const pushToken =
//         await registrarPushToken();

//       // Login
//       const res =
//         await axios.post(
//           'http://10.24.138.167:3000/api/auth/login',
//           {
//             email,
//             password,
//             pushToken,
//           }
//         );

//       console.log(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };
// }
import React, {
  useState,useRef
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  useAuth,
} from '../context/AuthContext';


const login = {
  
}

// =====================================
// SCREEN
// =====================================

export default function LoginScreen() {

  const navigation =
    useNavigation();

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  // =====================================
  // LOGIN
  // =====================================

  const handleLogin =
    async () => {

      if (
        !email ||
        !password
      ) {
        return Alert.alert(
          'Error',
          'Completar campos'
        );
      }

      try {

        setLoading(true);

        await login({email,password,});

      } catch (error) {

        Alert.alert(
          'Error',
          'Credenciales inválidas'
        );

      } finally {

        setLoading(false);
      }
    };

    // Creamos la referencia para el input de la contraseña
    const passwordInputRef = useRef<TextInput>(null);

  // =====================================
  // UI
  // =====================================

  return (
    <View style={styles.container}>

      <View style={styles.card}>
      
        <Text style={styles.title}>
          Tareas Sala
        </Text>


        {/* EMAIL */}

        <TextInput
          placeholder="Email"
          placeholderTextColor="#666"
          style={styles.input}
          
          autoCapitalize="none"
          
          keyboardType="email-address"
          
          value={email}
          
          onChangeText={
            setEmail
          }
          returnKeyType="next" // Cambia el botón a "Siguiente"
          onSubmitEditing={() => passwordInputRef.current?.focus()} // Pasa al siguiente input
          
          />


        {/* PASSWORD */}

        <TextInput
          ref={passwordInputRef} // Asigna la referencia aquí
          placeholder="••••••••"
          placeholderTextColor="#666"
          style={styles.input}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          value={password}

          onChangeText={
            setPassword
          }
          returnKeyType="done" // Cambia el botón a "Hecho"
          onSubmitEditing={handleLogin} // Ejecuta el login directamente
        />


        {/* LOGIN BUTTON */}

        <TouchableOpacity
          style={styles.button}
          onPress={
            handleLogin
          }
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
              Ingresar
            </Text>
          )}

        </TouchableOpacity>
      

        {/* REGISTER BUTTON */}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'Register'
            )
          }
        >
          <Text
            style={
              styles.registerText
            }
          >
            Crear cuenta
          </Text>
        </TouchableOpacity>

      </View>

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

      justifyContent:
        'center',

      padding: 20,

      backgroundColor:
        '#F5F5F5',
    },

    card: {
      backgroundColor:
        '#fff',

      padding: 25,

      borderRadius: 20,

      elevation: 5,
    },

    title: {
      fontSize: 30,

      fontWeight: 'bold',

      textAlign: 'center',

      marginBottom: 30,
    },

    input: {
      borderWidth: 1,

      borderColor: '#ddd',

      borderRadius: 14,

      padding: 15,

      marginBottom: 15,

      backgroundColor:
        '#fafafa',

      color:"#666"
    },

    button: {
      backgroundColor:
        '#007AFF',

      padding: 16,

      borderRadius: 14,

      alignItems: 'center',

      marginTop: 10,
    },

    buttonText: {
      color: '#fff',

      fontWeight: 'bold',

      fontSize: 16,
    },

    registerText: {
      textAlign: 'center',

      marginTop: 20,

      color: '#007AFF',

      fontWeight: 'bold',
    },
  });