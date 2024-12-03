'use client';
import * as React from 'react';
import '@/app/page.css';

import type { AuthorItem, PostItem } from '@/types';

import StartReadingButton from '@/components/Button/StartReadingButton';

// import {MdOutlineArrowForwardIos} from 'react-icons/md';
// import {getUsers} from '@/lib/users';
import { getMDXContent, getSortedPosts } from '@/lib/posts';
import { getAuthors } from '@/lib/authors';
import Image from 'next/image';
import LazyPostCard from '@/components/LazyPostCard';
import PostList from '@/components/PostList';
import { PostProvider, usePostContext } from '@/components/PostContext';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { usePathname, useRouter } from 'next/navigation';

interface HomeProps {
    slug?: string; // Optional slug prop
}

const Home: React.FC<HomeProps> = ({ slug }) => {
    const [sortedPosts, setSortedPosts] = useState<PostItem[]>([]);
    const [recentPosts, setRecentPosts] = useState<PostItem[]>([]);
    const [latestPost, setLatestPost] = useState<PostItem | null>(null);
    const [popularPosts, setPopularPosts] = useState<PostItem[]>([]);

    const [authorData, setAuthorData] = useState<AuthorItem[]>([]);

    const { posts, setPosts } = usePostContext();
    const { authors, setAuthors } = usePostContext();
    const { selectedPost } = usePostContext();
    const { openModal } = usePostContext();

    const currentPath = usePathname();

    useEffect(() => {
        setPosts(sortedPosts); // Populate context with initial data
    }, [sortedPosts, setPosts]);

    useEffect(() => {
        setAuthors(authorData); // Populate context with initial data
    }, [authorData, setAuthors]);

    useEffect(() => {
        if (selectedPost) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [selectedPost]);

    useEffect(() => {
        const getData = async () => {
            try {
                let sorted: PostItem[] | null = null;
                if (posts.length > 0) {
                    const postContextData = [...posts];

                    //? Sort posts gotten from usePostContext
                    sorted = postContextData.sort((a, b) => {
                        const format = 'DD-MM-YYYY';
                        const dateOne = moment(a.date, format);
                        const dateTwo = moment(b.date, format);

                        return dateTwo.diff(dateOne); // Descending order
                    });
                } else {
                    sorted = await getSortedPosts();
                }

                if (!Array.isArray(sorted)) {
                    console.error('Error: Sorted posts is not an array:', sorted);
                    return;
                }

                // Ensure all posts have the expected structure
                sorted.forEach((post, index) => {
                    if (typeof post !== 'object' || post === null) {
                        console.error(`Post at index ${index} is invalid:`, post);
                    }
                });

                const recent = sorted.slice(0, 9);
                const latest = sorted[0] || null;

                const mostViewed = sorted
                    .sort((a, b) => (b.viewsCount ?? 0) - (a.viewsCount ?? 0)) // Sort by viewsCount in descending order
                    .slice(0, 3);
                console.log(mostViewed);

                if (slug) {
                    const post = sorted.find(post => post.slug === slug) as PostItem;
                    const MdxContent = await getMDXContent(slug);
                    const markdown = MdxContent.markdown;
                    const previousPath = window.location.href;

                    if (post && markdown) {
                        openModal(post, markdown, previousPath);
                    }
                    slug = '';
                }

                setSortedPosts(sorted);
                setRecentPosts(recent);
                setLatestPost(latest);
                setPopularPosts(mostViewed);
            } catch (error) {
                console.error('Error in getData:', error);
            }
        };

        getData();
    }, []);

    useEffect(() => {
        const getAuthorsData = async () => {
            if (authors.length > 0 && authorData.length === 0) {
                const authorData = [...authors];
                setAuthorData(authorData);
            } else if (authors.length === 0 && authorData.length === 0) {
                const authorData = await getAuthors();
                setAuthorData(authorData);
            }
        };

        getAuthorsData();
    }, [authorData]);

    return (
        <>
            {recentPosts && latestPost && popularPosts && authorData ? (
                <main id="body">
                    {/* Welcome section (Mobile) */}
                    <div className="container welcome-xs d-block d-lg-none">
                        <div className="row">
                            <div className="col-12 container p-3">
                                <h2 className="welcome-text" id="col-heading-2">
                                    Welcome to Yalovets Blog
                                </h2>
                                <h1 className="welcome-heading heading-large" id="col-heading-1">
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
                                        <p className="welcome-paragraph">By Ivan Yalovets. Since 2024, I published 0 articles.</p>
                                        <StartReadingButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latest post section */}
                    <div className="container-fluid posts p-0" id="posts">
                        <LazyPostCard post={latestPost} authorData={authorData.find(author => author.email === latestPost?.email) as AuthorItem} style="massive" />
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
                                <h6 className="subheading-tiny" id="col-heading-1">
                                    Subscribe to keep in touch with latest information in tech industry
                                </h6>
                            </div>
                        </div>

                        <div className="row post-list">
                            <PostList initialPosts={recentPosts} initialAuthors={authorData} style="standard" indexIncrement={1} />
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
                                <h6 className="subheading-tiny" id="col-heading-1">
                                    Those posts are most beloved ones by our subscribers
                                </h6>
                            </div>
                        </div>

                        <div className="row post-list">
                            <PostList initialPosts={popularPosts} initialAuthors={authorData} style="standard" indexIncrement={10} />
                        </div>
                    </div>
                    <div className="container-fluid about-me py-5 mt-5">
                        <div className="container d-flex row align-items-center">
                            <div className="d-flex col-sm-10 offset-md-1 col-md-5">
                                <Image className="img-fluid ivan-yalovets" src="/img/ivan-pfp.png" alt="Teaser" title="Teaser" width={290} height={290} sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" loading="lazy" />
                            </div>
                            <div className="col-7 col-md-5 col-lg-5 offset-md-1 offset-lg-0">
                                <h1 id="col-text" className="heading">
                                    Hi, I&rsquo;m Ivan Yalovets!
                                </h1>
                                <p className="pt-2 subheading-smaller" id="col-text">
                                    I started Yalovets Blog in 2024 to share the latest tools and insights on web services. My goal is to provide valuable, up-to-date content for web professionals and enthusiasts alike.
                                </p>
                                <p className="subheading-smaller" id="col-text">
                                    To support my work, please{' '}
                                    <a className="subheading-smaller" id="link-light" href="#">
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
