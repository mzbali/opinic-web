import { AppProps } from 'next/app';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { createClient, Provider, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange, QueryInput } from '@urql/exchange-graphcache';
import theme from '../theme';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: { credentials: 'include' }, //have some cookie please
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        // updating query after our mutation fires
        Mutation: {
          logout: (_result: LogoutMutation, _args, cache, _info) => {
            cache.updateQuery<MeQuery, QueryInput>(
              { query: MeDocument },
              () => {
                return { me: null };
              }
            );
          },
          login: (result: LoginMutation, _args, cache, _info) => {
            cache.updateQuery<MeQuery, QueryInput>(
              { query: MeDocument },
              (data) => {
                // you can do immer like updates
                if (result.login.errors) {
                  return data; // same as the cache
                } else {
                  return {
                    me: result.login.user, // login success then, update Me cache with the user
                  };
                }
              }
            );
          },
          register: (result: RegisterMutation, _args, cache, _info) => {
            cache.updateQuery<MeQuery, QueryInput>(
              { query: MeDocument },
              (data) => {
                // you can do immer like updates
                if (result.register.errors) {
                  return data;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
