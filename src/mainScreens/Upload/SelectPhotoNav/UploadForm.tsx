import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import {Ionicons} from "@expo/vector-icons"
import styled from "styled-components/native";
// import DismissKeyboard from "../components/DismissKeyboard";
import { useForm } from "react-hook-form";
import { ApolloCache, DefaultContext, gql, MutationUpdaterFunction, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import KeyboardAvoidLayout from "../../../layout/KeyboardAvoidLayout";
import { createCoffeeShop, createCoffeeShopVariables } from "../../../__generated__/createCoffeeShop";
import { asyncGetPermissionAndPosition } from "../../../logic/reverseGeolocation";
import useMe from "../../../hooks/useMe";


const CREATE_COFFEE_SHOP_MUTATION = gql`
  mutation createCoffeeShop(
    $name:String!,
    $latitude:String!,
    $longitude:String!,
    $photoUrlArr:[Upload]!,
    $categories:String
  ){
    createCoffeeShop(
      name:$name,
      latitude:$latitude,
      longitude:$longitude,
      photoUrlArr:$photoUrlArr,
      categories:$categories
    ) {
      ok
      error
    }
  }
`;

const Container = styled.View`
  flex: 1;
  background-color: black;
  /* padding: 0px 40px; */
`;
const FullImageContainer = styled.View`
  /* background-color: tomato; */
  position: relative;
`;
const FullImageDeleteBtn = styled.TouchableOpacity`
  z-index: 1;
  position: absolute;
  top: 10px;
  right: 10px;
  /* background-color: tomato; */
  opacity: 0.5;
`;
const FullImageDeleteBtnText = styled.Text`
`;
const Photo = styled.Image`
  height: 350px;
`;
const ImageContainer = styled.View`
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
`;
const IconContainer = styled.View`
  position: absolute;
  bottom: 10%;
  right: 10%;
`;
const SelectedPhotoComponent = styled.View`
  width: 15px;
  height: 15px;
  border-radius: 10px;
  background-color: yellow;
`;
const SelectedPhotoComponentText = styled.Text`
  font-size: 12px;
  text-align: center;
`;
const CaptionContainer = styled.View`
  margin-top: 30px;
`;
const AnnounceText = styled.Text`
  font-size: 15px;
  text-align: center;
  color: white;
  margin-top: 3px;
`;
const Input = styled.TextInput`
  background-color: white;
  color: black;
  padding: 10px 20px;
  border-radius: 100px;
`;
const Name = styled(Input)`
  margin-bottom: 7px;
`;
const Caption = styled(Input)``;
const HeaderRightText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;
const PositionBtnContainer = styled.View`

`;
const CurrentPositionBtn = styled.TouchableOpacity`

`;
const CurrentPositionBtnText = styled.Text`
  color: white;
`;
type TabParamList = {
  FeedTab:undefined;
  SearchTab:undefined;
  CameraTab:undefined;
  NotificationTab:undefined;
  MeTab:undefined;
};
type NativeStackParamList = {
  Tabs:NavigatorScreenParams<TabParamList>;
  Upload:undefined;
  UploadForm:{file:string[]};
  ////
  Home:undefined;
  ////
};
type Props = NativeStackScreenProps<NativeStackParamList,"UploadForm">
interface IForm {
  caption: string;
}

// ??? ???????????? index
let fullImageIndex:number;
const realUploadPhoto:Array<any> = [];

const UploadForm = ({navigation,route}:Props) => {
  // TextInput ??? ?????? useForm
  const {register,handleSubmit,setValue,getValues} = useForm<IForm>();
  useEffect(() => {
    register("caption"
      // ?????? ????????????
      // ,{required:true,}
    );
  },[register]);

  // ????????? ?????? ?????? ???????????? ?????? ????????? ?????????.
  const {data} = useMe();

  // navigation ?????? ?????? ?????? uri ??????
  const [photoUriArr,setPhotoUriArr] = useState(route.params.file);

  // ????????? ?????? ?????? ??????
  const updatecreateCoffeeShop:MutationUpdaterFunction<any, createCoffeeShopVariables, DefaultContext, ApolloCache<any>> = (cache,result) => {
    const {data:{createCoffeeShop:{ok,error,uploadedPost}}} = result;
    
    // ?????? ????????? ????????? ??????????????? ?????????
    if(!ok) {
      Alert.alert(error,"?????? ????????? ??????????????? ??????????????? ?????? ????????? ????????????????????????.")
    }

    // ????????? ?????? ???
    const createCoffeeShopCache = {
      // post ??? id ??? createdAt
      ...uploadedPost,
      // __typeName ??? ????????? ??????????
      user:data?.me,
      likes:0,
      caption:getValues("caption"),
      file:photoUriArr,
      commentNumber:0,
      isLiked:false,
      isMine:true,
    }
    // ?????? ??????
    cache.modify({
      id:"ROOT_QUERY",
      fields:{
        seeFeed(prev){
          return [createCoffeeShopCache,...prev]
        }
      }
    })
    // ??? ???????????? ??????
    navigation.navigate("Home")
  }
  
  // ????????? mutation
  const [createCoffeeShopMutation,{loading}] = useMutation<createCoffeeShop,createCoffeeShopVariables>(CREATE_COFFEE_SHOP_MUTATION,{
    update:updatecreateCoffeeShop
  })

  
  // ??? ?????? ?????????
  const [bigImage,setBigImage] = useState(photoUriArr[0]);

  // ????????? submit ?????? ???????????? mutation ??????
  const onValid = ({caption}:IForm) => {
    // ???????????? ????????? ReactNativeFile ??? ????????????.
    realUploadPhoto = photoUriArr.map(uri => (
      new ReactNativeFile({
        uri,
        name: "1.jpg",
        type: "image/jpeg",
      })
    ))
    // const file = new ReactNativeFile({
    //   uri,
    //   name: "1.jpg",
    //   type: "image/jpeg",
    // });
    // ????????? Mutation
    createCoffeeShopMutation({
      variables:{
        name:nameValue,
        // latitude:latitudeValue+"",
        // longitude:longitudeValue+"",
        latitude:"0",
        longitude:"0",
        photoUrlArr:realUploadPhoto,
        ...( categoriesValue && { categories:categoriesValue }),
      }
    })
  }

  // ??????????????? ?????? ??????
  const HeaderRight = () => <TouchableOpacity onPress={handleSubmit(onValid)}>
    <HeaderRightText>Next</HeaderRightText>
  </TouchableOpacity>
  const HeaderRightLoading = () => <ActivityIndicator size="small" color="white" style={{marginRight:10}}/>

  useEffect(() => {
    navigation.setOptions({
      title:"Upload",
      headerStyle:{
        backgroundColor:"black"
      },
      headerTintColor:"white",
      // headerBackImageSource:{uri:"https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Gtk-go-back-ltr.svg/120px-Gtk-go-back-ltr.svg.png"}

      headerLeft:({tintColor}) => loading ? null : <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Ionicons name="close" color={tintColor} size={30} />
      </TouchableOpacity>,
      headerRight:loading ? HeaderRightLoading : HeaderRight,
    });
  },[loading])

  // ?????? ?????? ??????
  const {width} = useWindowDimensions();
  // ????????? ?????? ??????/??????
  const imageWidth = width/4;

  // ?????? ?????? ?????? ?????????.
  const renderItem = ({ item:uri, index, drag, isActive }: RenderItemParams<string>) => {
    fullImageIndex=index;
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          onPressIn={() => setBigImage(uri)}
          // disabled={isActive} // ??? ??????
          // style={{ backgroundColor: isActive ? "red" : "yellow" }}
        >
          <Image source={{uri}} style={{width:imageWidth,height:imageWidth}}/>
          <IconContainer>
            <SelectedPhotoComponent>
              <SelectedPhotoComponentText>{index}</SelectedPhotoComponentText>
            </SelectedPhotoComponent>
          </IconContainer>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };



  // ??? ???????????? ?????? ?????? ?????? ????????? ???
  const onFullPhotoDeleteBtnClick = () => {
    const onPressDeleteOk = () => {
      setPhotoUriArr(prev => {
        const newArr = [...prev];
        newArr.splice(fullImageIndex,1);
        return newArr;
      })
      setBigImage(photoUriArr[0])
    }

    Alert.alert("?????? ????????? ????????? ???????????? ?????????????????????????",undefined,[
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "OK", onPress: onPressDeleteOk }
    ])
  }

  const [nowLocation,setNowLocation] = useState<string>();
  const [nameValue,setNameValue] = useState<string>("")
  const [latitudeValue,setLatitudeValue] = useState<number>();
  const [longitudeValue,setLongitudeValue] = useState<number>();
  const [categoriesValue,setCategoriesValue] = useState<string>("");


  const setLocation = ({latitude,longitude}:{latitude:number,longitude:number}) => {
    setLatitudeValue(latitude);
    setLongitudeValue(longitude);
    return {latitude,longitude};
  };

  const onGetLocationClick = async() => asyncGetPermissionAndPosition(setLocation,setNowLocation);

  // ??????
  return (
    <KeyboardAvoidLayout>
      <Container>


        {/* ????????? ????????? ????????? ?????? ?????? ?????? ?????? */}
        <FullImageContainer>
          {/* ??? ????????? ?????? ?????? ?????? ??????. 1??? ????????????. */}
          {photoUriArr.length !== 1 && <FullImageDeleteBtn onPress={onFullPhotoDeleteBtnClick}>
            <FullImageDeleteBtnText>???</FullImageDeleteBtnText>
          </FullImageDeleteBtn>}
          <Photo source={{uri:bigImage}} resizeMode="contain" />
        </FullImageContainer>
        <ImageContainer>
          <DraggableFlatList
            data={photoUriArr}
            onDragEnd={({ data }) => setPhotoUriArr(data)}
            // ?????? ????????? ?????? index ??? ???????????? ???????????????? ????????? ????????????. index ?????????
            keyExtractor={(item) => item}
            renderItem={renderItem}
            horizontal={true}
            contentContainerStyle={{
              // ?????? ????????? ????????? ????????? ?????????.
              flexDirection: 'row',
            }}
            bounces={false}
          />
        </ImageContainer>
        <AnnounceText>?????? ????????? ????????? ???????????? ??? ????????????.</AnnounceText>

       


        
        <CaptionContainer>
          <Name value={nameValue} onChangeText={text=>setNameValue(text)} placeholder="Coffee Shop Name"/>
          {/* <Input value={latitudeValue+""} placeholder="latitude"/>
          <Input value={longitudeValue+""} placeholder="longitude"/>
          <PositionBtnContainer>
            <CurrentPositionBtn onPress={onGetLocationClick}>
              <CurrentPositionBtnText>?????? ????????? ????????????</CurrentPositionBtnText>
            </CurrentPositionBtn>
          </PositionBtnContainer>
          <Input value={categoriesValue} onChangeText={text=>setCategoriesValue(text)} placeholder="Categories"/> */}
          <Caption
            placeholder="Write a caption..."
            placeholderTextColor="rgba(0,0,0,0.5)"
            onChangeText={(text)=>setValue("caption",text)}
            onSubmitEditing={handleSubmit(onValid)}
            returnKeyType="done"
          />
        </CaptionContainer>
      </Container>
    </KeyboardAvoidLayout>
  );
}
export default UploadForm;


// import React from "react";

// const UploadForm = () => {
//   return<></>;
// }

// export default UploadForm;