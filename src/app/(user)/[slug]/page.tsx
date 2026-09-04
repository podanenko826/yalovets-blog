import ArticleModal from '@/components/Modals/ArticleModal';
import { getPost } from '@/lib/posts';
import { notFound } from 'next/navigation';

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const post = await getPost(slug);

    if (!post || !post.slug) {
        notFound();
    }

    return <ArticleModal slug={slug} />
};

export default PostPage;