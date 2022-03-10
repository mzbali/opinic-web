import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import {
  MeDocument,
  MeQuery,
  PostsDocument,
  useLogoutMutation,
  useMeQuery,
} from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const { data, loading } = useMeQuery();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  let body = null;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else if (data.me) {
    body = (
      <Flex align="center">
        <NextLink href="/create-post" passHref>
          <Button as={Link} mr={4}>
            Create Post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant="link"
          onClick={() =>
            logout({
              update: (cache) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: { me: null }, // make me query null when logout
                });

                // const paginatedPosts = cache.readQuery<PaginatedPosts>({
                //   query: PostsDocument,
                // });
                // console.log(paginatedPosts);
                // if (paginatedPosts) {
                //   cache.writeQuery<PaginatedPosts>({
                //     query: PostsDocument,
                //     variables: { limit: 15 },
                //     data: {
                //       hasMore: paginatedPosts?.hasMore || true,
                //       posts: paginatedPosts?.posts.map((post) => ({
                //         ...post,
                //         voteStatus: null,
                //       })),
                //     },
                //   });
                // }
              },
              refetchQueries: [
                { query: PostsDocument, variables: { limit: 15 } }, // refetch posts when logout
              ],
            })
          }
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex
      as="nav"
      bgColor="teal.500"
      p={4}
      position="sticky"
      top={0}
      zIndex={1}
      alignItems="center"
      justify="center"
    >
      <Flex maxW={800} flex={1} align="center" m="auto">
        <Box>
          <NextLink href="/">
            <Link>
              <Heading>Opinic</Heading>
            </Link>
          </NextLink>
        </Box>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
