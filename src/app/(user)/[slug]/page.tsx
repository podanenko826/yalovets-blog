'use client';

import { use } from 'react';
import Home from '../page';
import ArticleModal from '@/components/Modals/ArticleModal';
import LoadingBanner from '@/components/Modals/LoadingBanner';

const PostPage = ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = use(params);

    if (slug) {
        return <ArticleModal slug={slug} />
    }

    return <LoadingBanner />
};

export default PostPage;
