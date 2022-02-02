import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange, QueryInput } from '@urql/exchange-graphcache';
import { Exchange } from 'urql';
import { pipe, tap } from 'wonka';
import Router from 'next/router';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';

export const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes('not authenticated')) {
          Router.push('/login');
        }
      })
    );
  };

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: { credentials: 'include' as const }, //have some cookie please
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
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
