import {
  Exchange,
  dedupExchange,
  fetchExchange,
  stringifyVariables,
} from 'urql';
import { cacheExchange, QueryInput, Resolver } from '@urql/exchange-graphcache';
import { pipe, tap } from 'wonka';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';
import Router from 'next/router';

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

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    /*
      allFields should look something like this 
      [
        {
          fieldKey: 'posts({"limit":10})',
          fieldName: 'posts',
          arguments: { limit: 10 }
        }
      ]
    */
    const allFields = cache.inspectFields(entityKey); // all the cache of request
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const fieldkey = `${fieldName}${stringifyVariables(fieldArgs)}`;
    const isItInTheCache = cache.resolve(entityKey, fieldkey);
    info.partial = !isItInTheCache; // if in cache sill request again
    const result: string[] = [];
    fieldInfos.forEach((fi) => {
      const data = cache.resolve(entityKey, fi.fieldKey) as string[];
      result.push(...data); // every data from request 0 to n should be in the array, load more grow more
    });
    return result;
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: { credentials: 'include' as const }, //have some cookie please
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
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
