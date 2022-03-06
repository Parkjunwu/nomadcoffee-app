import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectPhoto from "./SelectPhotoNav/SelectPhoto";
import UploadForm from "./SelectPhotoNav/UploadForm";

const Stack = createNativeStackNavigator();

const SelectPhotoNav = () => {

  return (
    <Stack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor:"black"
      },
    }}>
      <Stack.Screen name="SelectPhoto" component={SelectPhoto} />
      <Stack.Screen name="UploadForm" component={UploadForm} />
    </Stack.Navigator>
  );
};

export default SelectPhotoNav;