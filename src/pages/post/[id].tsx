import { withUrqlClient } from 'next-urql';
import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { NextPage } from 'next';

const Post: NextPage = () => {
  const router = useRouter();
  const [{ data, fetching, error }] = usePostQuery({
    variables: {
      id: typeof router.query.id === 'string' ? parseInt(router.query.id) : -1,
    },
  });
  if (fetching) {
    return (
      <Layout>
        <Text>Loading...</Text>
      </Layout>
    );
  }
  if (error) {
    return <Text>{error.message}</Text>;
  }
  if (!data?.post) {
    return (
      <Layout>
        <Text>Could not find post</Text>
      </Layout>
    );
  }
  return (
    <Layout>
      <Text fontSize="2xl" fontWeight="bold">
        {data.post.title}
      </Text>
      <Text mt={4}>{data.post.text}</Text>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
