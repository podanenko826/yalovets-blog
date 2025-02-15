'use client';

import { FC } from 'react';
import Home from '../page';

interface PostPageProps {
    params: { slug: string };
}

const PostPage: FC<PostPageProps> = ({ params }: PostPageProps) => {
    const { slug } = params;

    return <Home slug={slug} />;
};

export default PostPage;
