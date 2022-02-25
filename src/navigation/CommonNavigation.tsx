import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Detail from "../navigationScreens/Detail";

const Stack = createStackNavigator();

const CommonNavigation = (Main:React.FC) => {
  return (
    <Stack.Navigator 
      // screenOptions={{headerMode:"screen"}}
    >
      <Stack.Screen name="Home" component={Main} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );
};
export default CommonNavigation;