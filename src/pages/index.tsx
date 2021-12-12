import React from 'react';
import { NavBar } from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <div>hello world</div>
      <br />
      {!data?.posts ? null : data.posts.map((post) => <p>{post.title}</p>)}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index); // withUrqlClient is a higher order components
