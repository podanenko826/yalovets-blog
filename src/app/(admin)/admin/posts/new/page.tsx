import Image from 'next/image';
import dynamic from 'next/dynamic';
import {Suspense} from 'react';
import React from 'react';
import {getUsers} from '@/lib/users';

const PostEditor = dynamic(() => import('@/components/EditorComponent'), {
    ssr: false,
});

const AddPage = async () => {
    const authorData = await getUsers();

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