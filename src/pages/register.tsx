import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '', password: '', email: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: { me: data?.register.user },
              });
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // worked
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <InputField
                type="text"
                name="username"
                label="Username"
                placeholder="Username"
              />
              <Box mt={4}>
                <InputField
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Email"
                />
              </Box>
              <Box mt={4}>
                <InputField
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Password"
                />
              </Box>
              <Button
                isLoading={isSubmitting}
                colorScheme="teal"
                type="submit"
                mt={4}
              >
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default Register;
