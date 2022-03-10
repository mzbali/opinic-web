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
import React from 'react';
import { Layout } from '../components/Layout';
import { UpdateDeletePost } from '../components/UpdateDeletePost';
import { UpdootSection } from '../components/UpdootSection';
import { useMeQuery, usePostsQuery } from '../generated/graphql';

const Index = () => {
  const { data: meData } = useMeQuery();
  const { data, loading, fetchMore } = usePostsQuery({
    variables: { limit: 15 },
    notifyOnNetworkStatusChange: true,
  });
  if (!loading && !data) {
    return <Text>There is no data for some reason</Text>;
  }
  return (
    <Layout>
      <Flex align="center" mb={8}></Flex>
      <Stack spacing={6}>
        {loading && !data?.posts
          ? 'loading...'
          : data!.posts.posts.map((post) => {
              return (
                <Flex p={5} shadow="md" borderWidth="1px" key={post.id}>
                  <UpdootSection post={post} />
                  <Box flex={1}>
                    <NextLink href={`/post/${post.id}`}>
                      <Link>
                        <Heading fontSize="xl">{post.title}</Heading>
                      </Link>
                    </NextLink>
                    <Text mt={4}>{post.textSnippet}</Text>
                    <Text mt={6} as="i">
                      Created By <Text as="samp">{post.creator.username}</Text>
                    </Text>
                  </Box>
                  {meData?.me?.id !== post.creator.id ? null : (
                    <UpdateDeletePost id={post.id} />
                  )}
                </Flex>
              );
            })}
      </Stack>
      {data && data.posts.hasMore ? (
        <Flex my={8} justify="center">
          <Button
            colorScheme="teal"
            isLoading={loading}
            onClick={() =>
              fetchMore({
                variables: {
                  limit: 15,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              })
            }
          >
            Load More...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default Index;
