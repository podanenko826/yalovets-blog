'use client';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/components/ArticleModal.module.css';
import NavBar from './NavBar';
import { usePostContext } from './PostContext';
import moment from 'moment';
import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebookF, FaLinkedin, FaRedditAlien } from 'react-icons/fa';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Footer from './Footer';
import { PostItem, TagItem } from '@/types';
import { getMDXContent, getSortedPosts, trackView } from '@/lib/posts';
import { usePathname } from 'next/navigation';
import { getAuthors } from '@/lib/authors';
import { MDXProvider } from '@mdx-js/react';
import { mdSerialize } from '../services/mdSerializer';
import { useMDXComponents } from '../../mdx-components';
import Head from 'next/head';
import { getTagsData } from '@/lib/tags';

const ArticleModal: React.FC = () => {
    const { selectedPost, setSelectedPost } = usePostContext();

    const transformedSlug = `${selectedPost?.slug
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replaceAll(' ', '-')
        .toLowerCase()}`;

    const { expandedPost, setExpandedPost } = usePostContext();
    const { posts, setPosts } = usePostContext();
    const { authors, setAuthors } = usePostContext();
    const { openModal } = usePostContext();
    const { selectedMarkdown, setSelectedMarkdown } = usePostContext();
    const { closeModal } = usePostContext();
    const [serializedMarkdown, setSerializedMarkdown] = useState<MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>>();

    const [popularPosts, setPopularPosts] = useState<PostItem[]>([]);

    //? Encoded link and text for sharing purpose on social media
    // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const baseShareUrl = 'https://yalovets.blog';
    const postUrl = encodeURIComponent(baseShareUrl + '/' + selectedPost?.slug);
    const postText = encodeURIComponent(selectedPost?.title as string);

    const components = useMDXComponents();

    const currentPath = usePathname();

    const format = 'YYYY-MM-DD';

    useEffect(() => {
        const sortedByViews = posts
            .filter(post => post.viewsCount !== undefined) // Filter out posts with undefined viewsCount
            .sort((a, b) => (b.viewsCount ?? 0) - (a.viewsCount ?? 0));

        const mostPopular = sortedByViews.slice(0, 30).filter(post => post.slug !== undefined);

        setPopularPosts(mostPopular);
    }, [posts]);

    useEffect(() => {
        if (selectedPost) {
            document.title = `${selectedPost?.title} / Yalovets Blog`;
        }
    }, [selectedPost]);

    useEffect(() => {
        if (selectedPost) {
            setExpandedPost(null); // Clears Expanded Post value to authomatically close the Read More modal when user opens the full article
        }
    }, [selectedPost]);

    useEffect(() => {
        if (selectedPost) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [selectedPost]);

    //? Update post's viewsCount when it gets opened
    useEffect(() => {
        if (selectedPost) {
            trackView(selectedPost?.email, selectedPost?.slug);
        }
    }, [selectedPost]);

    useEffect(() => {
        const returnToPost = async () => {
            const postUrl = window.location.href;
            const postSlug = postUrl.split('/').at(-1);

            if (posts.length < 1) return;

            if (selectedPost === null && postSlug) {
                const post = posts.find(post => post.slug === postSlug) as PostItem;
                if (!post) return;

                const MdxContent = await getMDXContent(post.slug, post.date as string);
                const markdown = MdxContent.markdown;
                const previousPath = window.location.href;

                if (post && markdown) {
                    setSelectedPost(post);
                    openModal(post, markdown, previousPath);
                }
            }
        };

        returnToPost();
    }, [window.location.href, posts]);

    useEffect(() => {
        const processMarkdown = async () => {
            if (selectedMarkdown) {
                const result = await mdSerialize(selectedMarkdown);

                setSerializedMarkdown(result);
            }
        };

        processMarkdown();
    }, [selectedMarkdown]);
    if (!selectedPost || !selectedMarkdown) return null;

    const author = authors.find(author => author.email === selectedPost.email);

    if (typeof window === 'undefined') return null;
    if (!author) return null;

    return (
        <>
            <Head>
                {/* Dynamic Meta Tags */}
                <title>{selectedPost.title}</title>
                <meta name="description" content={selectedPost.description} />
                <meta property="og:title" content={selectedPost.title} />
                <meta property="og:description" content={selectedPost.description} />
                <meta property="og:image" content={selectedPost.imageUrl} />
                <meta property="og:url" content={postUrl} />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={selectedPost.title} />
                <meta name="twitter:description" content={selectedPost.description} />
                <meta name="twitter:image" content={selectedPost.imageUrl} />
            </Head>
            <div className={styles.articlePage} id="modal">
                <NavBar />
                {selectedPost && authors && selectedMarkdown && serializedMarkdown && (
                    <>
                        <section>
                            <div className="mt-md-5">
                                <div className="container pt-1">
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="h-min mt-md-2 mb-2 mb-md-0 d-flex justify-content-md-center">
                                                <button onClick={() => closeModal()} className="d-block d-md-none btn-outlined py-2 px-md-3">
                                                    ← Back
                                                </button>
                                                <button onClick={() => closeModal()} className="d-none d-md-block btn-pill py-2 px-md-2">
                                                    ←
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-8 text-center">
                                            <h1 className="d-none d-lg-block px-2 heading-xlarge w-100 col-md-11 col-lg-12 text-center" id="col-heading-1">
                                                {selectedPost.title}
                                            </h1>
                                            <h1 className="d-none d-md-block d-lg-none px-2 heading-large w-100 col-md-11 col-lg-12 text-center" id="col-heading-1">
                                                {selectedPost.title}
                                            </h1>
                                            <h1 className="d-block d-md-none px-2 heading-larger w-100 col-md-11 col-lg-12 text-center" id="col-heading-1">
                                                {selectedPost.title}
                                            </h1>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Link href={`/author/${author.authorKey}`} className="a-link h-min">
                                                    {author.fullName}
                                                </Link>
                                                <p className="m-0">•</p>
                                                <p className="m-0">{moment(selectedPost.date, format).format('D MMM YYYY')} </p>
                                                {moment(selectedPost.modifyDate, format).isAfter(moment(selectedPost.date, format)) && (
                                                    <>
                                                        <p className="d-none d-md-block m-0">•</p>
                                                        <span className="d-none d-md-block px-2 m-0 rounded-pill text-bg-secondary">{'Updated ' + moment(selectedPost.modifyDate, format).fromNow()}</span>
                                                    </>
                                                )}
                                            </div>
                                            {moment(selectedPost.modifyDate, format).isAfter(moment(selectedPost.date, format)) && (
                                                <span className="d-md-none px-2 mb-4 rounded-pill text-bg-secondary" id="mobileUpdatedBadge">
                                                    {'Updated ' + moment(selectedPost.modifyDate, format).fromNow()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mt-5">
                                        <div className={`col-12 col-md-2 ${styles.socialLinks}`}>
                                            <Link href={`https://x.com/share?url=${postUrl}&text=${postText}`} title="Share on X" target="_blank">
                                                <FaXTwitter className="fs-1 p-1" />
                                            </Link>

                                            <Link href={`https://www.linkedin.com/cws/share?url=${postUrl}`} title="Share on LinkedIn" target="_blank">
                                                <FaLinkedin className="fs-1 p-1" />
                                            </Link>

                                            <Link href={`https://www.reddit.com/submit?url=${postUrl}`} title="Share on Reddit" target="_blank">
                                                <FaRedditAlien className="fs-1 p-1" />
                                            </Link>

                                            <Link href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`} title="Share on Facebook" target="_blank">
                                                <FaFacebookF className="fs-1 p-1" />
                                            </Link>
                                        </div>
                                        <div className="col-12 col-md-8">
                                            <article className="article">
                                                <MDXProvider components={components}>
                                                    <MDXRemote compiledSource={serializedMarkdown?.compiledSource as string} scope={serializedMarkdown?.scope} frontmatter={serializedMarkdown?.frontmatter} />
                                                </MDXProvider>
                                            </article>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container-fluid about-me py-5 mt-5">
                                <div className="container d-flex row align-items-center justify-content-center">
                                    <div className="col-7 col-md-4 col-lg-3">
                                        <div className="pb-3">
                                            <h1 className="subheading" id="col-heading-1">
                                                {author.fullName}
                                            </h1>
                                        </div>
                                        <Image className="img-fluid ivan-yalovets" src={`/${author.profileImageUrl}`} alt="pfp" title={author.fullName.split(' ').at(0)} width={290} height={290} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" loading="lazy" />
                                    </div>
                                    <div className="col-9 mt-3 mt-md-0 col-md-5 offset-md-1">
                                        <p className="pt-2 subheading-small" id="col-heading-1">
                                            {author.bio}
                                        </p>
                                        <p className="subheading-small" id="col-heading-1">
                                            You can find me on these social media:
                                        </p>
                                        <ul className={styles.socialMediaLinks}>
                                            <li>
                                                <Link href={author.socialLinks.instagramUrl} className="a-link" id="col-heading-1" target="_blank">
                                                    Instagram
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={author.socialLinks.facebookUrl} className="a-link" id="col-heading-1" target="_blank">
                                                    Facebook
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={author.socialLinks.linkedInUrl} className="a-link" id="col-heading-1" target="_blank">
                                                    LinkedIn
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {popularPosts && (
                                <div className="container-fluid read-further mb-5 py-3">
                                    <div className="container d-flex row align-items-center justify-content-center p-0">
                                        <div className="col-md-9 pt-2 pb-3">
                                            <h2 className="heading" id="col-heading-2">
                                                Further Reading
                                            </h2>
                                        </div>
                                        {popularPosts
                                            .filter(post => post.slug !== selectedPost.slug)
                                            .sort(() => Math.random() - 0.5)
                                            .slice(0, 3)
                                            .map((post, index) => (
                                                <Link href={`/${post.slug}`} className="col-md-9" key={index}>
                                                    <div>
                                                        <h5 id="col-heading-1">Article: {post.title}</h5>
                                                    </div>
                                                </Link>
                                            ))}

                                        {selectedPost.tags &&
                                            selectedPost.tags[0] !== '' &&
                                            selectedPost.tags?.slice(0, 3).map((tag, index) => (
                                                <Link href={`/tag/${tag}`} className="col-md-9" key={index}>
                                                    <div>
                                                        <h5 id="col-heading-1">Tag: {tag}</h5>
                                                    </div>
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </section>
                        <Footer />
                    </>
                )}
            </div>
        </>
    );
};

export default ArticleModal;
