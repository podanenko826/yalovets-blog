import { FC, Suspense } from 'react';
import React from 'react';

import { getMDXContent, getPost } from '@/lib/posts';
import { getAuthors } from '@/lib/authors';

import PostEditor from '@/components/EditorComponent';

export const dynamic = "force-dynamic"; // disables prerender

interface EditPageProps {
    params: Promise<{ slug: string }>;
}

const EditPage: FC<EditPageProps> = async (props: EditPageProps) => {
    const params = await props.params;
    const { slug } = params;

    const postData = await getPost(slug);
    const authorData = await getAuthors();

    let data: {
        slug: string;
        markdown: string;
    } = {
        slug: '',
        markdown: ''
    }

    if (postData && postData.date) {
        data = await getMDXContent(slug, postData.date);
    } else {
        console.log('invalid date');
        
        return <p>Loading...</p>;
    }

    if (!postData || !authorData || !data.slug || !data.markdown) {
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
