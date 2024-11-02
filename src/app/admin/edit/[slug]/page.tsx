import Image from 'next/image';
import dynamic from 'next/dynamic';
import {Suspense} from 'react';

const MDXEditor = dynamic(() => import('@/components/EditorComponent'), {
    ssr: false,
});

const EditPage = () => {
    return (
        <Suspense fallback={null}>
            <MDXEditor markdown={'# Hello world'} />
        </Suspense>
    );
};

export default EditPage;
