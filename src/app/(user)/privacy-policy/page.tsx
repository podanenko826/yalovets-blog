'use client';

import Footer from '@/components/Footer';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import NavBar from '@/components/NavBar';
import { mdSerialize } from '@/services/mdSerializer';
import { MDXProvider } from '@mdx-js/react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import React, { Suspense, useEffect, useState } from 'react';

const ImprintPage = () => {
    const [serializedMarkdown, setSerializedMarkdown] = useState<MDXRemoteSerializeResult>();

    useEffect(() => {
        const fetchMarkdown = async () => {
            const response = await fetch('/api/privacy-policy'); // Fetching from an API route
            const data = await response.json();

            const result = await mdSerialize(data.content);

            setSerializedMarkdown(result);
        };

        fetchMarkdown();
    }, []);

    return (
        <>
            <NavBar />
            <div className='container py-5'>
                <article className="article">
                    {serializedMarkdown ? (
                        <Suspense fallback={<LoadingSkeleton />}>
                            <MDXProvider>
                                <MDXRemote compiledSource={serializedMarkdown?.compiledSource as string} scope={serializedMarkdown?.scope} frontmatter={serializedMarkdown?.frontmatter} />
                            </MDXProvider>
                        </Suspense>
                    ) : (
                        <LoadingSkeleton />
                    )}
                </article>
            </div>
            <Footer />
        </>
    );
};

export default ImprintPage;
