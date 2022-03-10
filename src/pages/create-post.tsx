import React from 'react';
import { Form, Formik } from 'formik';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import { Layout } from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC = ({}) => {
  const router = useRouter();
  const [createPost] = useCreatePostMutation();
  useIsAuth();
  return (
    <Layout>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          if (values.title.trim() !== '' && values.text.trim() !== '') {
            const response = await createPost({ variables: { input: values } });
            if (!response.errors) {
              router.push('/');
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="Title" placeholder="Title" />
            <Box mt={4}>
              <InputField
                name="text"
                label="Text"
                placeholder="text..."
                textarea
              />
            </Box>
            <Box>
              <Button
                isLoading={isSubmitting}
                colorScheme="teal"
                type="submit"
                mt={4}
              >
                Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
