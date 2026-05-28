import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

import {
  registrarPushToken,
} from '../services/notifications';


// =====================================
// API
// =====================================

const API_URL =
  'https://tareas-sala.onrender.com/api/auth';


// =====================================
// CONTEXT
// =====================================

const AuthContext =
  createContext();


// =====================================
// PROVIDER
// =====================================

export const AuthProvider = ({
  children,
}) => {
  const [usuario, setUsuario] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // =====================================
  // CARGAR SESIÓN
  // =====================================

  useEffect(() => {
    cargarSesion();
  }, []);


  const cargarSesion =
    async () => {
      try {
        const storedToken =
          await AsyncStorage.getItem(
            'token'
          );

        const storedUser =
          await AsyncStorage.getItem(
            'usuario'
          );

        if (
          storedToken &&
          storedUser
        ) {
          setToken(
            storedToken
          );

          setUsuario(
            JSON.parse(
              storedUser
            )
          );

          axios.defaults.headers.common.Authorization =
            `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };


  // =====================================
  // LOGIN
  // =====================================

 const login = async ({ email, password, }) => {
    try {

      const pushToken =
        await registrarPushToken();

      const response =
        await axios.post(
          `${API_URL}/login`,
          {
            email,
            password,
            pushToken,
          }
        );

      const {
        token,
        usuario,
      } = response.data;

      setToken(token);
      setUsuario(usuario);

      axios.defaults.headers.common.Authorization =
        `Bearer ${token}`;

      await AsyncStorage.setItem(
        'token',
        token
      );

      await AsyncStorage.setItem(
        'usuario',
        JSON.stringify(usuario)
      );

      return {
        success: true,
      };

    } catch (error) {

      console.log(error);

      return {
        success: false,
        message:
          error?.response?.data?.message ||
          'Error login',
      };
    }
  };


  // =====================================
  // LOGOUT
  // =====================================

  const logout =
    async () => {
      try {
        if (token) {
          await axios.post(
            `${API_URL}/logout`,
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );
        }

        setUsuario(null);

        setToken(null);

        delete axios.defaults
          .headers.common
          .Authorization;

        await AsyncStorage.removeItem(
          'token'
        );

        await AsyncStorage.removeItem(
          'usuario'
        );
      } catch (error) {
        console.log(error);
      }
    };


  // =====================================
  // ACTUALIZAR TURNO
  // =====================================

  const actualizarTurno =
    async (
      turnoActual
    ) => {
      try {
        const response =
          await axios.put(
            `${API_URL}/turno`,
            {
              turnoActual,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setUsuario(
          response.data
        );

        await AsyncStorage.setItem(
          'usuario',
          JSON.stringify(
            response.data
          )
        );

        return {
          success: true,
        };
      } catch (error) {
        console.log(error);

        return {
          success: false,
        };
      }
    };


  // =====================================
  // REFRESH PERFIL
  // =====================================

  const refreshUsuario =
    async () => {
      try {
        const response =
          await axios.get(
            `${API_URL}/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setUsuario(
          response.data
        );

        await AsyncStorage.setItem(
          'usuario',
          JSON.stringify(
            response.data
          )
        );
      } catch (error) {
        console.log(error);
      }
    };


  // =====================================
  // VALUE
  // =====================================

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        loading,
        login,
        logout,
        actualizarTurno,
        refreshUsuario,
        isAuthenticated:
          !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// =====================================
// CUSTOM HOOK
// =====================================

export const useAuth =
  () =>
    useContext(
      AuthContext
    );


// =====================================
// EXPORT
// =====================================

export default AuthContext;