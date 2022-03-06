import React, { useEffect, useRef, useState } from "react";
import { Camera } from 'expo-camera';
import { Image, Text, View } from "react-native";
import Slider from '@react-native-community/slider';
import styled from "styled-components/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useIsFocused } from "@react-navigation/native";
import * as MediaLibrary from 'expo-media-library';
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Container = styled.View`
  flex:1;
`;
const ControllerContainer = styled.View`
  flex:1;
  background-color: black;
  flex-direction: row;
`;
const DivideLeftContainer = styled.View`
  flex:1;
  margin-top: auto;
  margin-bottom: auto;
`;
const DivideContainer = styled.View`
  flex:1;
  justify-content: center;
  align-items: center;
`;
const DivideSliderContainer = styled.View`
  flex:1;
  align-items: center;
`;
const CameraTypeBtn = styled.TouchableOpacity`
  margin-bottom: 10px;
  padding-left: 20px;
`;
const FlashModeBtn = styled.TouchableOpacity`
  padding-left: 20px;
`;
const TakePhotoBtn = styled.TouchableOpacity`
  background-color: white;
  width: 70px;
  height: 70px;
  border-radius: 35px;
  border: 5px;
  border-color: rgba(0,0,0,0.2);
`;
const DisposePhotoBtn = styled.TouchableOpacity`

`;
const SaveAndUploadBtn = styled(DisposePhotoBtn)``;
const SaveBtn = styled(DisposePhotoBtn)``;
const DismissBtn = styled(DisposePhotoBtn)``;
const DisposePhotoBtnText = styled.Text`
  color: white;
`;

type INavProps = {
  Tabs: undefined;
  // TakePhoto: {photoUri:string};
  TakePhoto: undefined;
  UploadForm: {file:string};
}
type Props = NativeStackScreenProps<INavProps, 'TakePhoto'>;

const TakePhoto = ({navigation}:Props) => {
  const camera = useRef<Camera>();
  const [hasPermission, setHasPermission] = useState<null|boolean>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode,setFlashMode] = useState(Camera.Constants.FlashMode.off)
  const [zoom,setZoom] = useState(0);
  const [onCameraReady,setOnCameraReady] = useState(false);
  const [takePhoto,setTakePhoto] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      // MediaLibrary 권한은 TakePhoto 에서. 얘가 그리고 처음 나오는 화면.
      const { accessPrivileges } = await MediaLibrary.getPermissionsAsync();
      const { accessPrivileges:a } = await MediaLibrary.requestPermissionsAsync()
    })();
  }, []);

  const onPressFlashMode = () => {
    setFlashMode(prev => {
      if(prev === Camera.Constants.FlashMode.off) {
        return Camera.Constants.FlashMode.on;
      } else if (prev === Camera.Constants.FlashMode.on) {
        return Camera.Constants.FlashMode.auto;
      } else {
        return Camera.Constants.FlashMode.off;
      }
    });
  };

  const onPressTakePhoto = async() => {
    if(camera.current && onCameraReady) {
      const {uri} = await camera.current.takePictureAsync({
        quality:1,
        exif:true,
        skipProcessing:true,
      });
      setTakePhoto(uri);
    }
  };

  const onPressSaveAndUpload = async() => {
    await MediaLibrary.saveToLibraryAsync(takePhoto);
    navigation.navigate("TakePhoto");
  };
  const onPressSave = () => {
    MediaLibrary.saveToLibraryAsync(takePhoto);
  };
  const onPressDismiss = () => {
    setTakePhoto("")
  };

  const isFocused = useIsFocused();

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Container>
      {!takePhoto && isFocused ? <Camera ref={camera} style={{flex:3}} type={type} flashMode={flashMode} zoom={zoom} onCameraReady={() => setOnCameraReady(true)}/> : <Image style={{flex:1}} source={{uri:takePhoto}} />}
        {!takePhoto ? <ControllerContainer>
          <DivideLeftContainer>
            <CameraTypeBtn
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <Ionicons name="camera-reverse-outline" size={35} color="white" />
            </CameraTypeBtn>
            <FlashModeBtn
              onPress={onPressFlashMode}>
              {flashMode === Camera.Constants.FlashMode.on ? 
              <Ionicons name="flash-outline" size={35} color="white" /> : flashMode === Camera.Constants.FlashMode.off ? 
              <Ionicons name="flash-off" size={35} color="white" /> :
              <MaterialIcons name="flash-auto" size={35} color="white" />
              }
            </FlashModeBtn>
          </DivideLeftContainer>
          <DivideSliderContainer>
            <Slider
              value={zoom}
              onValueChange={value => setZoom(value)}
              style={{width: 200, height: 40}}
            />
            <TakePhotoBtn onPress={onPressTakePhoto}/>
          </DivideSliderContainer>
          <DivideContainer />
        </ControllerContainer>
        :
        <ControllerContainer>
          <DivideContainer>
            <SaveAndUploadBtn onPress={onPressSaveAndUpload}>
              <DisposePhotoBtnText>Save & Upload</DisposePhotoBtnText>
            </SaveAndUploadBtn>
          </DivideContainer>
          <DivideContainer>
            <SaveBtn onPress={onPressSave}>
              <DisposePhotoBtnText>Save</DisposePhotoBtnText>
            </SaveBtn>
          </DivideContainer>
          <DivideContainer>
            <DismissBtn onPress={onPressDismiss}>
              <DisposePhotoBtnText>Dismiss</DisposePhotoBtnText>
            </DismissBtn>
          </DivideContainer>
        </ControllerContainer>}
    </Container>
  );
};
export default TakePhoto;