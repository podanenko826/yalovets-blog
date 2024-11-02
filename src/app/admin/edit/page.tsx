'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {Suspense} from 'react';
import {MDXEditorMethods} from '@mdxeditor/editor';
import React from 'react';

const MDXEditor = dynamic(() => import('@/components/EditorComponent'), {
    ssr: false,
});

const AddPage = () => {
    return (
        <div className="container-fluid mt-3">
            <div className="container-lg">
                <Suspense fallback={null}>
                    <MDXEditor markdown={'# Hello world'} />
                </Suspense>
            </div>
        </div>
    );
};

export default AddPage;
