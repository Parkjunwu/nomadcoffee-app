import React from "react";
import { useState } from "react";
import styled from "styled-components/native";
import { color } from "../color";
import { seeCoffeeShops_seeCoffeeShops } from "../__generated__/seeCoffeeShops";
import { Text } from "react-native";

const Container = styled.View`
  width: 100%;
  margin-bottom: 50px;
  border: 1px solid;
  border-color: ${props=>props.theme.borderColor};
`;
const Header = styled.View`
  border-color: ${props=>props.theme.borderColor};
  padding: 5px 20px 2px 20px;
`;
const CoffeeShopName = styled.View`
  font-size: 17px;
  font-weight: 700;
`;
const CoffeeShopLocation = styled.TouchableOpacity`
  margin-top: 2px;
  font-size: 11px;
`;
const PhotoContainer = styled.View`
  position: relative;
`;
const PhotoBtn = styled.TouchableOpacity`
  position: absolute;
  z-index: 1;
  top: 47%;
  opacity: 0.8;
`;
const PhotoBtnText = styled.Text`
  font-size: 70px;
  font-weight: 900;
  color: white;
`;
const NextPhotoBtn = styled(PhotoBtn)`
  right: 10px;
`;
const PrevPhotoBtn = styled(PhotoBtn)`
  left: 10px;
`;
const Photo = styled.Image`
  width: 100%;
  height: 500px;
  border-color: ${props=>props.theme.borderColor};
`;
const PhotoIndexContainer = styled.TouchableOpacity`
  margin-top: 5px;
  margin-bottom: 10px;
  justify-content: center;
  flex-direction: row;
`;
const PhotoIndex = styled.TouchableOpacity`
`;
const PhotoIndexText = styled.Text<{isFocused:boolean}>`
  font-size: 15px;
  color: ${props => props.isFocused ? "black":"grey"};
`;
const Footer = styled.View`
  width: 100%;
`;
const CoffeeShopCategoryContainer = styled.View`
  flex-direction: row;
  padding: 5px 30px;
  border-color: ${props=>props.theme.borderColor};
`;
const CoffeeShopCategory = styled.View`
  padding-right: 20px;
  color: ${color.btnBackgroundColor};
`;
const UserContainer = styled.View`
  padding: 8px 16px;
  align-items: center;
  position: relative;
  flex-direction: row;
`;
const UserAvatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 20px;
  background-color: white;
`;
const Username = styled.View`
  margin-left: 10px;
`;
const EditPhoto = styled.View`
  position: absolute;
  right: 10px;
  font-size: 10px;
`;

const Post = (props:seeCoffeeShops_seeCoffeeShops) => {
  const [photoIndex,setPhotoIndex] = useState(0);
  const totalPhotoNumber = props.photos?.length;

  const photoIndexArray = [];

  if(totalPhotoNumber) {
    for(let i=0;i<totalPhotoNumber;i++){
      photoIndexArray.push(i)
    }
  }
  
  
  const onPrevPhotoBtnClick = () => setPhotoIndex(prev=>prev-1);
  const onNextPhotoBtnClick = () => setPhotoIndex(prev=>prev+1);
  const onPhotoIndexClick = (index:number) => setPhotoIndex(index);

  return (
    <Container>
      <Header>
        <CoffeeShopName><Text>{props.name}</Text></CoffeeShopName>
      </Header>
      <PhotoContainer>
        {photoIndex !== 0 ? <PrevPhotoBtn onPress={onPrevPhotoBtnClick}><PhotoBtnText>{"<"}</PhotoBtnText></PrevPhotoBtn> : null}
        {photoIndex + 1 !== totalPhotoNumber ? <NextPhotoBtn onPress={onNextPhotoBtnClick} ><PhotoBtnText>{">"}</PhotoBtnText></NextPhotoBtn> : null}
        {props.photos && props.photos[photoIndex]?.url ? <Photo source={props.photos[photoIndex]?.url ? {uri:props.photos[photoIndex]?.url}:require("../../assets/noImage.png")} /> : null}
      </PhotoContainer>
      <PhotoIndexContainer>
        {photoIndexArray.length !== 1 ? photoIndexArray.map(eachIndex => <PhotoIndex key={eachIndex} onPress={()=>onPhotoIndexClick(eachIndex)}><PhotoIndexText isFocused={eachIndex === photoIndex} >⦁</PhotoIndexText></PhotoIndex>) : null}
      </PhotoIndexContainer>
      <Footer>
        <CoffeeShopCategoryContainer>
          {props.wholeCategories?.map(category => <CoffeeShopCategory key={category?.id}><Text>#{category?.name}</Text></CoffeeShopCategory>)}
        </CoffeeShopCategoryContainer>
        <UserContainer>
          <UserAvatar source={props.user?.avatarURL ? {uri:props.user?.avatarURL}:require("../../assets/noImage.png")} />
          <Username><Text>{props?.user?.username}</Text></Username>
        </UserContainer>
      </Footer>
    </Container>
  )
}
export default Post;