import React from 'react';
import { Form, Formik } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          console.log(values);
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
