'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';
import Home from '../page';
import { usePostContext } from '@/components/Context/PostDataContext';

interface PostPageProps {
    params: { slug: string };
}

const PostPage: FC<PostPageProps> = ({ params }: PostPageProps) => {
    const { slug } = params;

    return <Home slug={slug} />;
};

export default PostPage;
