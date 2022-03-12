import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useDeletePostMutation } from '../generated/graphql';

interface UpdateDeletePostProps {
  id: number;
}

export const UpdateDeletePost: React.FC<UpdateDeletePostProps> = ({ id }) => {
  const [deletePost] = useDeletePostMutation();
  return (
    <Flex align="end" justify="end">
      <IconButton
        aria-label="delete post"
        icon={<DeleteIcon />}
        onClick={() =>
          deletePost({
            variables: { id },
            update: (cache) => {
              cache.evict({ id: 'Post:' + id });
            },
          })
        }
      />
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <Link ml={4}>
          <IconButton aria-label="delete post" icon={<EditIcon />} />
        </Link>
      </NextLink>
    </Flex>
  );
};
