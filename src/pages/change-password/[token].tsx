import { useState } from 'react';
import { Box, Button, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [isExpired, setIsExpired] = useState<string | null>(null);
  const [changePassword] = useChangePasswordMutation();
  return (
    <Formik
      initialValues={{ newPassword: '' }}
      onSubmit={async (values, { setErrors }) => {
        const response = await changePassword({
          variables: {
            token:
              typeof router.query.token === 'string' ? router.query.token : '',
            newPassword: values.newPassword,
          },
        });
        if (response.data?.changePassword.errors) {
          const errorMap = toErrorMap(response.data.changePassword.errors);
          if ('token' in errorMap) {
            setIsExpired('Token Expired');
          }
          setErrors(errorMap);
        } else if (response.data?.changePassword.user) {
          //worked
          router.push('/');
        }
      }}
    >
      {({ isSubmitting }) => {
        return (
          <Form>
            <Wrapper variant="small">
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
              <Box mt={3}>
                <Box color="red.400">{isExpired}</Box>
                <NextLink href="/forgot-password">
                  <Link ml={4}>Get a new token to change password?</Link>
                </NextLink>
              </Box>
              <Button
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
                mt={4}
              >
                Change Password
              </Button>
            </Wrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ChangePassword;
