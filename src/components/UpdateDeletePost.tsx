import React from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { useDeletePostMutation } from '../generated/graphql';

interface UpdateDeletePostProps {
  id: number;
}

export const UpdateDeletePost: React.FC<UpdateDeletePostProps> = ({ id }) => {
  const [, deletePost] = useDeletePostMutation();
  return (
    <IconButton
      aria-label="delete post"
      icon={<DeleteIcon />}
      colorScheme="red"
      ml="auto"
      mt="auto"
      onClick={() => deletePost({ id })}
    />
  );
};
