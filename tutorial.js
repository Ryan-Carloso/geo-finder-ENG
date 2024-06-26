import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';

export default function Tutorial({ navigation }) {
  const handleOptionSelect1 = () => {
    navigation.navigate('Generate code', { selectedOption: 2 });
  };

  const handleOptionSelect = (option) => {
    navigation.navigate('Find his/her location!', { selectedOption: option });
  };

  return (
    <ImageBackground source={require('./assets/backdarker.png')} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20 }}>
          Ensuring Safety & Locating Loved Ones
        </Text>

        <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 20 }}>
          Your spouse, children, or anyone important to you!
        </Text>

        <Text style={{ fontSize: 18, color: 'white', textAlign: 'center', marginBottom: 20 }}>
          1 - First, download the app on the phone you want to track and click "Generate code".
        </Text>

        <TouchableOpacity
          style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginBottom: 20 }}
          onPress={handleOptionSelect1}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
            Generate code
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 18, color: 'white', textAlign: 'center', marginBottom: 20 }}>
          2 - Next, download the app on another phone to track the first phone and click "Find his/her location" to enter the code you just generated.
        </Text>

        <TouchableOpacity
          style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginBottom: 20 }}
          onPress={handleOptionSelect}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
            Find his/her location!
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 18, color: 'white', textAlign: 'center', marginBottom: 20 }}>
          That's all you need to do to always be in touch with your loved ones!
        </Text>

        <Image
          source={require('./assets/fundoft.png')}
          style={{ width: '100%', height: 100, position: 'absolute', bottom: 0 }}
        />
      </View>
    </ImageBackground>
  );
}