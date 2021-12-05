import { FieldError } from '../generated/graphql';

/* [{field:'someFieldName', error:'message of the error'}] ->
[someFieldName:'message of the error'] */

export const toErrorMap = (responseError: FieldError[]) => {
  const errorMap: Record<string, string> = {};
  responseError.forEach(({ field, message }) => {
    errorMap[field] = message;
  });
  return errorMap;
};
