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
import { getPopularPosts, getPost, trackView } from '@/lib/posts';
import { MDXProvider } from '@mdx-js/react';
import { mdSerialize } from '../../services/mdSerializer';
import { useMDXComponents } from '../../../mdx-components';
import { notFound, usePathname, useRouter } from 'next/navigation';
import { usePostStore } from '../posts/store';
import { useAuthorStore } from '../authors/store';
import LoadingSkeleton from '../LoadingSkeleton';
import '@/app/page.css';

import YouTubeEmbed from '@/components/mdx/YouTubeEmbed';

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

const POPULAR_POSTS_LIMIT = 3;

const ArticleModal: React.FC<ArticleModalProps> = ({ slug }) => {
    const { posts, fetchPosts, selectedPost, setSelectedPost } = usePostStore();
    const { authors, fetchAuthors } = useAuthorStore();

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
        const fetchPopularPosts = async () => {
            const mostPopular = await getPopularPosts(30);

            if (mostPopular.length > 0) {
                setPopularPosts(mostPopular);
            }
        };

        fetchPopularPosts();
    }, [setPopularPosts]);

    useEffect(() => {
        if (authors.length === 0) {
            fetchAuthors();
        }
    }, [fetchAuthors, authors.length]);

    useEffect(() => {
        return () => {
            setSelectedPost(null);
            setSelectedMarkdown(null);
            setSerializedMarkdown(undefined);
        };
    }, [setSelectedPost]);

    useEffect(() => {
        if (slug && selectedPost) {
            document.title = `${selectedPost?.title} / AWS By Denis`;
        } else {
            document.title = "AWS By Denis";
        }
    }, [slug, selectedPost]);

    //? Update post's views_count when it gets opened
    useEffect(() => {
        if (selectedPost) {
            console.log("selected post: ", selectedPost);

            trackView(selectedPost?.id as string, selectedPost?.slug);
        }
    }, [selectedPost]);

    useEffect(() => {
        let isMounted = true;
        
        const returnToPost = async () => {
            if (typeof window === 'undefined') return;
            if (loading) return;

            if (selectedPost === null && slug) {
                const postFromCache = posts.find(post => post.slug === slug) as PostItem;
                let post: PostItem;

                if (postFromCache) {
                    post = postFromCache;
                } else {
                    post = await getPost(slug);
                }

                if (!post) return;

                if (post && isMounted) {
                    setSelectedPost(post);
                }
            }
        };

        returnToPost();
        
        return () => {
            isMounted = false;
        };
    }, [slug, selectedPost, setSelectedPost, posts, loading]);

    useEffect(() => {
        const processMarkdown = async () => {
            if (selectedPost) {
                const result = await mdSerialize(selectedPost?.content as string);

                setSerializedMarkdown(result);
            }
        };

        processMarkdown();
    }, [selectedPost]);

    const closeModal = () => {
        setSelectedPost(null);
        setSelectedMarkdown(null);
        setSerializedMarkdown(undefined);
        setLoading(true);

        router.back();
    };

    useEffect(() => {
        if (slug && loading) {
            //? Fake loading time, adjust the time if needed
            const timer = setTimeout(() => setLoading(false), 250);
            return () => clearTimeout(timer);
        }
    }, [slug, loading]);

    const author = authors.find(author => author.id === selectedPost?.author_id);

    if (!slug) return null;

    return (
        <>
            <div className={styles.articlePage} id="modal">
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
                                    <div className="col-md-8 text-left">
                                        {!loading && selectedPost && (
                                            <>
                                                <h1 className="d-none d-lg-block heading-xlarge w-100 col-md-11 col-lg-12" id="col-heading-1">
                                                    {selectedPost.title}
                                                </h1>
                                                <h1 className="d-none d-md-block d-lg-none px-2 heading-large w-100 col-md-11 col-lg-12" id="col-heading-1">
                                                    {selectedPost.title}
                                                </h1>
                                                <h1 className="d-block d-md-none px-2 heading-larger w-100 col-md-11 col-lg-12" id="col-heading-1">
                                                    {selectedPost.title}
                                                </h1>

                                                {/* <div className="article">
                                                    <p className="d-none d-lg-block py-1 col-md-11 col-lg-12">{selectedPost.description}</p>
                                                </div> */}
                                            </>
                                        )}
                                        {!loading && selectedPost && author && (
                                            <div className="d-flex justify-content-left mb-1 gap-2">
                                                <p className="m-0 subheading-xsmall">{moment.utc(selectedPost.created_at).format('D MMM YYYY')} </p>
                                                {/* <p className="m-0">•</p> */}
                                                <p className="m-0 subheading-xsmall">•</p>
                                                <p className="m-0 subheading-xsmall">{selectedPost.read_time} min</p>
                                                <p className="m-0 subheading-xsmall">•</p>
                                                <p className="m-0 subheading-xsmall">{selectedPost.views_count} views</p>
                                                <p className="m-0 subheading-xsmall">•</p>
                                                <Link href={`/author/${author.handle}`} className="d-flex align-items-center gap-1 a-link h-min subheading-xsmall">
                                                    {author.full_name}
                                                </Link>
                                                {author.role === 'guest' && (
                                                    <p className="m-0">
                                                        <span className="badge badge-guest">Guest</span>
                                                    </p>
                                                )}
                                                {moment.utc(selectedPost.updated_at).isAfter(moment.utc(selectedPost.created_at)) && !selectedPost.sponsored_by && (
                                                    <>
                                                        <p className="d-none d-md-block m-0 subheading-xsmall">•</p>
                                                        <span className="d-none d-md-block px-2 m-0 rounded-pill text-bg-secondary">{'Updated ' + moment.utc(selectedPost.updated_at).fromNow()}</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        {!loading && selectedPost && moment.utc(selectedPost.updated_at).isAfter(moment.utc(selectedPost.created_at)) && !selectedPost.sponsored_by && (
                                            <span className="d-md-none px-2 mb-4 rounded-pill text-bg-secondary" id="mobileUpdatedBadge">
                                                {'Updated ' + moment.utc(selectedPost.updated_at).fromNow()}
                                            </span>
                                        )}
                                        {!loading && selectedPost && selectedPost.sponsored_by && (
                                            <span className="px-2 mb-4 rounded-pill badge-sponsored">
                                                Sponsored by{' '}
                                                {selectedPost.sponsor_url ? (
                                                    <Link href={selectedPost.sponsor_url} target="_blank" className="a-link a-link-active">
                                                        <strong>{selectedPost.sponsored_by}</strong>
                                                    </Link>
                                                ) : (
                                                    <strong>{selectedPost.sponsored_by}</strong>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className={`col-12 col-md-2 ${styles.social_links}`}>
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
                                                        <MDXRemote compiledSource={serializedMarkdown?.compiledSource as string} scope={serializedMarkdown?.scope} frontmatter={serializedMarkdown?.frontmatter} components={{ YouTubeEmbed }} />
                                                    </MDXProvider>
                                                </Suspense>
                                            ) : (
                                                <LoadingSkeleton />
                                            )}
                                        </article>
                                        {!loading && selectedPost?.tags && selectedPost.tags.length > 0 && (
                                            <div className="mt-4 mb-2 d-flex flex-wrap gap-2">
                                                {selectedPost.tags.map((tag, index) => (
                                                    <Link 
                                                        key={index} 
                                                        href={`/tag/${tag.tag}`} 
                                                        className="badge text-bg-light border px-3 py-2 text-decoration-none text-dark"
                                                        style={{ borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500 }}
                                                    >
                                                        {tag.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {author && (
                            <div className="container-fluid about-me py-5 mt-5 px-0">
                                <div className="container row">
                                    <div id="mobileAboutMeTop">
                                        <div className="col-2 col-md-2 col-lg-1 about-me-image-container" id="mobileImageContainer">
                                            <Image className="img-fluid about-me-image" src={author.avatar_url || '/ui/avatar.png'} alt="pfp" title={author.full_name.split(' ').at(0)} width={290} height={290} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" loading="lazy" />
                                        </div>

                                        <div className="">
                                            <Link href={`/author/${author.handle}`}>
                                                <button className="btn-outlined py-1">Visit</button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="d-none d-md-flex col-2 col-md-2 col-lg-1 about-me-image-container">
                                        <Image className="img-fluid about-me-image" src={author.avatar_url || '/ui/avatar.png'} alt="pfp" title={author.full_name.split(' ').at(0)} width={290} height={290} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" loading="lazy" />
                                    </div>

                                    <div className="col-9 col-md-6 col-lg-7 p-0 mt-md-0">
                                        <div className="d-none d-md-flex" id="about-me-info">
                                            <div>
                                                <Link className="a-link a-button" href={`/author/${author.handle}`}>
                                                    <h1 className="subheading-smaller m-0">Written by {author.full_name}</h1>
                                                </Link>
                                            </div>

                                            <div className="d-none d-sm-block">
                                                <Link href={`/author/${author.handle}`}>
                                                    <button className="btn-outlined py-1">Visit</button>
                                                </Link>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="d-block d-md-none mt-2">
                                                <Link className="a-link a-button" href={`/author/${author.handle}`}>
                                                    <h1 className="subheading-smaller m-0">Written by {author.full_name}</h1>
                                                </Link>
                                            </div>
                                            <p className="col-10 subheading-xsmall about-me-bio pt-2 pt-md-0 p-md-0 m-0" id="col-heading-1">
                                                {author.bio}
                                            </p>
                                        </div>
                                        {/* <p className="subheading-small pt-4" id="col-heading-1">
                                            You can find me on these social media:
                                        </p>
                                        <ul className={styles.socialMediaLinks}>
                                            {Object.entries(author.social_links).map(([platform, url]) => {
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
                            <div className="container-fluid read-further mb-5 py-3 px-0">
                                <div className="container d-flex row align-items-center justify-content-center p-0">
                                    <div className="col-md-8 pt-2 pb-3 px-2">
                                        <h2 className="heading" id="col-heading-2">
                                            Further Reading
                                        </h2>
                                    </div>
                                    <div className="col-md-8 p-0 m-0">
                                        {popularPosts
                                            .filter(post => post.slug !== selectedPost.slug)
                                            .sort(() => Math.random() - 0.5)
                                            .slice(0, POPULAR_POSTS_LIMIT)
                                            .map((post, index) => (
                                                <Link href={`/${post.slug}`} className="col-md-9" key={index}>
                                                    <div className="read-further-button">
                                                        <h5 id="col-heading-1">
                                                            {post.post_type}: {post.title}
                                                        </h5>
                                                    </div>
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </>
            </div>
        </>
    );
};

export default ArticleModal;
