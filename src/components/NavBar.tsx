import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;
  if (fetching) {
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
          onClick={() => logout()}
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
