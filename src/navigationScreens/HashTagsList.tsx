import React from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { gql, useQuery } from "@apollo/client";
import { seeCategory, seeCategoryVariables, seeCategory_seeCategory } from "../__generated__/seeCategory";
import { Text, View } from "react-native";
import ToggleHeaderFlatList from "../components/ToggleHeaderFlatList";
import Post from "../components/Post";

type RootStackParamList = {
  Home: undefined;
  HashTagsList: { id: string };
  // Profile: { userId: string };
  // Feed: { sort: 'latest' | 'top' } | undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'HashTagsList'>;

const SEE_CATEGORY = gql`
  query seeCategory ( $categoryId: Int!, $cursor: Int ){
    seeCategory ( categoryId: $categoryId, cursor: $cursor ) {
      id
      name
      latitude
      longitude
      photos{
        id
        url
      }
      wholeCategories {
        id
        name
      }
    }
  }
`;

const HashTagsList = ({navigation,route}:Props) => {
  const {data,loading} = useQuery<seeCategory,seeCategoryVariables>(SEE_CATEGORY,{
    variables:{
      categoryId:Number(route.params.id)
    }
  });
  if(loading) {
    return <View><Text>Loading...</Text></View>
  }
  const renderItem = ({item}:{item:seeCategory_seeCategory}) => (
    <Post {...item}/>
  );
  return (
    <ToggleHeaderFlatList
      data={data?.seeCategory}
      renderItem={renderItem}
    />
  );
};

export default HashTagsList;