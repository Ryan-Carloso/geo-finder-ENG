// App.js
import React from 'react';
import { ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './homescreen';
import { MainComponent } from './MainComponent';
import Catch from './catch';  // Verifique o caminho e o nome do arquivo
import Tutorial from './tutorial';  // Verifique o caminho e o nome do arquivo


const Stack = createStackNavigator();

export default function App() {
  return (
    <ImageBackground source={require('./assets/backft.png')} style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} /> 
          <Stack.Screen name="Find his/her location!" component={MainComponent} />
          <Stack.Screen name="Generate code" component={Catch} />
          <Stack.Screen name="Tutorial, how the app works" component={Tutorial} />

        </Stack.Navigator>
      </NavigationContainer>
    </ImageBackground>
  );
}
