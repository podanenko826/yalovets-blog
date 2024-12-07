'use client';

import {useRouter} from 'next/navigation';
import {FC} from 'react';
import Home from '../page';
import {usePostContext} from '@/components/PostContext';

interface PostPageProps {
    params: {slug: string};
}

const PostPage: FC<PostPageProps> = ({params}: PostPageProps) => {
    const router = useRouter();
    const {slug} = params;
    const {setCurrentSlug} = usePostContext();

    setCurrentSlug(slug);

    return <Home slug={slug} />;
};

export default PostPage;
