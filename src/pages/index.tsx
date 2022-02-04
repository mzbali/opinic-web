import React from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { Box, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

const Index = () => {
  const [{ data }] = usePostsQuery({ variables: { limit: 10, cursor: null } });
  return (
    <Layout>
      <Flex align="center" mb={8}>
        <Heading>Opinic</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      <Stack spacing={6}>
        {!data?.posts
          ? 'loading...'
          : data.posts.map((post) => {
              return (
                <Box p={5} shadow="md" borderWidth="1px" key={post.id}>
                  <Heading fontSize="xl">{post.title}</Heading>
                  <Text mt={4}>{post.textSnippet}</Text>
                </Box>
              );
            })}
      </Stack>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index); // withUrqlClient is a higher order components
