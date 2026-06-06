
import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  } from 'react-native';

import axios from 'axios';

import { Picker } from
  '@react-native-picker/picker';

import { useAuth } from
  '../context/AuthContext';

  import { socket } from '../services/socket';



import { useNavigation } from '@react-navigation/native';


// =====================================
// API
// =====================================


const API_URL =
  'https://tareas-sala.onrender.com/api';

  
  // =====================================
  // TURNOS
  // =====================================
  
  const TURNOS = [
    {
      label:
      'Mañana (06-14)',
      value: 'MAÑANA',
    },
    
    {
      label:
      'Tarde (14-22)',
      value: 'TARDE',
    },
    
  {
    label:
    'Noche (22-06)',
    value: 'NOCHE',
  },
];


// =====================================
// SCREEN
// =====================================

export default function AdminScreen() {
  
  const navigation =
      useNavigation();

  const [usuariosOnline, setUsuariosOnline] = useState([]);
  

  const {
    token,
    usuario,
  } = useAuth();

  // =====================================
  // STATES
  // =====================================

  const [loading, setLoading] = useState(true);

  const [tareasActivas,setTareasActivas] = useState([]);

  const [sabores, setSabores] =  useState([]);

  const [tanques, setTanques] =  useState([]);
     
  const [unidades, setUnidades] =  useState([]);

  const [disolutores, setDisolutores] =  useState([]);

  const [selectedSabor, setSelectedSabor] =  useState('');

  const [selectedTanque, setSelectedTanque] =  useState('');

  const [selectedUnidades, setSelectesUnidades] =  useState('');

  const [selectedDisolutor, setSelectedDisolutor] =  useState('');

  const [selectedTurno, setSelectedTurno] = useState('MAÑANA');

  const [fecha, setFecha] =  useState(new Date().toLocaleDateString('sv-SE'));

  const [fechaAfiltrar, setFechaAfiltrar] =  useState(new Date().toLocaleDateString('sv-SE'));


  
const hoy = new Date().toLocaleDateString('sv-SE');

    const obtenerTareasActivas =
  async () => {

    try {

      const response =
        await axios.get(
          `${API_URL}/tareas/activas`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setTareasActivas(
        response.data
      );

    } catch (error) {

      console.log(error);

    }
  };

  const finalizarTarea =
  async (id) => {

    try {

      await axios.put(
        `${API_URL}/tareas/${id}/finalizar`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      Alert.alert(
        'Éxito',
        'Tarea finalizada'
      );

      obtenerTareasActivas();

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Error',
        'No se pudo finalizar'
      );
    }
  };

  // =====================================
  // OBTENER CATÁLOGOS
  // =====================================
  
  const obtenerCatalogos =
  async () => {
      try {
        
        const response =
        await axios.get(
          `${API_URL}/catalogos`,
          {
            headers: {
              Authorization:
              `Bearer ${token}`,
            },
          }
        );
        
        setSabores(
          response.data.sabores
        );
        
        setTanques(
          response.data.tanques
        );

        setUnidades(
          response.data.unidades
        );
        
        setDisolutores(
          response.data.disolutores
        );
        
      } catch (error) {
        
        console.log(error);
        
        Alert.alert(
          'Error',
          'No se pudieron cargar los catálogos'
        );
        
      } finally {
        
        setLoading(false);
        
      }
    };

    
    // =====================================
    // INIT
    // =====================================
    
  useEffect(() => {
    
    obtenerCatalogos();
    obtenerTareasActivas();
     
    socket.on(
      'usuarios_conectados',
      (usuarios) => {

        setUsuariosOnline(
          usuarios
        );
      }
    );

  return () => {
    socket.off(
      'usuarios_conectados'
    );
  };
  }, []);
  

  


  // =====================================
  // ENVIAR TAREA
  // =====================================
  
  const enviarTarea =
  async () => {

      try {

        if (
          !selectedSabor ||
          !selectedTanque ||
          !unidades ||
          !selectedDisolutor
        ) {
          return (Alert.alert(
            'Error',
            'Completá todos los campos'
          ),console.log('Completá todos los campos',unidades));
        }

        await axios.post(
          `${API_URL}/tareas`,
          {
            sabor:
              selectedSabor,

            tanque:
              selectedTanque,

             unidades:
              Number(unidades), 

            disolutor:
              selectedDisolutor,

            turno:
              selectedTurno,

            fecha,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );
        Alert.alert(
          'Éxito',
          'Tarea enviada correctamente'
        );

      } catch (error) {

        console.log(error);

        Alert.alert(
          'Error',
          'No se pudo enviar la tarea'
        );

      }
    };


  // =====================================
  // LOADING
  // =====================================

  // console.log("tareasactivas",tareasActivas)

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

    <ScrollView
      style={styles.container}
    >
      
      
      <Text style={styles.title}>
        Panel Administrador
      </Text>

      <Text style={styles.subtitle}>
        Bienvenido {usuario?.nombre}
      </Text>


      {/* ================================= */}
      {/* SABOR */}
      {/* ================================= */}

      <Text
        style={styles.sectionTitle}
      >
        Sabor
      </Text>

      <View style={styles.pickerBox}>
        <Picker style={styles.picker}
          selectedValue={
            selectedSabor
          }
          onValueChange={
            setSelectedSabor
          }
          
        >
          <Picker.Item
            label="Seleccionar sabor"
            value=""
           
          />

          {sabores.map((s) => (
            <Picker.Item
              key={s._id}
              label={s.nombre}
              value={s._id}
             
            />
          ))}
        </Picker>
      </View>


      {/* ================================= */}
      {/* TANQUE */}
      {/* ================================= */}

      <Text
        style={styles.sectionTitle}
      >
        Tanque
      </Text>

      <View style={styles.pickerBox}>
        <Picker style={styles.picker}
          selectedValue={
            selectedTanque
          }
          onValueChange={
            setSelectedTanque
          }
        >
          <Picker.Item
            label="Seleccionar tanque"
            value=""
            
          />

          {tanques.map((t) => (
            <Picker.Item
              key={t._id}
              label={t.numero}
              value={t._id}
             
            />
          ))}
        </Picker>
      </View>

      {/* ======================== */}
      {/* Unidades */}
      {/* ======================== */}

          <Text style={styles.sectionTitle}
          >
            Unidades
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Cantidad
            </Text>
            <TextInput  
                style={styles.inputbox}
                keyboardType="numeric"
                placeholder="Ej: 120"
                 placeholderTextColor="#666"
                value={unidades}
                onChangeText={(value) =>
                  setUnidades(value)
                }
                 maxLength={3}
                 
            />
            
            </View>
          
      {/* ================================= */}
      {/* DISOLUTOR */}
      {/* ================================= */}

      <Text
        style={styles.sectionTitle}
      >
        Disolutor
      </Text>

      <View style={styles.pickerBox}>
        <Picker style={styles.picker}
          selectedValue={
            selectedDisolutor
          }
          onValueChange={
            setSelectedDisolutor
          }
        >
          <Picker.Item
            label="Seleccionar disolutor"
            value=""
          />

          {disolutores.map((d) => (
            <Picker.Item
              key={d._id}
              label={d.numero}
              value={d._id}
            />
          ))}
        </Picker>
      </View>


      {/* ================================= */}
      {/* TURNOS */}
      {/* ================================= */}

      <Text
        style={styles.sectionTitle}
      >
        Turno
      </Text>

      <View
        style={
          styles.turnosContainer
        }
      >
        {TURNOS.map(
          (turno) => (

            <TouchableOpacity
              key={
                turno.value
              }

              style={[
                styles.turnoButton,

                selectedTurno ===
                  turno.value &&
                  styles.turnoSelected,
              ]}

              onPress={() =>
                setSelectedTurno(
                  turno.value
                )
              }
            >
              <Text
                style={
                  styles.turnoText
                }
              >
                {turno.label}
              </Text>

            </TouchableOpacity>
          )
        )}
      </View>




<View style={styles.card}>

  <Text style={styles.sectionTitle}>
    Usuarios conectados
  </Text>

  {
    Array.isArray(usuariosOnline) && usuariosOnline.map((u) => (

      <View
        key={u._id}
        style={{
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderColor: '#eee',
          flex:1
        }}
      >

        <Text>
          🟢 {u.nombre}
        </Text>

        <Text>
          {u.rol}
        </Text>

        <Text>
          {u.turnoActual}
        </Text>

      </View>
    ))
  }

</View>


      {/* ================================= */}
      {/* RESUMEN */}
      {/* ================================= */}



      <View
        style={
          styles.summaryCard
        }
      >

        <Text
          style={
            styles.summaryTitle
          }
        >
          Resumen
        </Text>
          

        <Text>
          Fecha: {fecha}
        </Text>

        <Text>
          Turno: {selectedTurno}
        </Text>

          
      </View>


      {/* ================================= */}
      {/* BOTÓN */}
      {/* ================================= */}

      <TouchableOpacity
        style={
          styles.sendButton
        }

        onPress={
          enviarTarea
        }
      >
        <Text
          style={
            styles.sendButtonText
          }
        >
          Enviar tarea
        </Text>

      </TouchableOpacity>
          
         <TouchableOpacity
                     style={[
                       styles.sendButton,
                       {
                         backgroundColor:
                           '#007AFF',
                       },
                     ]}
                     onPress={() =>
                       navigation.navigate(
                         'Tareas',{fecha:hoy}
                       )
                     }
                   >
                     <Text
                         style={
                        styles.sendButtonText
                      }
                     >
                       Ver Tareas
                     </Text>
                   </TouchableOpacity>
                 

        {/* <TareasScreen /> */}


        <View
          style={
            styles.summaryCard}
        >

          <Text
            style={
              styles.summaryTitle1
            }
          >
              Fecha a filtrar (yyyy-mm-dd)
            </Text>
                       
            <TextInput style={{width:"100%",textAlign:"center", Color:"#666"}}
              value={fechaAfiltrar}
              onChangeText={setFechaAfiltrar}>
           
            </TextInput>
          
          <TouchableOpacity
                     style={[
                       styles.sendButton,
                       {
                         backgroundColor:
                           '#38abdc',
                       },
                     ]}
                     onPress={() =>
                      navigation.navigate(
                        'Tareas',
                        {
                          fecha:
                            fechaAfiltrar
                        }
                      )
                     }
                   >
                     <Text
                         style={
                        styles.sendButtonText
                      }
                     >
                       Filtrar Tareas por fecha
                     </Text>
                   </TouchableOpacity>
            
            

            {/* <TextInput
              value={fechaAfiltrar}
              onChangeText={setFechaAfiltrar}
              placeholder='yyyy-mm-dd'
            >
            </TextInput> */}
        </View>

            {/* {fechaAfiltrar !== fecha && <TareasScreen fechaAfiltrar={fechaAfiltrar}/>} */}

  
      <View
        style={{
          height: 50,
        }}
      />

    </ScrollView>
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

    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#222',
      marginBottom: 6,
    },

    subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 10,
    },

    pickerBox: {
      backgroundColor:
        '#DDD',
      borderRadius: 20,
      height:50,
      marginBottom: 16,
      overflow: 'hidden',
      padding:5
    },

    picker:{
      color:"#666",
      borderRadius:16,
      padding:10,
      height:50
    },

    turnosContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 20,
    },

    turnoButton: {
      backgroundColor:
        '#ccc',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      marginRight: 10,
      marginBottom: 10,
    },

    turnoSelected: {
      backgroundColor:
        '#007AFF',
    },

    turnoText: {
      color: '#fff',
      fontWeight: 'bold',
    },

    summaryCard: {
      backgroundColor:
        '#fff',
      padding: 16,
      borderRadius: 16,
      marginBottom: 20,
    },
    
   
    

    summaryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      
    },
     summaryTitle1: {
     
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign:"center"
    },

    sendButton: {
      backgroundColor:
        '#28A745',
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginBottom:12
    },

    sendButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    finalizarButton: {
      backgroundColor:
        '#DC3545',
      marginTop: 12,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
     inputContainer: {
  backgroundColor: '#fff',
  borderRadius: 14,
  padding: 12,
  marginBottom: 16,
},

inputLabel: {
  fontSize: 12,
  color: '#DDD',
  marginBottom: 6,
  fontWeight: '600',
},

inputbox: {
  fontSize: 18,
  fontWeight: 'bold',
  borderWidth: 5,
  borderColor: '#DDD',
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical: 10,
  backgroundColor: '#FAFAFA',
  color:"#000"
},
  });