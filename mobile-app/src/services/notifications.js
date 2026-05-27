import * as Device
  from 'expo-device';

import * as Notifications
  from 'expo-notifications';

import Constants
  from 'expo-constants';

import {
  Platform,
} from 'react-native';


// =====================================
// CONFIG
// =====================================

Notifications
  .setNotificationHandler({
    handleNotification:
      async () => ({
        shouldShowAlert:
          true,

        shouldPlaySound:
          true,

        shouldSetBadge:
          false,
      }),
  });


// =====================================
// REGISTER PUSH TOKEN
// =====================================

export const registrarPushToken =
  async () => {

    try {

      // WEB NO SOPORTA PUSH
      if (
        Platform.OS === 'web'
      ) {

        console.log(
          'Push notifications no soportadas en web'
        );

        return null;
      }


      // DEVICE REAL
      if (!Device.isDevice) {

        console.log(
          'Usar dispositivo físico'
        );

        return null;
      }


      // PERMISOS

      const {
        status:
          existingStatus,
      } =
        await Notifications
          .getPermissionsAsync();

      let finalStatus =
        existingStatus;

      if (
        existingStatus !==
        'granted'
      ) {

        const {
          status,
        } =
          await Notifications
            .requestPermissionsAsync();

        finalStatus =
          status;
      }


      if (
        finalStatus !==
        'granted'
      ) {

        console.log(
          'Permiso denegado'
        );

        return null;
      }


      // TOKEN

      const tokenData =
        await Notifications
          .getExpoPushTokenAsync();

      const token =
        tokenData.data;

      console.log(
        'PUSH TOKEN:',
        token
      );


      // ANDROID

      if (
        Platform.OS ===
        'android'
      ) {

        await Notifications
          .setNotificationChannelAsync(
            'default',
            {
              name:
                'default',

              importance:
                Notifications
                  .AndroidImportance
                  .MAX,
            }
          );
      }


      return token;

    } catch (error) {

      console.log(
        'ERROR PUSH:',
        error
      );

      return null;
    }
  };