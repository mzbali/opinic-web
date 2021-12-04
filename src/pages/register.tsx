import React from 'react';
import { Form, Formik } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import { useMutation } from 'urql';

interface registerProps {}

const REGISTER_MUT = `mutation Register($username: String!, $password: String!) {
  register(options: { username: $username, password: $password }) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}`;

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUT);
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          console.log(values);
          return register(values);
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
