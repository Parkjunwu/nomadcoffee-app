import { ApolloQueryResult, gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isUserLoggedInVar, loggedUserOut } from "../client";
import { me } from "../__generated__/me";

const ME_QUERY = gql`
    query me {
      me {
        id
        username
        avatarURL
      }
    }
`;

// const useMe:()=>{data:me|undefined,refetch:(variables?: Partial<meVariables>) => Promise<ApolloQueryResult<me>>,fetchMore:any} = () => {
  const useMe:()=>{data:me|undefined,fetchMore:any} = () => {
  const hasToken = useReactiveVar(isUserLoggedInVar);
  // const {data,refetch,fetchMore} = useQuery<me,meVariables>(ME_QUERY,{
    const {data,fetchMore} = useQuery<me>(ME_QUERY,{
    skip: !hasToken
  });
  useEffect(()=>{
    if(data?.me === null) {
      loggedUserOut();
    }
  },[data])
  // return {data,refetch,fetchMore};
  return {data,fetchMore};
}
export default useMe;