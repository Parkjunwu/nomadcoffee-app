import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import {Ionicons} from "@expo/vector-icons"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import Search from './screens/Search';
import Profile from './screens/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { client, isUserLoggedInVar, loggedUserIn, TOKEN, tokenVar } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogIn from './screens/LogIn';
import { ThemeProvider } from 'styled-components/native';
import { lightTheme } from './style';

const Tab = createBottomTabNavigator();

export default function Apps() {
  const isLoggedIn = useReactiveVar(isUserLoggedInVar);
  const fonts = [Ionicons.font]
  const loadFonts = fonts.map((font) => Font.loadAsync(font))
  const assets = [require('../assets/coffee.jpeg')];
  const loadAsset = assets.map(asset => Asset.loadAsync(asset));
  const isUserPreviousLoggedIn = async() => {
    const token = await AsyncStorage.getItem("token");
    if(token) {
      tokenVar(token);
      isUserLoggedInVar(true);
    }
  }

  const startAsync = async() => {
    Promise.all([...loadFonts,...loadAsset,isUserPreviousLoggedIn()])
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
    <ApolloProvider client={client}>
      <ThemeProvider theme={lightTheme}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="home" component={Home} />
          <Tab.Screen name="search" component={Search} />
          {isLoggedIn ? <Tab.Screen name="profile" component={Profile} /> : <Tab.Screen name="LogIn" component={LogIn} />}
        </Tab.Navigator>
      </NavigationContainer>
      </ThemeProvider>
    </ApolloProvider>
  );
}
