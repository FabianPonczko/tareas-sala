import React, {
  useEffect,
} from 'react';

import {
  StatusBar,
  Platform,
} from 'react-native';

import * as Notifications from 'expo-notifications';

import {
  AuthProvider,
  useAuth,
} from './src/context/AuthContext';

import AppNavigator from './src/navigation/AppNavigator';

import {
  connectSocket,
  disconnectSocket,
} from './src/services/socket';


// =====================================
// CONFIG PUSH NOTIFICATIONS
// =====================================

Notifications.setNotificationHandler(
  {
    handleNotification:
      async () => ({
        shouldShowAlert:
          true,

        shouldPlaySound:
          true,

        shouldSetBadge:
          false,
      }),
  }
);


// =====================================
// ROOT APP
// =====================================

function RootApp() {
  const {
    token,
    isAuthenticated,
  } = useAuth();


  // =====================================
  // SOCKET CONNECTION
  // =====================================

  useEffect(() => {
    if (
      isAuthenticated &&
      token
    ) {
      connectSocket(
        token
      );
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [
    token,
    isAuthenticated,
  ]);


  // =====================================
  // LISTEN PUSH FOREGROUND
  // =====================================

  useEffect(() => {

    // Notificación recibida
    const subscription =
      Notifications.addNotificationReceivedListener(
        (
          notification
        ) => {
          console.log(
            '🔔 Push recibida:',
            notification
          );
        }
      );

    // Usuario toca notificación
    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        (
          response
        ) => {

      const data =
        response.notification
          .request
          .content
          .data;

      console.log(data);

          navigation.navigate(
            'TareaDetalle',
            {
              tareaId: data.tareaId,
            }
          );

          console.log(
            '👆 Push abierta:',
            response
          );

          // Ejemplo:
          // navegar a tarea
          //
          // const tareaId =
          // response.notification
          // .request.content.data
          // .tareaId;
        }
      );

    return () => {
      subscription.remove();

      responseListener.remove();
    };
  }, []);


  // =====================================
  // UI
  // =====================================

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
      />

      <AppNavigator />
    </>
  );
}


// =====================================
// MAIN APP
// =====================================

export default function App() {
  return (
    <AuthProvider>
      <RootApp />
    </AuthProvider>
  );
}