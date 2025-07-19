'use client';

import Home from '../page';

const PostPage = ({ params }: { params: { slug: string } }) => {
    const { slug } = params;

    return <Home params={{ slug: slug }} />;
};

export default PostPage;
