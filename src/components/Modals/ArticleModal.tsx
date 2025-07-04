'use client';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Modals.module.css';
import moment from 'moment';
import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebookF, FaLinkedin, FaRedditAlien } from 'react-icons/fa';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { PostItem } from '@/types';
import { getMDXContent, getPost, trackView } from '@/lib/posts';
import { MDXProvider } from '@mdx-js/react';
import { mdSerialize } from '../../services/mdSerializer';
import { useMDXComponents } from '../../../mdx-components';
import { notFound, usePathname, useRouter } from 'next/navigation';
import { usePostStore } from '../posts/store';
import { useAuthorStore } from '../authors/store';
import LoadingSkeleton from '../LoadingSkeleton';
import '@/app/page.css';

import YouTubeEmbed from '@/components/mdx/YouTubeEmbed';

const NavBar = lazy(() => import('@/components/NavBar'));
const Footer = lazy(() => import('@/components/Footer'));

interface ArticleModalProps {
    slug: string;
}

/**
 * ArticleModal displays a post based on the provided slug.
 * 
 * @param {Object} props - The props for ArticleModal.
 * @param {string} props.slug - A slug needed to fetch the post from the API.
 * @param {React.Dispatch<React.SetStateAction<PostItem | null>>} [props.setValue] - 
 * Optional. Pass a useState setter to get the up-to-date selected post from the ArticleModal.
 */

