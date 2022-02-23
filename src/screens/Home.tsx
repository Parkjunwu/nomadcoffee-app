import { gql, useQuery } from "@apollo/client"
import React, { useEffect } from "react"
import { FlatList, RefreshControl, Text, View } from "react-native"
import Post from "../components/Post";
import { seeCoffeeShops, seeCoffeeShopsVariables, seeCoffeeShops_seeCoffeeShops } from "../__generated__/seeCoffeeShops";

const SEE_COFFEE_SHOPS = gql`
  query seeCoffeeShops ($cursor:Int){
    seeCoffeeShops(cursor:$cursor){
      id
      name
      latitude
      longitude
      user{
        username
        avatarURL
        isMe
        isFollowing
      }
      photos{
        id
        url
      }
      wholeCategories{
        id
        name
      }
    }
  }
`;

// 화면 변경은 필요 없어서 state 로 안쓰고 유지는 되야 해서 여기다 놓음.
let isEnd = false;
let cursorId:number;

const Home = () => {
  // useLazyQuery 는 해보니 offsetLimitPagination 안돼.
  
  // onCompleted 에서 마지막인지 확인할라 했으나 얘의 data 가 merge 된 전체 결과를 가져옴. 그래서 좀 애매. fetchMore 된 데이터만 가지고 해야 되서 안씀.
  // 글고 fetchMore 의 값이 딱 해당 쿼리 때 가져온 데이터라 이걸 쓸랬으나 맨처음 useQuery 로 가져온 값은 확인을 못함.
  // 그래서 그냥 useEffect 에서 data 변경됬을 때 previousData 랑 비교해서 사용함.

  const {data,loading,refetch,fetchMore,previousData} = useQuery<seeCoffeeShops,seeCoffeeShopsVariables>(SEE_COFFEE_SHOPS);
 
  const renderItem = ({item}:{item:seeCoffeeShops_seeCoffeeShops|null}) => (
    item ? <Post {...item}/> : null
  );

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // data 받기 전에 실행되는거 방지. 얘 안하면 isEnd 가 true 되서 fetchMore 실행 안됨.
    if(!data?.seeCoffeeShops) return;
    // 한번에 받는 post 갯수
    const takeNumber = 3;
    // 총 post 갯수
    const dataLength = data?.seeCoffeeShops?.length ?? 0;
    // 이전 post 갯수
    const previousDataLength = previousData?.seeCoffeeShops?.length ?? 0;
    // fetchMore 로 받은 갯수
    const nowGetDataLength = dataLength - previousDataLength;
    // fetchMore 받은 갯수가 3개 이하다. 그럼 더이상 받을 게 없단 얘기. 받은게 없어도 마찬가지. 이때는 data 가 똑같아서 useEffect 자체가 실행 안됨.
    if(nowGetDataLength !== takeNumber) {
      isEnd = true;
    } else {
      // cursorId 정함.
      cursorId = data?.seeCoffeeShops[dataLength - 1]?.id ?? 0
    }
    // 어차피 데이터 없으면 useEffect 실행 안되니 얘는 필요 없음.
    // if(nowGetDataLength !== 0 && data?.seeCoffeeShops){
    //   // 그냥 data?.seeCoffeeShops[dataLength - 1].id 만 쓰면 될거 같은데 타입스크립트라 이렇게 씀.
    // cursorId = data?.seeCoffeeShops[dataLength - 1]?.id ?? 0
    // }
  },[data])

  
  const onEndReached = async(info: {distanceFromEnd: number}) => {
    if(!isEnd){
      // 얘의 값이 딱 fetchMore 로 가져온 값. 글고 만약 useQuery 에서 onComplete 쓰면 여기도 적용됨.
      const result = await fetchMore<seeCoffeeShops,seeCoffeeShopsVariables>({
        variables:{
          cursor:cursorId
        },
      });
      // 받은 값이 없으면 더이상 받을게 없다는 뜻이니 isEnd = true;
      if (result.data.seeCoffeeShops?.length === 0 ){
        isEnd = true;
      }
    }
  };

  return (
  <FlatList 
    data={data?.seeCoffeeShops}
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
  />)
}
export default Home;