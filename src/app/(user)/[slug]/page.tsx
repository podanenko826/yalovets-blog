import dynamic from 'next/dynamic';
import moment from 'moment';
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

import {getArticleData, getPost} from '@/lib/posts';
import {getUsers} from '@/lib/users';
import Link from 'next/link';

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
    const post = await getArticleData(slug);
    if (!post.postData || !post.markdown) {
        console.error('Failed to fetch markdown content');
        return notFound();
    }

    const markdown = post.markdown;

    const postData = post.postData;

    const authorData = post.authorData;

    return (
        <section>
            <div className="mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-2">
                            <div className="h-min mt-md-2 d-flex justify-content-md-center">
                                <Link href="/">
                                    <button className="btn-outlined py-2 px-3">
                                        ←Back
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-8 text-center">
                            <h1
                                className="heading-xlarge w-100 col-md-11 col-lg-12 text-center"
                                id="col-heading-1">
                                {postData.title}
                            </h1>
                            <div className="d-flex justify-content-center gap-2">
                                <p>
                                    {authorData.fullName} •{' '}
                                    {moment(postData.date, 'DD-MM-YYYY').format(
                                        'D MMM YYYY'
                                    )}{' '}
                                </p>
                                {moment(
                                    postData.modifyDate,
                                    'DD-MM-YYYY'
                                ).isAfter(
                                    moment(postData.date, 'DD-MM-YYYY')
                                ) && (
                                    <>
                                        <p className="d-none d-md-block">•</p>
                                        <span className="d-none d-md-block px-2 mb-4 rounded-pill text-bg-secondary">
                                            {'Updated ' +
                                                moment(
                                                    postData.modifyDate,
                                                    'DD-MM-YYYY'
                                                ).fromNow()}
                                        </span>
                                    </>
                                )}
                            </div>
                            {moment(postData.modifyDate, 'DD-MM-YYYY').isAfter(
                                moment(postData.date, 'DD-MM-YYYY')
                            ) && (
                                <span
                                    className="d-md-none px-2 mb-4 rounded-pill text-bg-secondary"
                                    id="mobileUpdatedBadge">
                                    {'Updated ' +
                                        moment(
                                            postData.modifyDate,
                                            'DD-MM-YYYY'
                                        ).fromNow()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-2 social-links">
                            {authorData.socialLinks.emailAddress && (
                                <Link
                                    href={authorData.socialLinks.emailAddress}
                                    target="_blank">
                                    <MdEmail className="fs-1 p-1" />
                                </Link>
                            )}
                            {authorData.socialLinks.linkedInUrl && (
                                <Link
                                    href={authorData.socialLinks.linkedInUrl}
                                    target="_blank">
                                    <FaLinkedin className="fs-1 p-1" />
                                </Link>
                            )}
                            {authorData.socialLinks.instagramUrl && (
                                <Link
                                    href={authorData.socialLinks.instagramUrl}
                                    target="_blank">
                                    <FaSquareInstagram className="fs-1 p-1" />
                                </Link>
                            )}
                            {authorData.socialLinks.facebookUrl && (
                                <Link
                                    href={authorData.socialLinks.facebookUrl}
                                    target="_blank">
                                    <FaFacebookF className="fs-1 p-1" />
                                </Link>
                            )}
                        </div>
                        <div className="col-12 col-sm-8">
                            <article className="article">
                                <MDXRemote source={markdown} />
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PostPage;
