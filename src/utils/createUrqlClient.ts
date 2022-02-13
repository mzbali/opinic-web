import {
  Exchange,
  dedupExchange,
  fetchExchange,
  stringifyVariables,
} from 'urql';
import { gql } from '@urql/core';
import { cacheExchange, QueryInput, Resolver } from '@urql/exchange-graphcache';
import { pipe, tap } from 'wonka';
import {
  DeletePostMutation,
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutation,
  VoteMutationVariables,
} from '../generated/graphql';
import Router from 'next/router';
import { isServer } from './isServer';

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
    const fieldKey = `${fieldName}${stringifyVariables(fieldArgs)}`;
    const isItInTheCache = cache.resolve(entityKey, fieldKey);
    info.partial = !isItInTheCache; // if in cache sill request again
    const result: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'posts') as string[]; //since selection set
      const _hasMore = cache.resolve(key, 'hasMore');
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      result.push(...data); // every data from request 0 to n should be in the array, load more grow more
    });
    return {
      posts: result,
      hasMore,
      __typename: 'PaginatedPosts',
    };
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = '';
  if (isServer()) {
    cookie = ctx.req.headers.cookie;
  }

  return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    }, //have some cookie please
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          // updating query after our mutation fires
          Mutation: {
            deletePost: (
              _result: DeletePostMutation,
              args: DeletePostMutationVariables,
              cache,
              _info
            ) => {
              cache.invalidate({ __typename: 'Post', id: args.id });
            },
            vote: (
              _result: VoteMutation,
              args: VoteMutationVariables,
              cache,
              _info
            ) => {
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: args.postId }
              );
              if (args.value === data.voteStatus) {
                return;
              }
              const newPoints: number =
                data.points + args.value * (!data.voteStatus ? 1 : 2); // add the value, if newly voted then add or subtract 1, if voted before the 2
              cache.writeFragment(
                gql`
                  fragment _ on Post {
                    points
                    voteStatus
                  }
                `,
                {
                  id: data.id,
                  points: newPoints,
                  voteStatus: args.value,
                }
              );
            },
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
  };
};
