import React, { useState } from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  if (!fetching && !data) {
    return <Text>There is no data for some reason</Text>;
  }
  return (
    <Layout>
      <Flex align="center" mb={8}>
        <Heading>Opinic</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      <Stack spacing={6}>
        {fetching && !data?.posts
          ? 'loading...'
          : data!.posts.map((post) => {
              return (
                <Box p={5} shadow="md" borderWidth="1px" key={post.id}>
                  <Heading fontSize="xl">{post.title}</Heading>
                  <Text mt={4}>{post.textSnippet}</Text>
                </Box>
              );
            })}
      </Stack>
      {data ? (
        <Flex my={8} justify="center">
          <Button
            colorScheme="teal"
            onClick={() =>
              setVariables((state) => ({
                limit: state.limit,
                cursor: data.posts[data.posts.length - 1].createdAt,
              }))
            }
          >
            Load More...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index); // withUrqlClient is a higher order components
