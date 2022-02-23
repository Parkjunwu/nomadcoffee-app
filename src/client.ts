import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeVar } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { offsetLimitPagination } from '@apollo/client/utilities';


export const TOKEN = "token"

export const tokenVar = makeVar<string|null>(null);
export const isUserLoggedInVar = makeVar<boolean>(false);

export const loggedUserIn = async(token:string) => {
  await AsyncStorage.setItem(TOKEN,token);
  if(token){
    // 토큰으로 검증 추가해야함. 검증 완료시에 밑에 설정.
    tokenVar(token);
    isUserLoggedInVar(true);
  }
}

export const loggedUserOut = async() => {
  await AsyncStorage.removeItem(TOKEN);
  tokenVar(null);
  isUserLoggedInVar(false);
}

const httpLink = createHttpLink({
  // uri: 'http://198b-58-140-221-249.ngrok.io/graphql',
  uri: 'http://localhost:4000/graphql',
});

// upload, subscription link 넣어야함.

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // 아마 함수로 써야 할듯? 그래야 보낼때마다 바뀜.
      // token:()=>tokenVar()
      token:tokenVar()
    }
  }
});
// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// loggedUserOut()
export const cache = new InMemoryCache({
  typePolicies:{
    Query:{
      fields:{
        // seeCoffeeShops:offsetLimitPagination(),
        seeCoffeeShops:{
          keyArgs:false,
          merge(existing = [], incoming: []) {
            return [...existing, ...incoming];
          },
        },
      }
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache
});

