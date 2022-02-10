import React, { useState } from 'react';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'ideal' | 'updoot' | 'downdoot'
  >('ideal');
  const [, vote] = useVoteMutation();
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
          await vote({ value: 1, postId: post.id });
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
          await vote({ value: -1, postId: post.id });
          setLoadingState('ideal');
        }}
        isLoading={loadingState === 'downdoot'}
      />
    </Flex>
  );
};
