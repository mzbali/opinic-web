import { Text } from '@chakra-ui/react';
import { Layout } from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { NextPage } from 'next';
import { useGetIntId } from '../../utils/useGetIntId';

const Post: NextPage = () => {
  const intId = useGetIntId();
  const { data, loading, error } = usePostQuery({
    variables: {
      id: intId,
    },
  });
  if (loading) {
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

export default Post;
