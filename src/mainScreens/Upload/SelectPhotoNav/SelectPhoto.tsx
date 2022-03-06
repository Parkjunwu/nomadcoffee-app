// import React, { useEffect, useState } from "react";
// import * as MediaLibrary from 'expo-media-library';
// import { TouchableOpacity } from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import styled from "styled-components/native";

// const HeaderRightText = styled.Text`
//   color: white;
//   font-size: 16px;
//   font-weight: 600;
//   margin-right: 7px;
// `;

// type INavProps = {
//   Select: undefined;
//   UploadForm: {file:string[]};
// }
// type Props = NativeStackScreenProps<INavProps, 'Select'>;

// const SelectPhoto = ({navigation}:Props) => {
//   const [ok,setOk] = useState(false);
//   const [photos,setPhotos] = useState<MediaLibrary.Asset[]>([]);
//   const [chosenPhoto,setChosenPhoto] = useState("");
//   const [chosenPhotoAsset,setChosenPhotoAsset] = useState<MediaLibrary.Asset|null>(null);
  
//   const getPhotos = async() => {
//     const {assets:photos} = await MediaLibrary.getAssetsAsync();
//     setPhotos(photos);
//     setChosenPhoto(photos[0]?.uri);
//     setChosenPhotoAsset(photos[0]);
//   };

//   const getPermissions = async () => {
//     const {status,canAskAgain} = await MediaLibrary.getPermissionsAsync();
//     if(status === "undetermined" && canAskAgain === true ) {
//       const {status} = await MediaLibrary.requestPermissionsAsync();
//       if(status !== "undetermined") {
//         setOk(true);
//         getPhotos();
//       }
//     } else if (status !== "undetermined") {
//       setOk(true);
//       getPhotos();
//     }
//   };

//   useEffect(()=>{
//     getPermissions();
//   },[]);

//   const HeaderRight = () => <TouchableOpacity onPress={async()=>{
//     if(chosenPhotoAsset){
//     const {localUri} = await MediaLibrary.getAssetInfoAsync(chosenPhotoAsset);
//     navigation.navigate("UploadForm",{file:localUri})}
//   }}>
//     <HeaderRightText>Next</HeaderRightText>
//   </TouchableOpacity>

//   useEffect(()=>{
//     navigation.setOptions({
//       headerRight:HeaderRight,
//     });
//   },[chosenPhoto])

//   return <></>;
// };
// export default SelectPhoto;



