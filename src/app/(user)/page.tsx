'use client';
import * as React from 'react';
import '@/app/page.css';

import type { AuthorItem, PostItem } from '@/types';

import StartReadingButton from '@/components/Button/StartReadingButton';

import Image from 'next/image';
import LazyPostCard from '@/components/LazyPostCard';
import PostList from '@/components/PostList';
import { usePostContext } from '@/components/PostContext';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import moment from 'moment';

interface HomeProps {
    slug?: string; // Optional slug prop
}

const Home: React.FC<HomeProps> = ({ slug }) => {
    const currentSlug = useRef<string | undefined>(slug);

    const [sortedPosts, setSortedPosts] = useState<PostItem[]>([]);
    const [recentPosts, setRecentPosts] = useState<PostItem[]>([]);
    const [latestPost, setLatestPost] = useState<PostItem | null>(null);
    const [popularPosts, setPopularPosts] = useState<PostItem[]>([]);

    const [authorData, setAuthorData] = useState<AuthorItem[]>([]);

    const { posts, setPosts } = usePostContext();
    const { lastKey } = usePostContext();
    const { pagination } = usePostContext();
    const { selectedPost } = usePostContext();

    const { fetchPosts } = usePostContext();

    useEffect(() => {
        if (!selectedPost && typeof document !== 'undefined') {
            document.title = 'Home / Yalovets Blog';
        }
    }, [selectedPost]);

    useEffect(() => {
        const fetchData = async () => {
            fetchPosts(9);
        }

        fetchData();
    }, [])
    if (posts.length < 1) return;

    return (
        <>
            {posts ? (
                <main id="body">
                    <button onClick={() => {
                        localStorage.clear();
                        console.log('cache clear');
                        
                    }}>Clear Cache</button>
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
                                <p className="welcome-paragraph">By Ivan Yalovets. Since 2024, I published {sortedPosts.length} articles.</p>
                                <StartReadingButton />
                            </div>
                        </div>
                    </div>

                    <div className="container-fluid welcome-xs d-block d-lg-none p-0 overflow-hidden">
                        <div className="row">
                            <div className="col-11 offset-1 col-sm-10 offset-sm-2 col-md-7 offset-md-5">
                                <picture className="img-fluid teaser-img">
                                    <Image className="img-fluid teaser-img" src={'/img/teaser-front@1140w2x.webp'} style={{ width: 'auto' }} alt="Teaser" title="Teaser" width={635} height={476} priority={true} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" />
                                </picture>
                            </div>
                        </div>
                    </div>

                    {/* Welcome section (Desktop) */}

                    <div className="welcome container-fluid d-none d-lg-block overflow-hidden">
                        <div className="row">
                            <div className="col-lg-7 offset-lg-5">
                                <picture className="img-fluid teaser-img">
                                    <Image className="img-fluid teaser-img" src={'/img/teaser-front@1140w2x.webp'} style={{ width: 'auto' }} alt="Teaser" width={998} height={19} priority={true} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" />
                                </picture>
                            </div>
                        </div>
                        <div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-5">
                                        <h2 className="welcome-text" id="col-heading-2">
                                            Welcome to Yalovets Blog
                                        </h2>
                                        <h1 className="welcome-heading" id="col-heading-1">
                                            AWS Unveiled: Your Gateway to Cloud Knowledge
                                        </h1>
                                        <p className="welcome-paragraph">By Ivan Yalovets. Since 2024, I published {sortedPosts.length} articles.</p>
                                        <StartReadingButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latest post section */}
                    <div className="container-fluid posts p-0" id="posts">
                        <LazyPostCard post={posts[0]} authorData={authorData.find(author => author.email === latestPost?.email) as AuthorItem} style="massive" />
                    </div>

                    {/* Recent posts */}
                    <div className="container posts" id="posts">
                        <div className="row pt-5">
                            <div className="col-12 category-heading">
                                {/* <a
                                    id="col-primary"
                                    className="recent-btn"
                                    href="/page/1">
                                    <h3 id="btn-text">
                                        Recent posts{' '}
                                        <MdOutlineArrowForwardIos className="recent-posts-icon" />
                                    </h3>
                                </a> */}
                                <h4 className="subheading-smaller">Recent posts</h4>
                                <div className="horisontal-line" />
                                <h6 className="subheading-small" id="col-heading-1">
                                    Subscribe to keep in touch with latest information in tech industry
                                </h6>
                            </div>
                        </div>

                        <div className="row post-list">
                            <PostList displayMode='recent' style="standard" indexIncrement={1} limit={9} />
                        </div>
                    </div>

                    {/* Most popular posts */}

                    <div className="container posts" id="posts">
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
                            <PostList displayMode='popular' style="standard" indexIncrement={10} limit={3} />
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
                                <Image className="img-fluid ivan-yalovets" src="/img/ivan-pfp.png" alt="Ivan" title="Ivan Yalovets" width={290} height={290} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" loading="lazy" />
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
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
};

export default Home;
