import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image, ImageBackground } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { styles } from './Styles'; // Assumindo que este é o caminho correto para o arquivo Styles.js

export const MainComponent = () => {
  const navigation = useNavigation();

  const [location, setLocation] = useState(null);
  const [name, setName] = useState('');
  const [seunomename, setSeunomename] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [userMarker, setUserMarker] = useState(null);
  const [firebaseMarker, setFirebaseMarker] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedData');
        if (savedData) {
          const { name: savedName, seunomename: savedSeunomename } = JSON.parse(savedData);
          setName(savedName);
          setSeunomename(savedSeunomename);
        }
      } catch (error) {
        console.error('Erro ao carregar dados salvos do AsyncStorage:', error);
      }
    };

    loadSavedData();
  }, []);

  const handleShowMap = async (event) => {
    event.persist(); // Garante que o evento não seja reciclado
  
    const currentTime = new Date().getTime();
  
    if (lastClickTime && currentTime - lastClickTime < 3600000) {
      setShowMap(true);
      return;
    }
  
    if (!code || code.length !== 8) {
      Alert.alert('Campo obrigatório', 'Por favor, insira um código válido de 8 caracteres.');
      return;
    }
  
    try {
      await AsyncStorage.setItem('savedData', JSON.stringify({ name, seunomename }));
    } catch (error) {
      console.error('Erro ao salvar dados no AsyncStorage:', error);
    }
  
    setLoading(true);
  
    const firebaseDatabaseUrl = 'https://geo-finder-7e641-default-rtdb.europe-west1.firebasedatabase.app/';
    try {
      const response = await axios.get(`${firebaseDatabaseUrl}/users/${code}.json`);
  
      if (response.data) {
        const { latitude, longitude, name, code } = response.data;
  
        setFirebaseMarker({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          name: name || 'Aleatório',
          code: code || 'Aleatório',
        });
  
        setRegion({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
  
        setShowMap(true);
        setLastClickTime(currentTime);
      } else {
        Alert.alert('Usuário não encontrado', 'Nenhuma localização encontrada para o código especificado.');
      }
    } catch (error) {
      console.error('Erro ao buscar dados de localização do Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowMap(false);
  };

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão de localização negada');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);

      setUserMarker({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });

      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []); // Executa apenas uma vez na montagem do componente

  const handleZoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  const handleZoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };

  const handleGoToUserLocation = () => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handleGoToFirebaseLocation = () => {
    if (firebaseMarker) {
      setRegion({
        latitude: firebaseMarker.latitude,
        longitude: firebaseMarker.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <ImageBackground source={require('./assets/backft.png')} style={{ flex: 1 }}>
      <View style={styles.container}>
        {!showMap ? (
          <View style={styles.inputContainer}>
            <Text style={styles.inputxt1}>Place the code below</Text>
            <TextInput
              style={styles.input}
              placeholder="Place the code here"
              placeholderTextColor="#000000"
              value={code}
              onChangeText={(text) => setCode(text)}
              keyboardType="default"
              maxLength={8} // Ajuste conforme o tamanho do código gerado
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleShowMap}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Find Now!</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
            >
              {userMarker && (
                <Marker
                  coordinate={{
                    latitude: userMarker.latitude,
                    longitude: userMarker.longitude,
                  }}
                  title={`You`}
                  description={`You are here!`}
                />
              )}
              {firebaseMarker && (
                <Marker
                  coordinate={{
                    latitude: firebaseMarker.latitude,
                    longitude: firebaseMarker.longitude,
                  }}
                  title={`Location of ${firebaseMarker.name}`}
                  description={`Name: ${firebaseMarker.name}, Code: ${firebaseMarker.code}`}
                />
              )}
            </MapView>
            <View style={styles.mapButtonsContainer}>
              <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
                <Text style={styles.zoomText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
                <Text style={styles.zoomText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.locationButton} onPress={handleGoToUserLocation}>
                <Text style={styles.locationText}>Me</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.locationButton} onPress={handleGoToFirebaseLocation}>
                <Text style={styles.locationText}>{firebaseMarker.name} location</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backText}>back</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Image
          source={require('./assets/fundoft.png')}
          style={styles.footerImage}
        />
      </View>
    </ImageBackground>
  );
};