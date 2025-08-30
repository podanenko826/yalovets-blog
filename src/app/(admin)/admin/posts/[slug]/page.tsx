import Image from 'next/image';
import dynamic from 'next/dynamic';
import { FC, Suspense } from 'react';
import React from 'react';

import { getMDXContent, getPost, getSortedPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { getAuthors } from '@/lib/authors';

const PostEditor = dynamic(() => import('@/components/EditorComponent'));

interface EditPageProps {
    params: Promise<{ slug: string }>;
}

const EditPage: FC<EditPageProps> = async (props: EditPageProps) => {
    const params = await props.params;
    const { slug } = params;

    const postData = await getPost(slug);
    const authorData = await getAuthors();

    const data = await getMDXContent(slug, postData.date as string);

    if (!postData || !authorData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container-fluid mt-3">
            <div className="container">
                <Suspense fallback={<p>Loading...</p>}>
                    <PostEditor markdown={data.markdown} slug={params.slug} postData={postData} authorData={authorData} />
                </Suspense>
            </div>
        </div>
    );
};

export default EditPage;
