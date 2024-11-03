import Image from 'next/image';
import dynamic from 'next/dynamic';
import {Suspense} from 'react';
import React from 'react';

import {getMDXContent} from '@/lib/articles';
import {notFound} from 'next/navigation';

const PostEditor = dynamic(() => import('@/components/EditorComponent'), {
    ssr: false,
});

const EditPage = async ({params}: {params: {slug: string}}) => {
    const content = await getMDXContent(params.slug);

    if (!content.markdown) {
        return notFound();
    }

    return (
        <div className="container-fluid mt-3">
            <div className="container">
                <Suspense fallback={null}>
                    <PostEditor
                        markdown={content.markdown}
                        slug={content.slug}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default EditPage;
