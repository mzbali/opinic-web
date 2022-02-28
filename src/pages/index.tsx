import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { UpdateDeletePost } from '../components/UpdateDeletePost';
import { UpdootSection } from '../components/UpdootSection';
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as string | null,
  });
  const [{ data: meData }] = useMeQuery();
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  if (!fetching && !data) {
    return <Text>There is no data for some reason</Text>;
  }
  return (
    <Layout>
      <Flex align="center" mb={8}></Flex>
      <Stack spacing={6}>
        {fetching && !data?.posts
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
            onClick={() =>
              setVariables((state) => ({
                limit: state.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
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
