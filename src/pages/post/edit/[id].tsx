import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import router from 'next/router';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';

const EditPost: NextPage = () => {
  const intId = useGetIntId();
  const [, updatePost] = useUpdatePostMutation();
  const [{ data, fetching }] = usePostQuery({
    variables: { id: intId },
    pause: intId === -1,
  });
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }
  return (
    <Layout>
      <Formik
        initialValues={{
          title: data.post.title,
          text: data.post.text,
        }}
        onSubmit={async (values) => {
          if (values.title.trim() !== '' && values.text.trim() !== '') {
            const response = await updatePost({ id: intId, input: values });
            if (!response.error) {
              router.back();
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="Title" />
            <Box mt={4}>
              <InputField name="text" label="Text" textarea />
            </Box>
            <Box>
              <Button
                isLoading={isSubmitting}
                colorScheme="teal"
                type="submit"
                mt={4}
              >
                Update Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
