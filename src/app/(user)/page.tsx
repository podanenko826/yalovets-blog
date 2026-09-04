import * as React from 'react';
import '@/app/page.css';

import Image from 'next/image';
import Link from 'next/link';
import PostList from '@/components/PostCard/PostList';
import { Suspense } from 'react';
import { getPopularPosts, getSortedPosts } from '@/lib/posts';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import PostCardSkeleton from '@/components/PostCard/PostCardSkeleton';
import SubscribeButton from '@/components/SubscribeButton';

// async function generateMetadata(
//     { params, searchParams }: { params: { slug: string }, searchParams?: Record<string, string> }
//   ): Promise<Metadata> {

//     const post = await getPost(params.slug);

//     return {
//         title: post?.title || 'Yalovets Blog',
//         description: post?.description || 'AWS Unveiled: Your Gateway to Cloud Knowledge',
//         openGraph: {
//             title: post?.title || 'Yalovets Blog',
//             description: post?.description || 'AWS Unveiled: Your Gateway to Cloud Knowledge',
//             images: post?.image_url ? [{ url: post.image_url }] : [],
//             url: `https://yalovets.blog/${post?.slug}`,
//             type: 'article',
//         },
//         twitter: {
//             card: 'summary_large_image',
//             title: post?.title || 'Yalovets Blog',
//             description: post?.description || 'AWS Unveiled: Your Gateway to Cloud Knowledge',
//             images: post?.image_url ? [post.image_url] : [],
//         },
//     };
// }

async function RecentPostsList({ limit }: { limit: number }) {
    const recentPosts = await getSortedPosts(limit);

    return <PostList displayMode="recent" style="standard" indexIncrement={2} limit={limit} postsData={recentPosts.posts} />
}

async function PopularPostsList({ limit }: { limit: number }) {
    const popularPosts = await getPopularPosts(limit);

    return <PostList displayMode="popular" style="standard" indexIncrement={15} limit={limit} postsData={popularPosts} />
}

export default async function Home() {

    const POSTS_PER_PAGE = 9;

    const codeBlock = `
  # Ensure you have AWS CLI configured
  aws configure

  # Retrieve the public IP of your EC2 instance
  export EC2_IP=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=MyInstance" --query "Reservations[*].Instances[*].PublicIpAddress" --output text)

  # Connect to the instance using SSH
  ssh -i my-key.pem ec2-user@$EC2_IP
    `;

    return (
        <>
            <main id="body">
                {/* Welcome section (Mobile) */}
                {/* <div className="container welcome-xs d-block d-lg-none">
                    <div className="row">
                        <div className="col-12 container p-3">
                            <div className="d-flex gap-2">
                                <h2 className="welcome-text-cursor">&gt;</h2>
                                <h2 className="welcome-text" id="col-heading-2">
                                    Welcome to Yalovets Blog
                                </h2>
                            </div>
                            <h1 className="welcome-heading" id="col-heading-1">
                                AWS Unveiled: Your Gateway to Cloud Knowledge
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="container-fluid welcome-xs d-block d-lg-none p-0 overflow-hidden">
                    <div className="row">
                        <div className="col-11 offset-1 col-sm-10 offset-sm-2 col-md-12 offset-md-6">
                            <picture className="img-fluid teaser-img">
                                <Image className="img-fluid teaser-img" src={'/ui/coffeman.jpg'} style={{ width: 'auto' }} alt="Teaser" title="Teaser" width={635} height={476} priority={true} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" />
                            </picture>
                        </div>
                    </div>
                </div> */}

                {/* <div className="arrow-container">
                    <div className="arrow-down"></div>
                </div> */}

                {/* Welcome section (Desktop) */}

                <div className="welcome container-fluid d-block">
                    <div className="row container-fluid gx-0 px-0">
                        <div className="offset-8 offset-sm-7 col-6 col-sm-5 col-md-4 col-lg-6 offset-lg-7">
                            <picture className="img-fluid teaser-img">
                                <Image className="img-fluid teaser-img"
                                    src={'/ui/coffeman.jpg'}
                                    style={{ width: '50vw', maxHeight: '70vh' }}
                                    alt="Teaser"
                                    width={1080}
                                    height={1350}
                                    priority={true}
                                    sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" />
                            </picture>
                        </div>
                    </div>
                    <div>
                        <div className="container">
                            <div className="row">
                                <div className="col-8 col-sm-7 col-lg-5">
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

                        {/* Mobile Mac window */}

                        <div className="d-none d-md-block d-lg-none container">
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

                        {/* Desktop Mac window */}

                        <div className="d-none d-lg-block container-lg">
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
                        <Suspense fallback={Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
                            <PostCardSkeleton key={index} />
                        ))}>
                            <RecentPostsList limit={POSTS_PER_PAGE} />
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
                        <Suspense fallback={Array.from({ length: 3 }).map((_, index) => (
                            <PostCardSkeleton key={index} />
                        ))}>
                            <PopularPostsList limit={3} />
                        </Suspense>
                    </div>
                </div>

                <div className="container-fluid about-me py-5 mt-5">
                    <div className="container d-flex gap-4 row align-items-center justify-content-center mx-auto">
                        <div className="col-7 col-md-4 col-lg-3">
                            <Image className="img-fluid ivan-yalovets"
                                src="/ui/denis.jpg"
                                alt="Denis"
                                title="Denis Podanenko"
                                width={290}
                                height={290}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                loading="lazy" />
                        </div>
                        <div className="col-9 mt-3 mt-md-0 col-md-5 col-lg-5 offset-md-1">
                            <p className="pt-2 subheading-small" id="col-heading-1">
                                <span className="subheading" id="col-heading-1">
                                    Hi, I&rsquo;m Ivan Yalovets! <br /><br />
                                </span>
                                I started Yalovets Blog in 2025 to share the latest tools and insights on web services. My goal is to provide valuable, up-to-date content for web professionals and enthusiasts alike.
                            </p>
                            <div className="mt-4">
                                <p className="subheading-small mb-3">
                                    To support my work, please subscribe to the newsletter and share it with your friends or colleagues.
                                </p>
                                <SubscribeButton />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};
