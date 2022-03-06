import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TakePhoto from "./Upload/TakePhoto";
import SelectPhotoNav from "./Upload/SelectPhotoNav";

const Tab = createMaterialTopTabNavigator();

const Upload = () => {

  return (
    <Tab.Navigator tabBarPosition="bottom">
      <Tab.Screen name="Select" component={SelectPhotoNav} />
      <Tab.Screen name="TakePhoto" component={TakePhoto} />
    </Tab.Navigator>
  );
};

export default Upload;