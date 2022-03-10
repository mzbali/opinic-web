import { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword: NextPage = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [isSent, setIsSent] = useState<boolean>(false);
  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={async (values) => {
        console.log(values);
        await forgotPassword({ variables: values });
        setIsSent(true);
      }}
    >
      {({ isSubmitting }) =>
        isSent ? (
          <Box>An email has been sent with the link to change password </Box>
        ) : (
          <Form>
            <Wrapper variant="small">
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
              />
              <Button
                isLoading={isSubmitting}
                type="submit"
                colorScheme="teal"
                mt={4}
              >
                Forgot Password
              </Button>
            </Wrapper>
          </Form>
        )
      }
    </Formik>
  );
};

export default ForgotPassword;
