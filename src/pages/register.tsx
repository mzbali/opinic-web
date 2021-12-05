import React from 'react';
import { Form, Formik } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import { useRegisterMutation } from '../generated/graphql';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values) => {
          console.log(values);
          const response = await register(values);
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
