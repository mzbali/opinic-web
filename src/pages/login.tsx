import React from 'react';
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={async (values, { setErrors }) => {
        const response = await login({ options: values });
        if (response.data?.login.errors) {
          setErrors(toErrorMap(response.data.login.errors));
        } else if (response.data?.login.user) {
          //worked
          console.log(response.data.login.user);
          router.push('/');
        }
      }}
    >
      {({ isSubmitting }) => {
        return (
          <Form>
            <Wrapper>
              <InputField
                name="username"
                type="text"
                label="Username"
                placeholder="Username"
              />
              <Box mt={4}>
                <InputField
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Password"
                />
              </Box>
              <Button
                colorScheme="teal"
                type="submit"
                isLoading={isSubmitting}
                mt={4}
              >
                Login
              </Button>
            </Wrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
