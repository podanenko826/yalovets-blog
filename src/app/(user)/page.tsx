'use client';
import * as React from 'react';
import '@/app/page.css';

import type { PostItem } from '@/types';

import StartReadingButton from '@/components/Button/StartReadingButton';

import Image from 'next/image';
import PostList from '@/components/PostCard/PostList';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Metadata } from 'next';
import { notFound, usePathname } from 'next/navigation';
import { usePostStore } from '@/components/posts/store';
import { useAuthorStore } from '@/components/authors/store';
import LoadingBanner from '@/components/Modals/LoadingBanner';
import { uploadImage } from '@/lib/images';
import { run } from '@/services/sendEmail';
import { getSubscriberByEmail, getSubscribers, getSubscribersByStatus } from '@/lib/subscribers';
import { UpdateEmailTemplate } from '@/services/updateEmailTemplate';

const NavBar = lazy(() => import('@/components/NavBar'));
const Footer = lazy(() => import('@/components/Footer'));

const PostPreviewModal = lazy(() => import('@/components/Modals/PostPreviewModal'));
const ArticleModal = lazy(() => import('@/components/Modals/ArticleModal'));

interface HomeProps {
    slug?: string; // Optional slug prop
}

async function generateMetadata(post: PostItem): Promise<Metadata> {
    return {
        title: post?.title || 'Yalovets Blog',
        description: post?.description || 'AWS Unveiled: Your Gateway to Cloud Knowledge',
        openGraph: {
            title: post?.title || 'Yalovets Blog',
            description: post?.description || 'AWS Unveiled: Your Gateway to Cloud Knowledge',
            images: post?.imageUrl ? [{ url: post.imageUrl }] : [],
            url: `https://yalovets.blog/${post?.slug}`,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: post?.title || 'Yalovets Blog',
            description: post?.description || 'AWS Unveiled: Your Gateway to Cloud Knowledge',
            images: post?.imageUrl ? [post.imageUrl] : [],
        },
    };
}

