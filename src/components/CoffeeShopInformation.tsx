import React, { useState } from "react";
import styled from "styled-components/native";
import { FlatList, Text } from "react-native";
import { searchCoffeeShops_searchCoffeeShops } from "../__generated__/searchCoffeeShops";
import { asyncReverseGeocode } from "../logic/reverseGeolocation";

const Container = styled.View`
  width: 100%;

  height: 500px;

  margin-bottom: 50px;
  border: 1px solid;
  border-color: ${props=>props.theme.borderColor};
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
const Username = styled.Text`
  margin-left: 10px;
  font-size: 15px;
`;
const AddressText = styled.Text`
  margin-left: 10px;
  margin-bottom: 3px;
`;
const PreviewImage = styled.Image`
  width: 130px;
  height: 130px;
`;

const CoffeeShopInformation = (props:searchCoffeeShops_searchCoffeeShops) => {
  const [location,setLocation] = useState();
  asyncReverseGeocode({latitude:Number(props.latitude),longitude:Number(props.longitude)},setLocation)
  return (
      <Container>
        <UserContainer>
          <UserAvatar source={props.photos && props.photos[0]?.url ? {uri:props.photos[0]?.url}:require("../../assets/noImage.png")} />
          <Username>{props?.name}</Username>
        </UserContainer>
        <AddressText>{location}</AddressText>
        <FlatList
          horizontal
          alwaysBounceHorizontal={false}
          bounces={false}
          data={props.photos}
          renderItem={({item})=><PreviewImage source={{uri:item?.url + ""}}/>}
          keyExtractor={item=>item?.id+""}
        />
      </Container>
  )
}
export default CoffeeShopInformation;