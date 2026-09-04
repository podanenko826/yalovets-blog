import { Suspense } from 'react';
import React from 'react';
import { getAuthors } from '@/lib/authors';

import PostEditor from '@/components/DynamicEditor';

export const dynamic = "force-dynamic"; // disables prerender

const AddPage = async () => {
    const authorData = await getAuthors();

    if (!authorData) return <p>Loading...</p>;

    return (
        <div className="container-fluid mt-3">
            <div className="container">
                <Suspense fallback={null}>
                    <PostEditor markdown={''} authorData={authorData} />
                </Suspense>
            </div>
        </div>
    );
};

export default AddPage;
