// 'use client';

import dynamic from 'next/dynamic';
import {MdEmail} from 'react-icons/md';
import {FaLinkedin, FaFacebookF} from 'react-icons/fa';
import {FaSquareInstagram} from 'react-icons/fa6';
import {notFound, useParams} from 'next/navigation';
import {FC, useEffect, useState} from 'react';
import {
    MDXRemote,
    MDXRemoteSerializeResult,
    MDXRemoteProps,
} from 'next-mdx-remote/rsc';
import {serialize} from 'next-mdx-remote/serialize';

interface PostPageProps {
    params: {slug: string};
    // mdxSource: MDXRemoteProps | MDXRemoteSerializeResult | null;
}

const PostPage: FC<PostPageProps> = async ({params}: PostPageProps) => {
    const {slug} = params;

    const baseUrl =
        typeof window === 'undefined'
            ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
            : '';

    // Fetch the markdown content
    const response = await fetch(`${baseUrl}/api/get-mdx?slug=${slug}`);
    if (!response.ok) {
        console.error('Failed to fetch markdown content');
        return notFound();
    }

    const {content} = await response.json();

    if (!content) {
        return notFound();
    }

    return (
        <section>
            <div className="mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8 offset-sm-2 text-center">
                            <h1
                                className="heading-xlarge w-100 col-md-11 col-lg-12 text-center"
                                id="col-heading-1">
                                {/* {articleData.title} */}
                                {slug}
                            </h1>
                            <p>
                                {/* {articleData.authorName} •{' '}
                                    {articleData.date.toString()} */}
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-2 social-links">
                            <a href="#">
                                <MdEmail className="fs-1 p-1" />
                            </a>
                            <a href="#">
                                <FaLinkedin className="fs-1 p-1" />
                            </a>
                            <a href="https://www.instagram.com/yalovetsvanya?igsh=MWNrbWtwa2oyODE1eQ==">
                                <FaSquareInstagram className="fs-1 p-1" />
                            </a>
                            <a href="https://www.facebook.com/yalovechik">
                                <FaFacebookF className="fs-1 p-1" />
                            </a>
                        </div>
                        <div className="col-12 col-sm-8">
                            <article className="article">
                                <MDXRemote source={content} />
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PostPage;
