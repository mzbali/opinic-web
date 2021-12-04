import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';

/* InputHTMLAttributes<HTMLInputElement> means take/expect everyting a regular input will take */
/* We can do whatever input field we want to, really handy */

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error, touched }] = useField(props);
  return (
    <FormControl isInvalid={error && touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
