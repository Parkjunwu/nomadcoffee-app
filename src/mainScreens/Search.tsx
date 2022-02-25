import { gql, useLazyQuery } from "@apollo/client"
import React, { useEffect, useState } from "react"
import { FlatList, RefreshControl, Text, View } from "react-native"
import styled from "styled-components/native";
import CoffeeShopInformation from "../components/CoffeeShopInformation";
import { searchCoffeeShops, searchCoffeeShopsVariables, searchCoffeeShops_searchCoffeeShops } from "../__generated__/searchCoffeeShops";

const SEARCH_COFFEE_SHOPS = gql`
  query searchCoffeeShops($keyword:String!,$cursorId:Int) {
    searchCoffeeShops(keyword:$keyword,cursorId:$cursorId) {
      id
      name
      latitude
      longitude
      photos{
        id
        url
      }
    }
  }
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 5px;
`;
const SearchBar = styled.TextInput`
  background-color: white;
  padding: 8px 20px;
  border-radius: 20px;
  width: 80%;
`;
const SearchButton = styled.TouchableOpacity`
  margin:0px auto;
`;

// 화면 변경은 필요 없어서 state 로 안쓰고 유지는 되야 해서 여기다 놓음.
let isEnd = false;
let cursorId:number;

const Search = () => {
  // fetchMore 로 해야겠지? 그냥 searchCoffeeShops 또 하는게 아니고.
  const [searchCoffeeShops,{data,fetchMore,refetch,previousData,loading}] = useLazyQuery<searchCoffeeShops,searchCoffeeShopsVariables>(SEARCH_COFFEE_SHOPS);
  const renderItem = ({item}:{item:searchCoffeeShops_searchCoffeeShops|null}) => (
    item ? <CoffeeShopInformation {...item}/> : null
  );

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);


  // 여기서는 처음부터 useLazyQuery 로 받기 때문에 useEffect 안써도 됨.
  // useEffect(() => {
  //   // data 받기 전에 실행되는거 방지. 얘 안하면 isEnd 가 true 되서 fetchMore 실행 안됨.
  //   if(!data?.searchCoffeeShops) return;
  //   // 한번에 받는 post 갯수
  //   const takeNumber = 2;
  //   // 총 post 갯수
  //   const dataLength = data?.searchCoffeeShops?.length ?? 0;
  //   // 이전 post 갯수
  //   const previousDataLength = previousData?.searchCoffeeShops?.length ?? 0;
  //   // fetchMore 로 받은 갯수
  //   const nowGetDataLength = dataLength - previousDataLength;
  //   // fetchMore 받은 갯수가 3개 이하다. 그럼 더이상 받을 게 없단 얘기. 받은게 없어도 마찬가지. 이때는 data 가 똑같아서 useEffect 자체가 실행 안됨.
    // if(nowGetDataLength !== takeNumber) {
    //   isEnd = true;
    // } else {
    //   // cursorId 정함.
    //   cursorId = data?.searchCoffeeShops[dataLength - 1]?.id ?? 0
    // }
    // // 어차피 데이터 없으면 useEffect 실행 안되니 얘는 필요 없음.
    // // if(nowGetDataLength !== 0 && data?.searchCoffeeShops){
    // //   // 그냥 data?.searchCoffeeShops[dataLength - 1].id 만 쓰면 될거 같은데 타입스크립트라 이렇게 씀.
    // // cursorId = data?.searchCoffeeShops[dataLength - 1]?.id ?? 0
    // // }
  // },[data])

  const takeNumber = 2;

  const afterCursor = (gettingData:any) => {
    const nowGetDataLength = gettingData?.length;
    if(nowGetDataLength !== takeNumber) {
      isEnd = true;
    } else {
      // cursorId 정함.
      cursorId = gettingData[nowGetDataLength - 1]?.id ?? 0
    }
  }

  const onEndReached = async(info: {distanceFromEnd: number}) => {
    if(!isEnd){
      // 얘의 값이 딱 fetchMore 로 가져온 값. 글고 만약 useQuery 에서 onComplete 쓰면 여기도 적용됨.
      const result = await fetchMore<searchCoffeeShops,searchCoffeeShopsVariables>({
        variables:{
          cursorId
        },
      });
      if(!result.data?.searchCoffeeShops) return;
      
      afterCursor(result.data.searchCoffeeShops);
      // const nowGetDataLength = result.data.searchCoffeeShops?.length;
      // if(nowGetDataLength !== takeNumber) {
      //   isEnd = true;
      // } else {
      //   // cursorId 정함.
      //   cursorId = result.data?.searchCoffeeShops[nowGetDataLength - 1]?.id ?? 0
      // }
    }
  };

  const [value,setValue] = useState<string>();
  console.log(value)
  const onSearchButtonPress = async() => {
    if(!value || loading) return;
    const result = await searchCoffeeShops({
      variables:{
        keyword:value
      }
    });
    if(!result.data?.searchCoffeeShops) return;
    
    afterCursor(result.data.searchCoffeeShops);
    // const nowGetDataLength = result.data.searchCoffeeShops?.length;
    // if(nowGetDataLength !== takeNumber) {
    //   isEnd = true;
    // } else {
    //   // cursorId 정함.
    //   cursorId = result.data?.searchCoffeeShops[nowGetDataLength - 1]?.id ?? 0
    // }
  }
  console.log(isEnd);
  return (
    <View>
      <SearchContainer>
        <SearchBar onChangeText={text=>setValue(text)}/>
        <SearchButton onPress={onSearchButtonPress}>
          <Text>Search</Text>
        </SearchButton>
      </SearchContainer>
      <FlatList 
        data={data?.searchCoffeeShops}
        ListEmptyComponent={<View><Text>No Data</Text></View>}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id + ""}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        style={{height:"100%"}}
      />
    </View>
  )
}
export default Search;