const ArticleModal: React.FC<ArticleModalProps> = ({ slug }) => {
    const { posts, selectedPost, setSelectedPost } = usePostStore();
    const { authors } = useAuthorStore();

    const [selectedMarkdown, setSelectedMarkdown] = useState<string | null>(null);
    const [serializedMarkdown, setSerializedMarkdown] = useState<MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>>();

    const [popularPosts, setPopularPosts] = useState<PostItem[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    //? Encoded link and text for sharing purpose on social media
    // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const baseShareUrl = 'https://yalovets.blog';
    const postUrl = encodeURIComponent(baseShareUrl + '/' + selectedPost?.slug);
    const postText = encodeURIComponent(selectedPost?.title as string);

    const pathname = usePathname();
    
    const router = useRouter();

    const components = useMDXComponents();

    useEffect(() => {
        const sortedByViews = posts
            .filter(post => post.viewsCount !== undefined) // Filter out posts with undefined viewsCount
            .sort((a, b) => (b.viewsCount ?? 0) - (a.viewsCount ?? 0));

        const mostPopular = sortedByViews.slice(0, 30).filter(post => post.slug !== undefined);

        setPopularPosts(mostPopular);
    }, [posts]);

    useEffect(() => {
        // Automatically close modal if URL doesn't match the selected post
        if (selectedPost && pathname !== `/${selectedPost?.slug}`) {
            setSelectedPost(null);
            setSelectedMarkdown(null);
            setSerializedMarkdown(undefined);
        }
    }, [pathname, selectedPost]);

    useEffect(() => {
        if (slug) {
            document.title = `${selectedPost?.title} / Yalovets Blog`;

            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [slug, selectedPost]);

    //? Update post's viewsCount when it gets opened
    useEffect(() => {
        if (selectedPost) {
            trackView(selectedPost?.email, selectedPost?.slug);
        }
    }, [selectedPost]);

    useEffect(() => {
        const returnToPost = async () => {
            if (typeof window === 'undefined') return;

            if (selectedPost === null && slug) {
                const postFromCache = posts.find(post => post.slug === slug) as PostItem;
                let post: PostItem;

                if (postFromCache) {
                    post = postFromCache;
                } else {
                    post = await getPost(slug);
                }

                if (!post) return;

                const MdxContent = await getMDXContent(post.slug, post.date as string);
                const markdown = MdxContent.markdown;

                if (post && markdown) {
                    setSelectedPost(post);
                    setSelectedMarkdown(markdown);
                }
            }
        };

        returnToPost();
    }, [slug, selectedPost]);

    useEffect(() => {
        const processMarkdown = async () => {
            if (selectedMarkdown) {
                const result = await mdSerialize(selectedMarkdown);

                setSerializedMarkdown(result);
            }
        };

        processMarkdown();
    }, [selectedMarkdown]);

    const closeModal = () => {
        setSelectedPost(null);
        setSelectedMarkdown(null);
        setLoading(true);

        router.back();
    };

    useEffect(() => {
        if (selectedMarkdown) {
            //? Fake loading time, adjust the time if needed
            setTimeout(() => setLoading(false), 300);
        }
    }, [serializedMarkdown]);

    const author = authors.find(author => author.email === selectedPost?.email);

    if (!slug) return null;

    return (
        <>
            <div className={styles.articlePage} id="modal">
                <NavBar />
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
                                        {!loading && selectedPost && (
                                            <>
                                                <h1 className="d-none d-lg-block px-2 heading-xlarge w-100 col-md-11 col-lg-12 text-center" id="col-heading-1">
                                                    {selectedPost.title}
                                                </h1>
                                                <h1 className="d-none d-md-block d-lg-none px-2 heading-large w-100 col-md-11 col-lg-12 text-center" id="col-heading-1">
                                                    {selectedPost.title}
                                                </h1>
                                                <h1 className="d-block d-md-none px-2 heading-larger w-100 col-md-11 col-lg-12 text-center" id="col-heading-1">
                                                    {selectedPost.title}
                                                </h1>
                                            </>
                                        )}
                                        {!loading && selectedPost && author && (
                                            <div className="d-flex justify-content-center mb-1 gap-2">
                                                <Link href={`/author/${author.authorKey}`} className="d-flex align-items-center gap-1 a-link h-min">
                                                    {author.fullName}
                                                </Link>
                                                {author.isGuest && (
                                                    <p className="m-0">
                                                        <span className="badge badge-guest">Guest</span>
                                                    </p>
                                                )}
                                                <p className="m-0">•</p>
                                                <p className="m-0">{moment.utc(selectedPost.date).format('D MMM YYYY')} </p>
                                                {moment.utc(selectedPost.modifyDate).isAfter(moment.utc(selectedPost.date)) && !selectedPost.sponsoredBy && (
                                                    <>
                                                        <p className="d-none d-md-block m-0">•</p>
                                                        <span className="d-none d-md-block px-2 m-0 rounded-pill text-bg-secondary">{'Updated ' + moment.utc(selectedPost.modifyDate).fromNow()}</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        {!loading && selectedPost && moment.utc(selectedPost.modifyDate).isAfter(moment.utc(selectedPost.date)) && !selectedPost.sponsoredBy && (
                                            <span className="d-md-none px-2 mb-4 rounded-pill text-bg-secondary" id="mobileUpdatedBadge">
                                                {'Updated ' + moment.utc(selectedPost.modifyDate).fromNow()}
                                            </span>
                                        )}
                                        {!loading && selectedPost && selectedPost.sponsoredBy && (
                                            <span className="px-2 mb-4 rounded-pill badge-sponsored">
                                                Sponsored by{' '}
                                                {selectedPost.sponsorUrl ? (
                                                    <Link href={selectedPost.sponsorUrl} target="_blank" className="a-link a-link-active">
                                                        <strong>{selectedPost.sponsoredBy}</strong>
                                                    </Link>
                                                ) : (
                                                    <strong>{selectedPost.sponsoredBy}</strong>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className={`col-12 col-md-2 ${styles.socialLinks}`}>
                                        {!loading && selectedPost && (
                                            <>
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
                                            </>
                                        )}
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <article className="article">
                                            {!loading && serializedMarkdown ? (
                                                <Suspense fallback={<LoadingSkeleton />}>
                                                    <MDXProvider components={components}>
                                                        <MDXRemote compiledSource={serializedMarkdown?.compiledSource as string} scope={serializedMarkdown?.scope} frontmatter={serializedMarkdown?.frontmatter} components={{YouTubeEmbed}} />
                                                    </MDXProvider>
                                                </Suspense>
                                            ) : (
                                                <LoadingSkeleton />
                                            )}
                                        </article>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {author && (
                            <div className="container-fluid about-me py-5 mt-5">
                                <div className="container row">
                                    <div className="col-3 col-lg-1 d-flex">
                                        <Image className="img-fluid about-me-image" src={author.profileImageUrl} alt="pfp" title={author.fullName.split(' ').at(0)} width={290} height={290} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" loading="lazy" />
                                    </div>
                                    <div className="col-8 mt-md-0 col-md-7">
                                        <div className='d-flex justify-content-between mb-1'>
                                            <div className='d-sm-none'>
                                                <Link className='a-link a-button' href={`/author/${author.authorKey}`}>
                                                    <h1 className="subheading-smaller">
                                                        Written by <br /> {author.fullName}
                                                    </h1>
                                                </Link>
                                            </div>

                                            <div className='d-none d-sm-block'>
                                                <Link className='a-link a-button' href={`/author/${author.authorKey}`}>
                                                    <h1 className="subheading-smaller">
                                                        Written by {author.fullName}
                                                    </h1>
                                                </Link>
                                            </div>
                                            
                                            <div className='d-none d-sm-block'>
                                                <Link href={`/author/${author.authorKey}`}>
                                                    <button className='btn-outlined py-1 py-lg-0'>Visit</button>
                                                </Link>
                                            </div>
                                        </div>
                                        <p className="subheading-xsmall" id="col-heading-1">
                                            {author.bio}
                                        </p>
                                        {/* <p className="subheading-small pt-4" id="col-heading-1">
                                            You can find me on these social media:
                                        </p>
                                        <ul className={styles.socialMediaLinks}>
                                            {Object.entries(author.socialLinks).map(([platform, url]) => {
                                                if (!url) return;
                                                if (platform === 'Email' || platform === 'GitHub') return;

                                                return (
                                                    <li key={platform}>
                                                        <Link href={url} className="a-link a-btn a-button" id="col-heading-1" target="_blank">
                                                            {platform}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul> */}
                                    </div>
                                    
                                </div>
                            </div>
                        )}
                        {selectedPost && popularPosts && (
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
                                                <div className='read-further-button'>
                                                    <h5 id="col-heading-1">{post.postType}: {post.title}</h5>
                                                </div>
                                            </Link>
                                        ))}
                                </div>
                            </div>
                        )}
                    </section>
                    {selectedPost && <Footer />}
                </>
            </div>
        </>
    );
};

export default ArticleModal;
