import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { styles } from './Styles';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Catch() {
  const [input1, setInput1] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);

  // Função para gerar o código
  const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$?';
    const length = 8; // Tamanho do código gerado
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  };

  // Função para salvar o código gerado no AsyncStorage
  const saveCodeToStorage = async (code) => {
    try {
      await AsyncStorage.setItem('@generatedCode', code);
    } catch (e) {
      console.error('Erro ao salvar código no AsyncStorage:', e);
    }
  };

  // Função para carregar o código do AsyncStorage ao inicializar o componente
  const loadCodeFromStorage = async () => {
    try {
      const savedCode = await AsyncStorage.getItem('@generatedCode');
      if (savedCode !== null) {
        setCode(savedCode);
        setShowCode(true);
      }
    } catch (e) {
      console.error('Erro ao carregar código do AsyncStorage:', e);
    }
  };

  // Efeito que carrega o código salvo ao inicializar o componente
  useEffect(() => {
    loadCodeFromStorage();
  }, []);

  // Handler para gerar um novo código
  const handleGenerate = () => {
    const generatedCode = generateCode();
    setCode(generatedCode);
    setShowCode(true);
    saveCodeToStorage(generatedCode); // Salva o código gerado no AsyncStorage
  };

  // Handler para salvar a localização
  const handleSave = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão de localização negada');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      
      const firebaseDatabaseUrl = 'https://geo-finder-7e641-default-rtdb.europe-west1.firebasedatabase.app/';
      const locationData = {
        name: input1,
        code: code,
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      };

      await axios.put(`${firebaseDatabaseUrl}/users/${code}.json`, locationData);

      setInput1('');
      setShowCode(false);
      Alert.alert('Sucesso', 'Localização salva com sucesso.');

    } catch (error) {
      console.error('Erro ao obter ou enviar localização:', error);
      Alert.alert('Erro', 'Falha ao salvar localização. Por favor, tente novamente.');
    }
  };

  return (
    <ImageBackground source={require('./assets/backft.png')} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput
          style={styles.input}
          placeholder="Put here a name"
          placeholderTextColor="#000000"
          value={input1}
          onChangeText={(text) => setInput1(text)}
          keyboardType="default"
          maxLength={16}
        />
        <TouchableOpacity
          style={{ backgroundColor: 'lightblue', padding: 10, marginVertical: 10 }}
          onPress={handleGenerate}
        >
          <Text>Generate Code</Text>
        </TouchableOpacity>

        {/* Exibindo o código gerado */}
        {showCode && (
          <View style={{ alignItems: 'center' }}>
            <View style={{backgroundColor: 'white', borderRadius: 10,}}>            
            <Text style={styles.inputxt}>Code:</Text>
            </View>
            <View style={{backgroundColor: 'white', borderRadius: 10, marginTop: 10,}}>
            <Text style={styles.inputxt}>{code}</Text>
            </View>
          </View>
        )}

        {/* Botão para salvar a localização */}
        <TouchableOpacity
          style={{ backgroundColor: 'lightblue', padding: 10, marginVertical: 10 }}
          onPress={handleSave}
          disabled={!showCode} // Desabilita o botão se o código não tiver sido gerado
        >
          <Text>Save locate</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
