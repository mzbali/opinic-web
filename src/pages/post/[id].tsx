import { withUrqlClient } from 'next-urql';
import { Text } from '@chakra-ui/react';
import { Layout } from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { NextPage } from 'next';
import { useGetIntId } from '../../utils/useGetIntId';

const Post: NextPage = () => {
  const intId = useGetIntId();
  const [{ data, fetching, error }] = usePostQuery({
    variables: {
      id: intId,
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
