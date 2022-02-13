import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import {Ionicons} from "@expo/vector-icons"

export default function Apps() {
  const fonts = [Ionicons.font]
  const loadFonts = fonts.map((font) => Font.loadAsync(font))
  const assets = [require('../assets/coffee.jpeg')];
  const loadAsset = assets.map(asset => Asset.loadAsync(asset));

  const startAsync = async() => {
    Promise.all([...loadFonts,...loadAsset])
  }

  const [isReady,setIsReady] = useState(false);
  if (!isReady) {
    console.log("not ready")
    return (
      <AppLoading
        startAsync={startAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }
  console.log("ready")
  return (
    <View>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}
