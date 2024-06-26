import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, Linking } from 'react-native';
import { styles } from './Styles';

export default function HomeScreen({ navigation }) {
  const handleOptionSelect = (option) => {
    navigation.navigate('Find his/her location!', { selectedOption: option });
  };

  const handleOptionSelect1 = () => {
    navigation.navigate('Generate code', { selectedOption: 2 });
  };
  const handleOptionSelect3 = () => {
    navigation.navigate('Tutorial, how the app works', { selectedOption: 2 });
  };

  const openTutorialLink = () => {
    // Replace 'YOUR_TIKTOK_VIDEO_LINK' with the actual link to your tutorial video on TikTok
    const tutorialLink = 'https://www.tiktok.com/@thepoliticalmind/video/7308755285512867078?is_from_webapp=1&sender_device=pc';

    // Open the link in the device's default browser
    Linking.openURL(tutorialLink);
  };

  return (
    <ImageBackground source={require('./assets/backft.png')} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.tutorialtitle}>Choose an option:</Text>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleOptionSelect(1)}
        >
          <Text style={styles.optionButtonText}>Find his/her location!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleOptionSelect1()}
        >
          <Text style={styles.optionButtonText}>Generate code</Text>
        </TouchableOpacity>

        {/* New button for the tutorial */}
        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: 'blue' }]}
          onPress={handleOptionSelect3}
        >
          <Text style={styles.optionButtonText}>Tutorial</Text>
        </TouchableOpacity>
        <Text style={styles.inputxt4}>Click Above for a tutorial on</Text>
        <Text style={styles.inputxt4}>how to use the App!</Text>


        <Image
          source={require('./assets/fundoft.png')}
          style={styles.footerImage}
        />
      </View>
    </ImageBackground>
  );
}
