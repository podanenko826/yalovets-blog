import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import React from 'react';

import { getAuthors } from '@/lib/authors';

const PostEditor = dynamic(() => import('@/components/EditorComponent'), {
    ssr: false,
});

const EditImprintPage = async () => {
    const authorData = await getAuthors();

    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/imprint`); // Fetching from an API route
    const data = await response.json();

    return (
        <div className="container-fluid mt-3">
            <div className="container">
                <Suspense fallback={<p>Loading...</p>}>
                    <PostEditor markdown={data.content} slug={''} authorData={authorData} legalMdx='imprint' />
                </Suspense>
            </div>
        </div>
    );
};

export default EditImprintPage;
