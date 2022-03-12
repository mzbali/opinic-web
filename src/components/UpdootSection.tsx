import { gql } from '@apollo/client';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  Post,
  PostDocument,
  PostSnippetFragment,
  useVoteMutation,
} from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'ideal' | 'updoot' | 'downdoot'
  >('ideal');
  const [vote] = useVoteMutation({ notifyOnNetworkStatusChange: true });
  return (
    <Flex direction="column" justify="center" alignItems="center" mr={6}>
      <IconButton
        colorScheme={post.voteStatus === 1 ? 'orange' : ''}
        aria-label="Updoot"
        icon={<ChevronUpIcon />}
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState('updoot');
          await vote({
            variables: { value: 1, postId: post.id },
            update: (cache) => {
              const postFragment: Partial<Post> | null = cache.readFragment({
                fragment: gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                id: 'Post:' + post.id,
              });
              if (postFragment?.voteStatus === 1) {
                return;
              }
              const newPoints =
                post.points + 1 * (!postFragment?.voteStatus ? 1 : 2);
              cache.writeFragment({
                id: `Post:${post.id}`,
                fragment: gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                data: {
                  ...postFragment,
                  id: post.id,
                  voteStatus: 1,
                  points: newPoints,
                },
              });
            },
          });
          setLoadingState('ideal');
        }}
        isLoading={loadingState === 'updoot'}
      />
      <Text>{post.points}</Text>
      <IconButton
        colorScheme={post.voteStatus === -1 ? 'purple' : ''}
        aria-label="Downdoot"
        icon={<ChevronDownIcon />}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState('downdoot');
          await vote({
            variables: { value: -1, postId: post.id },
            refetchQueries: [
              { query: PostDocument, variables: { id: post.id } }, // refetch data when updoot
            ],
          });
          setLoadingState('ideal');
        }}
        isLoading={loadingState === 'downdoot'}
      />
    </Flex>
  );
};