const Home: React.FC<HomeProps> = ({ slug }) => {
    const { selectedPost } = usePostStore();

    const { posts, fetchPosts, lastKey, loadPostsFromStorage } = usePostStore()
    const { authors, fetchAuthors } = useAuthorStore();

    const currentPath = usePathname();

    slug = currentPath.split('/').pop();

    useEffect(() => {
        loadPostsFromStorage();
    }, []);

    useEffect(() => {
        if (!selectedPost && typeof document !== 'undefined') {
            document.title = 'Home / Yalovets Blog';
        } else if (selectedPost) {
            generateMetadata(selectedPost);
        }
    }, [selectedPost]);


    // const [isVisible, setIsVisible] = useState<boolean>(false);

    // useEffect(() => {
    //     const targetElement = document.querySelector(`arrow-container`);
    //     if (!targetElement) return;

    //     const observer = new IntersectionObserver(
    //         ([entry]) => {
    //             setIsVisible(entry.isIntersecting);
    //         },
    //         { threshold: 0.5 }
    //     );

    //     observer.observe(targetElement);
    //     return () => observer.disconnect();
    // }, []);

    const codeBlock = `
  # Ensure you have AWS CLI configured
  aws configure

  # Retrieve the public IP of your EC2 instance
  export EC2_IP=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=MyInstance" --query "Reservations[*].Instances[*].PublicIpAddress" --output text)

  # Connect to the instance using SSH
  ssh -i my-key.pem ec2-user@$EC2_IP
    `;
    const [showModal, setShowModal] = useState(!!slug);

    useEffect(() => {
        if (!slug) {
            setTimeout(() => setShowModal(true), 500);
        }
    }, [slug]);

    useEffect(() => {
        fetchPosts(9);
    }, [fetchPosts]);

    useEffect(() => {
        if (authors.length === 0) {
            fetchAuthors();

        }
    }, [fetchAuthors]);

    async function sendTestEmail() {
        await run(posts[6]);
    }

    async function getSubsByStatus() {
        const subs = await getSubscribersByStatus('subscribed');

        console.log(subs);
        
    }

    async function getSubs() {
        const subs = await getSubscribers();

        console.log(subs)
    }

    async function getSubByEmail() {
        const sub = await getSubscriberByEmail('Yalovechik2012@gmail.com');

        console.log(sub)
    }

    if (posts.length === 0) return <LoadingBanner />

    return (
        <>
            <NavBar />
            <button onClick={sendTestEmail}>Send a test email</button>
            <button onClick={async () => await UpdateEmailTemplate()}>Update email template</button>
            <button onClick={getSubsByStatus}>Get subs by status</button>
            <button onClick={getSubByEmail}>Get sub by email</button>
            <button onClick={getSubs}>Get subs</button>
            {showModal && <PostPreviewModal />}
            {showModal && <ArticleModal slug={slug || ''} />}
            <main id="body">
                {/* Welcome section (Mobile) */}
                <div className="container welcome-xs d-block d-lg-none">
                    <div className="row">
                        <div className="col-12 container p-3">
                            <h2 className="welcome-text" id="col-heading-2">
                                Welcome to Yalovets Blog
                            </h2>
                            <h1 className="welcome-heading heading heading-large" id="col-heading-1">
                                AWS Unveiled: Your Gateway to Cloud Knowledge
                            </h1>
                            <p className="welcome-paragraph">By Ivan Yalovets. Since 2024, I published 0 articles.</p>
                            <StartReadingButton />
                        </div>
                    </div>
                </div>

                <div className="container-fluid welcome-xs d-block d-lg-none p-0 overflow-hidden">
                    <div className="row">
                        <div className="col-11 offset-1 col-sm-10 offset-sm-2 col-md-7 offset-md-5">
                            <picture className="img-fluid teaser-img">
                                <Image className="img-fluid teaser-img" src={'/ui/coffeman.jpg'} style={{ width: 'auto' }} alt="Teaser" title="Teaser" width={635} height={476} priority={true} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" />
                            </picture>
                        </div>
                    </div>
                </div>

                {/* <div className="arrow-container">
                    <div className="arrow-down"></div>
                </div> */}

                {/* Welcome section (Desktop) */}

                <div className="welcome container-fluid d-none d-lg-block overflow-hidden">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-7">
                            <picture className="img-fluid teaser-img">
                                <Image className="img-fluid teaser-img" src={'/ui/coffeman.jpg'} style={{ width: '50vw', maxHeight: '70vh' }} alt="Teaser" width={1080} height={1350} loading="lazy" sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" />
                            </picture>
                        </div>
                    </div>
                    <div>
                        <div className="container">
                            <div className="row">
                                <div className="col-5">
                                    <div className="d-flex gap-3">
                                        <h2 className="welcome-text-cursor">&gt;</h2>
                                        <h2 className="welcome-text" id="col-heading-2">
                                            Welcome to Yalovets Blog
                                        </h2>
                                    </div>
                                    <h1 className="welcome-heading" id="col-heading-1">
                                        AWS Unveiled: Your Gateway to Cloud Knowledge
                                    </h1>
                                    {/* <p className="welcome-paragraph">By Ivan Yalovets. Since 2024, I published 0 articles.</p> */}
                                    {/* <StartReadingButton /> */}
                                </div>
                            </div>
                        </div>
                        <div className="container-lg col-12">
                            <div className="mac-window">
                                <div className="mac-title-bar">
                                    <div className="mac-buttons">
                                        <div className="mac-button close"></div>
                                        <div className="mac-button minimize"></div>
                                        <div className="mac-button maximize"></div>
                                    </div>
                                    <div className="mac-title">ReadMe.txt</div>
                                </div>
                                <div className="mac-content">
                                    <pre>
                                        <code>{codeBlock}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent posts */}
                <div className="container posts" id="recentPosts">
                    <div className="row">
                        <div className="col-12 category-heading">
                            <h4 className="subheading-smaller">Recent posts</h4>
                            <div className="horisontal-line" />
                            <h6 className="subheading-small" id="col-heading-1">
                                Subscribe to keep in touch with latest information in tech industry
                            </h6>
                        </div>
                    </div>

                    <div className="row post-list">
                        <Suspense fallback={<div></div>}>
                            <PostList displayMode="recent" style="standard" indexIncrement={2} limit={9} />
                        </Suspense>
                    </div>
                </div>

                {/* Most popular posts */}

                <div className="container posts" id="popularPosts">
                    <div className="row pt-5">
                        <div className="col-12 category-link">
                            <h4 className="subheading-smaller" id="btn-text col-secondary">
                                Popular posts
                            </h4>
                            <div className="horisontal-line" />
                            <h6 className="subheading-small" id="col-heading-1">
                                Those posts are most beloved ones by our subscribers
                            </h6>
                        </div>
                    </div>

                    <div className="row post-list">
                        <PostList displayMode="popular" style="standard" indexIncrement={15} limit={3} />
                    </div>
                </div>

                <div className="container-fluid about-me py-5 mt-5">
                    <div className="container d-flex row align-items-center justify-content-center">
                        <div className="col-7 col-md-4 col-lg-3">
                            <div className="pb-3">
                                <h1 className="subheading" id="col-heading-1">
                                    Hi, I&rsquo;m Ivan Yalovets!
                                </h1>
                            </div>
                            <Image className="img-fluid ivan-yalovets" src="/pfp/ivan-pfp.webp" alt="Ivan" title="Ivan Yalovets" width={290} height={290} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" loading="lazy" />
                        </div>
                        <div className="col-10 mt-3 mt-md-0 col-md-5 col-lg-5 offset-md-1">
                            <p className="pt-2 subheading-small" id="col-heading-1">
                                I started Yalovets Blog in 2024 to share the latest tools and insights on web services. My goal is to provide valuable, up-to-date content for web professionals and enthusiasts alike.
                            </p>
                            <p className="subheading-small">
                                To support my work, please{' '}
                                <a className="subheading-small" id="link-dark" href="#">
                                    subscribe
                                </a>{' '}
                                to the newsletter and share it with your friends or colleagues.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Home;