import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import * as MediaLibrary from 'expo-media-library';
import { Alert, FlatList, Image, ListRenderItem, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Container = styled.View`
  flex:1;
  background-color: black;
`;
const Top = styled.View`
  flex: 1;
`;
const Bottom = styled.View`
  flex: 1;
`;
const ImageContainer = styled.TouchableOpacity``;

const IconContainer = styled.View`
  position: absolute;
  bottom: 10%;
  right: 10%;
`;
const HeaderRightText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;


const NotSelectedPhotoComponent = styled.View`
  width: 20px;
  height: 20px;
  border: 2px;
  border-color: grey;
  border-radius: 10px;
`;
const SelectedPhotoComponent = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: yellow;
`;
const SelectedPhotoComponentText = styled.Text`
  font-size: 16px;
  text-align: center;
`;


type INavProps = {
  Select: undefined;
  // 얘는 파일 uri 만 넘길 때
  UploadForm: {file:string[]};
  // 얘는 파일 uri 만 넘길 때
  // UploadForm: {file:{uri:string,name:string}[]};
}
type Props = NativeStackScreenProps<INavProps, 'Select'>;

// const chosenPhotoAssetArr: MediaLibrary.Asset[] = [];


const SelectPhoto = ({navigation}:Props) => {

  // 카메라 설정
  const [ok,setOk] = useState(false);
  // 선택한 사진들의 목록
  const [photos,setPhotos] = useState<MediaLibrary.Asset[]>([]);
  // 현재 선택 사진
  const [chosenPhoto,setChosenPhoto] = useState("");
  // 얘는 선택한애 index 써야해서 state 로 씀. id 만 받고 업로드로 넘길 때 얘로 localUri 받음.
  const [chosenPhotoIdArr,setChosenPhotoIdArr] = useState<string[]>([]);
  // const [chosenPhotoAsset,setChosenPhotoAsset] = useState<MediaLibrary.Asset|null>(null);
  
  // console.log(photos)
  // console.log(chosenPhoto)

  // 사진들 가져옴
  const getPhotos = async() => {
    const {assets:photos} = await MediaLibrary.getAssetsAsync();
    setPhotos(photos);
    setChosenPhoto(photos[0]?.uri);
    // 지금은 여러개 올릴거라 처음거 선택 x
    // setChosenPhotoAsset(photos[0]);
  }
  
  // 권한 확인 & 요청
  const getPermissions = async () => {
    const {status,canAskAgain} = await MediaLibrary.getPermissionsAsync();
    if(status === "undetermined" && canAskAgain === true ) {
      const {status} = await MediaLibrary.requestPermissionsAsync();
      if(status !== "undetermined") {
        setOk(true);
        getPhotos();
      }
    } else if (status !== "undetermined") {
      setOk(true);
      getPhotos();
    }
  }
  
  console.log(chosenPhotoIdArr)

  // 다음 화면으로 넘어가기. 파일 받아서 넘어감.
  const HeaderRight = () => <TouchableOpacity onPress={async() => {
    // 사진을 하나도 선택 안했을 경우.
    if(chosenPhotoIdArr.length === 0){
      // 지금은 사진이 있어야만 업로드 할거라 알림 띄움. 트위터처럼 텍스트만 보내도 되면 변경.
      Alert.alert("사진을 선택해 주세요.")
    } else {
      // 업로드할 사진 localUri 목록
      const uploadFileUriArr: string[] = [];
      // 각각의 localUri 들을 받음.
      await Promise.all(
        chosenPhotoIdArr.map(
          async(file) => {
            // filename 은 필요하면 쓰고 굳이 필요는 없을듯.
            const {localUri,filename} = await MediaLibrary.getAssetInfoAsync(file);
            // 얘는 uri 만 넘길때
            if(localUri){
              uploadFileUriArr.push(localUri);
            }
            // uri 랑 파일명 같이 넘길 때
            // uploadFileUriArr.push({uri:localUri,name:filename});
          }
        )
      )
      // localUri 목록을 들고 다음 화면으로 넘어감
      navigation.navigate("UploadForm",{file:uploadFileUriArr})};
    }}>
    <HeaderRightText>Next</HeaderRightText>
  </TouchableOpacity>

  // 처음 시작하자마자 권한 확인
  useEffect(()=>{
    getPermissions();
  },[ok])
  
  // 헤더 설정. 다음 화면 넘어가는 버튼
  useEffect(()=>{
    navigation.setOptions({
      headerRight:HeaderRight,
    });
  // 의존성이 있어야 함. 안그러면 처음에만 실행되서 chosenPhotoIdArr 바뀐걸 안받음.
  },[chosenPhotoIdArr])

  // FlatList 설정
  const numColumns = 3;
  const {width} = useWindowDimensions();
  // 각각의 사진 높이/넓이
  const imageWidth = width/numColumns;


  // 사진 클릭 시
  const selectPhoto = (file:MediaLibrary.Asset) => {
    const index = chosenPhotoIdArr.indexOf(file.id);
    if(index === -1) {
      // 처음 선택하는 사진일 때
      // 10장 이상은 선택 안됨.
      if(chosenPhotoIdArr.length === 10) {
        return Alert.alert("10개 이상의 사진을 선택하실 수 없습니다.")
      }
      // 큰 이미지에 넣음
      setChosenPhoto(file.uri);

      // 여기는 화면 변경이 위에 setChosenPhoto 로 되서 setChosenPhotoIdArr 말고 그냥 chosenPhotoIdArr 를 바꿨는데 잘 동작함.. 근데 음 문제가 있을라나?? 있네, 같은걸 계속 클릭하면 안나옴
      // chosenPhotoIdArr.push(file.id);
      setChosenPhotoIdArr(prev => {
        const newArr = [...prev]
        newArr.push(file.id);
        return newArr;
      })

    } else {
      // 이미 선택했던 사진일 때
      setChosenPhotoIdArr(prev=>{
        const newArr = [...prev]
        newArr.splice(index,1);
        return newArr;
      })
      // chosenPhotoIdArr.splice(index,1);
    }
  };

  // 각각의 사진 렌더링
  const renderItem: ListRenderItem<MediaLibrary.Asset> = ({item:photo}) => {
    // 선택한 사진이 있는지, 있다면 걔의 인덱스를 넣음.
    const index = chosenPhotoIdArr.indexOf(photo.id);
    return <ImageContainer onPress={()=>selectPhoto(photo)} >
        {photo.uri !== "" && <Image source={{uri:photo.uri}} style={{width:imageWidth,height:imageWidth}}/>}
        <IconContainer>
          {/* 선택한 사진이면 걔의 index 나오게. 아니면 그냥 비어있는 걸로 */}
          {index === -1 ? <NotSelectedPhotoComponent /> : <SelectedPhotoComponent>
            <SelectedPhotoComponentText>{index}</SelectedPhotoComponentText>
          </SelectedPhotoComponent>}
          {/* 얘는 사진 한장만 업로드 할 수 있을 때
          <Ionicons name={chosenPhoto === photo.uri? "checkmark-circle":"checkmark-circle-outline"} color={chosenPhoto === photo.uri? colors.blue : "white"} size={20}/> */}
        </IconContainer>
      </ImageContainer>
  }
  return (
    <Container>
      <Top>
        {chosenPhoto !== "" && <Image source={{uri:chosenPhoto}} style={{width:"100%",height:"100%"}}/>}
      </Top>
      <Bottom>
        <FlatList
          data={photos}
          keyExtractor={(photo) => photo.id+""}
          renderItem={renderItem}
          numColumns={numColumns}
        />
      </Bottom>
    </Container>
  )
};

export default SelectPhoto;