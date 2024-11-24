import Image from 'next/image';
import dynamic from 'next/dynamic';
import {Suspense} from 'react';
import React from 'react';

import {getMDXContent, getPost, getSortedPosts} from '@/lib/posts';
import {notFound} from 'next/navigation';
import {getAuthors} from '@/lib/authors';

const PostEditor = dynamic(() => import('@/components/EditorComponent'), {
    ssr: false,
});

const EditPage = async ({params}: {params: {slug: string}}) => {
    const {slug} = params;

    const data = await getMDXContent(slug);

    const postData = await getSortedPosts();
    const authorData = await getAuthors();

    if (!postData || !authorData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container-fluid mt-3">
            <div className="container">
                <Suspense fallback={<p>Loading...</p>}>
                    <PostEditor
                        markdown={data.markdown}
                        slug={params.slug}
                        postsData={postData}
                        authorData={authorData}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default EditPage;
