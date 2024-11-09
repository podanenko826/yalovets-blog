import Image from 'next/image';
import dynamic from 'next/dynamic';
import {Suspense} from 'react';
import React from 'react';

import {getMDXContent} from '@/lib/posts';
import {notFound} from 'next/navigation';

const PostEditor = dynamic(() => import('@/components/EditorComponent'), {
    ssr: false,
});

const EditPage = async ({params}: {params: {slug: string}}) => {
    const {slug} = params;

    const data = await getMDXContent(slug);

    return (
        <div className="container-fluid mt-3">
            <div className="container">
                <Suspense fallback={null}>
                    <PostEditor markdown={data.markdown} slug={params.slug} />
                </Suspense>
            </div>
        </div>
    );
};

export default EditPage;
