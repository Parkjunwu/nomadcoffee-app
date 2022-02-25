import React, { useState } from 'react';
import { Asset } from 'expo-asset';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import {Ionicons} from "@expo/vector-icons"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './mainScreens/Home';
import Search from './mainScreens/Search';
import Profile from './mainScreens/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { client, isUserLoggedInVar, tokenVar } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogIn from './mainScreens/LogIn';
import { ThemeProvider } from 'styled-components/native';
import { lightTheme } from './style';
import 'react-native-gesture-handler';
import CommonNavigation from './navigation/CommonNavigation';

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
        {/* <StatusBar /> */}
        {/* <SafeAreaView style={{flex:1}}> */}
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{
                // title:"coffee"
                headerShown:false
              }}
            >
              {/* <Tab.Screen name="home" component={Home} /> */}
              <Tab.Screen name="home">
                {()=>CommonNavigation(Home)}
              </Tab.Screen>
              <Tab.Screen name="search" component={Search} />
              {isLoggedIn ? <Tab.Screen name="profile" component={Profile} /> : <Tab.Screen name="LogIn" component={LogIn} />}
            </Tab.Navigator>
          </NavigationContainer>
        {/* </SafeAreaView> */}
      </ThemeProvider>
    </ApolloProvider>
  );
}
