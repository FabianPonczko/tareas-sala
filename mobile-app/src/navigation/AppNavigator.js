// import React from 'react';

// import {
//   NavigationContainer,
// } from '@react-navigation/native';

// import {
//   createNativeStackNavigator,
// } from '@react-navigation/native-stack';

// import {
//   ActivityIndicator,
//   View,
// } from 'react-native';


// // =====================================
// // CONTEXT
// // =====================================

// import {
//   useAuth,
// } from '../context/AuthContext';


// // =====================================
// // SCREENS
// // =====================================

// import LoginScreen from '../screens/LoginScreen';

// import HomeScreen from '../screens/HomeScreen';

// import TareasScreen from '../screens/TareasScreen';

// import TareaDetalleScreen from '../screens/TareaDetalleScreen';

// import AdminScreen from '../screens/AdminScreen';


// // =====================================
// // STACK
// // =====================================

// const Stack =
//   createNativeStackNavigator();


// // =====================================
// // APP NAVIGATOR
// // =====================================

// export default function AppNavigator() {
//   const {
//     isAuthenticated,
//     usuario,
//     loading,
//   } = useAuth();


//   // =====================================
//   // LOADING
//   // =====================================

//   if (loading) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent:
//             'center',
//           alignItems:
//             'center',
//         }}
//       >
//         <ActivityIndicator
//           size="large"
//         />
//       </View>
//     );
//   }


//   // =====================================
//   // NAVIGATION
//   // =====================================

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           headerTitleAlign:
//             'center',

//           animation:
//             'slide_from_right',
//         }}
//       >

//         {/* ========================= */}
//         {/* NO LOGUEADO */}
//         {/* ========================= */}

//         {!isAuthenticated ? (
//           <Stack.Screen
//             name="Login"
//             component={
//               LoginScreen
//             }
//             options={{
//               headerShown:
//                 false,
//             }}
//           />
//         ) : (
//           <>
//             {/* ========================= */}
//             {/* HOME */}
//             {/* ========================= */}

//             <Stack.Screen
//               name="Home"
//               component={
//                 HomeScreen
//               }
//               options={{
//                 title:
//                   'Inicio',
//               }}
//             />


//             {/* ========================= */}
//             {/* TAREAS */}
//             {/* ========================= */}

//             <Stack.Screen
//               name="Tareas"
//               component={
//                 TareasScreen
//               }
//               options={{
//                 title:
//                   'Tareas',
//               }}
//             />


//             {/* ========================= */}
//             {/* DETALLE TAREA */}
//             {/* ========================= */}

//             <Stack.Screen
//               name="TareaDetalle"
//               component={
//                 TareaDetalleScreen
//               }
//               options={{
//                 title:
//                   'Detalle de tarea',
//               }}
//             />


//             {/* ========================= */}
//             {/* ADMIN */}
//             {/* ========================= */}

//             {usuario?.rol ===
//               'ADMIN' && (
//               <Stack.Screen
//                 name="Admin"
//                 component={
//                   AdminScreen
//                 }
//                 options={{
//                   title:
//                     'Panel administrador',
//                 }}
//               />
//             )}
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { useAuth }
  from '../context/AuthContext';


// Screens
import LoginScreen
  from '../screens/LoginScreen';

import RegisterScreen
  from '../screens/RegisterScreen';

import HomeScreen
  from '../screens/HomeScreen';

import TareasScreen
  from '../screens/TareasScreen';

import TareaDetalleScreen
  from '../screens/TareaDetalleScreen';

import AdminScreen
  from '../screens/AdminScreen';


// =====================================
// STACK
// =====================================

const Stack =
  createNativeStackNavigator();


// =====================================
// NAVIGATOR
// =====================================

export default function AppNavigator() {

  const {
    isAuthenticated,
    usuario,
  } = useAuth();


  return (
    <NavigationContainer>

      <Stack.Navigator>

        {!isAuthenticated ? (
          <>

            {/* LOGIN */}

            <Stack.Screen
              name="Login"
              component={
                LoginScreen
              }
              options={{
                headerShown:
                  false,
              }}
            />


            {/* REGISTER */}

            <Stack.Screen
              name="Register"
              component={
                RegisterScreen
              }
              options={{
                title:
                  'Registro',
              }}
            />

          </>
        ) : (
          <>

            {/* HOME */}

            <Stack.Screen
              name="Home"
              component={
                HomeScreen
              }
            />


            {/* TAREAS */}

            <Stack.Screen
              name="Tareas"
              component={
                TareasScreen
              }
            />


            {/* DETALLE */}

            <Stack.Screen
              name="TareaDetalle"
              component={
                TareaDetalleScreen
              }
              options={{
                title:
                  'Detalle tarea',
              }}
            />


            {/* ADMIN */}

            {usuario?.rol ===
              'ADMIN' && (
              <Stack.Screen
                name="Admin"
                component={
                  AdminScreen
                }
              />
            )}

          </>
        )}

      </Stack.Navigator>

    </NavigationContainer>
  );
}