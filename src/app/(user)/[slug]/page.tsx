// app/posts/[slug]/page.tsx (Server Component)

import {
    MDXRemoteSerializeResult,
    MDXRemote,
    MDXRemoteProps,
} from 'next-mdx-remote/rsc';
import {serialize} from 'next-mdx-remote/serialize';
import PostPage from './PostPage';

interface PostPageWrapperProps {
    params: {slug: string};
}

const PostPageWrapper = async ({params}: PostPageWrapperProps) => {
    const {slug} = params;

    const baseUrl =
        typeof window === 'undefined'
            ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
            : '';

    // Fetch the markdown content
    const response = await fetch(`${baseUrl}/api/get-mdx?slug=${slug}`);
    if (!response.ok) {
        console.error('Failed to fetch markdown content');
        return;
    }
    console.log('RESPONSE: ', response);

    const {content} = await response.json();
    // const mdxSourceSerialized: MDXRemoteSerializeResult<
    //     Record<string, unknown>,
    //     Record<string, unknown>
    // > = await serialize(content);

    // Pass the serialized content to the client component
    return <PostPage params={params} mdxSource={content} />;
};

export default PostPageWrapper;
