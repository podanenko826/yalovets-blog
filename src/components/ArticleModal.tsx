'use client';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/components/ArticleModal.module.css';
import NavBar from './NavBar';
import { usePostContext } from './PostContext';
import moment from 'moment';
import Link from 'next/link';
import { FaFacebookF, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaSquareInstagram } from 'react-icons/fa6';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Footer from './Footer';
import { PostItem } from '@/types';
import { getMDXContent, getSortedPosts } from '@/lib/posts';
import { usePathname } from 'next/navigation';
import { getAuthors } from '@/lib/authors';
import { MDXProvider } from '@mdx-js/react';
import { mdSerialize } from '../../mdSerializer';
import { useMDXComponents } from '../../mdx-components';

// Ensure languages are loaded

const ArticleModal: React.FC = () => {
    const { selectedPost, setSelectedPost } = usePostContext();
    const { posts, setPosts } = usePostContext();
    const { authors, setAuthors } = usePostContext();
    const { openModal } = usePostContext();
    const { selectedMarkdown, setSelectedMarkdown } = usePostContext();
    const { closeModal } = usePostContext();
    const [serializedMarkdown, setSerializedMarkdown] = useState<MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>>();

    const components = useMDXComponents();

    console.log(selectedMarkdown);
    const currentPath = usePathname();

    useEffect(() => {
        if (selectedPost) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [selectedPost]);

    useEffect(() => {
        //? Fetches the necessary data for a post to display if the url has slug in it
        const returnToPost = async () => {
            const postUrl = window.location.href;
            const postSlug = postUrl.split('/').at(-1);

            if (!selectedPost && postSlug && posts) {
                const post = posts.find(post => post.slug === postSlug) as PostItem;
                const MdxContent = await getMDXContent(postSlug);
                const markdown = MdxContent.markdown;
                const previousPath = window.location.href;

                if (post && markdown) {
                    openModal(post, markdown, previousPath);
                }
            } else return;
        };
        returnToPost();
    }, [currentPath]);

    useEffect(() => {
        const processMarkdown = async () => {
            if (selectedMarkdown) {
                const result = await mdSerialize(selectedMarkdown);
                console.log(result);

                setSerializedMarkdown(result);
            }
        };

        processMarkdown();
    }, [selectedMarkdown]);
    if (!selectedPost || !selectedMarkdown) return null;

    const author = authors.find(author => author.email === selectedPost.email);
    if (!author) return null;

    return (
        <>
            <div className={styles.articlePage}>
                <NavBar />
                {selectedPost && authors && selectedMarkdown && serializedMarkdown && (
                    <>
                        <section>
                            <div className="mt-5">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="h-min mt-md-2 d-flex justify-content-md-center">
                                                <button onClick={() => closeModal()} className="btn-outlined py-2 px-3">
                                                    ←Back
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-8 text-center">
                                            <h1 className="heading heading-xlarge w-100 col-md-11 col-lg-12 text-center" id="col-heading-1">
                                                {selectedPost.title}
                                            </h1>
                                            <div className="d-flex justify-content-center gap-2">
                                                <p>
                                                    {author.fullName} • {moment(selectedPost.date, 'DD-MM-YYYY').format('D MMM YYYY')}{' '}
                                                </p>
                                                {moment(selectedPost.modifyDate, 'DD-MM-YYYY').isAfter(moment(selectedPost.date, 'DD-MM-YYYY')) && (
                                                    <>
                                                        <p className="d-none d-md-block">•</p>
                                                        <span className="d-none d-md-block px-2 mb-4 rounded-pill text-bg-secondary">{'Updated ' + moment(selectedPost.modifyDate, 'DD-MM-YYYY').fromNow()}</span>
                                                    </>
                                                )}
                                            </div>
                                            {moment(selectedPost.modifyDate, 'DD-MM-YYYY').isAfter(moment(selectedPost.date, 'DD-MM-YYYY')) && (
                                                <span className="d-md-none px-2 mb-4 rounded-pill text-bg-secondary" id="mobileUpdatedBadge">
                                                    {'Updated ' + moment(selectedPost.modifyDate, 'DD-MM-YYYY').fromNow()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-sm-2 social-links">
                                            {author.socialLinks.emailAddress && (
                                                <Link href={author.socialLinks.emailAddress} target="_blank">
                                                    <MdEmail className="fs-1 p-1" />
                                                </Link>
                                            )}
                                            {author.socialLinks.linkedInUrl && (
                                                <Link href={author.socialLinks.linkedInUrl} target="_blank">
                                                    <FaLinkedin className="fs-1 p-1" />
                                                </Link>
                                            )}
                                            {author.socialLinks.instagramUrl && (
                                                <Link href={author.socialLinks.instagramUrl} target="_blank">
                                                    <FaSquareInstagram className="fs-1 p-1" />
                                                </Link>
                                            )}
                                            {author.socialLinks.facebookUrl && (
                                                <Link href={author.socialLinks.facebookUrl} target="_blank">
                                                    <FaFacebookF className="fs-1 p-1" />
                                                </Link>
                                            )}
                                        </div>
                                        <div className="col-12 col-sm-8">
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
                                <div className="container d-flex row align-items-center">
                                    <div className="d-flex col-sm-10 offset-md-1 col-md-5">
                                        <Image className="img-fluid ivan-yalovets" src={`/${author.profileImageUrl}`} alt="pfp" title={author.fullName.split(' ').at(0)} width={290} height={290} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" loading="lazy" />
                                    </div>
                                    <div className="col-7 col-md-5 col-lg-5 offset-md-1 offset-lg-0">
                                        <h1 className="heading">{author.fullName}</h1>
                                        <p className="pt-2 subheading-smaller">{author.bio}</p>
                                        <p className="subheading-smaller">You can find me on these social media:</p>
                                        <ul className={styles.socialMediaLinks}>
                                            <li>
                                                <Link href={author.socialLinks.instagramUrl} className="a-link" target="_blank">
                                                    Instagram
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={author.socialLinks.facebookUrl} className="a-link" target="_blank">
                                                    Facebook
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={author.socialLinks.linkedInUrl} className="a-link" target="_blank">
                                                    LinkedIn
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <Footer />
                    </>
                )}
            </div>
        </>
    );
};

export default ArticleModal;
