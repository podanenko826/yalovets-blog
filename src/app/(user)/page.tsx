import * as React from 'react';
import '@/app/page.css';

import type {AuthorItem, PostItem} from '@/types';

import StartReadingButton from '@/components/Button/StartReadingButton';

// import {MdOutlineArrowForwardIos} from 'react-icons/md';
// import {getUsers} from '@/lib/users';
import {getLatestPost, getPopularPosts, getRecentPosts} from '@/lib/posts';
import {getAuthorEmails, getAuthors} from '@/lib/authors';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import LazyPostCard from '@/components/LazyPostCard';

const PostCard = dynamic(() => import('@/components/PostCard'), {ssr: false});

export default async function Home() {
    const recentPosts: PostItem[] = await getRecentPosts();
    const latestPost: PostItem = await getLatestPost();
    const popularPosts: PostItem[] = await getPopularPosts();

    const authorData: AuthorItem[] = await getAuthors();

    return (
        <main>
            {/* Welcome section (Mobile) */}

            <div className="container welcome-xs d-block d-lg-none">
                <div className="row">
                    <div className="col-12 container p-3">
                        <h2 className="welcome-text" id="col-heading-2">
                            Welcome to Yalovets Blog
                        </h2>
                        <h1
                            className="welcome-heading heading-large"
                            id="col-heading-1">
                            AWS Unveiled: Your Gateway to Cloud Knowledge
                        </h1>
                        <p className="welcome-paragraph">
                            By Ivan Yalovets. Since 2024, I published 0
                            articles.
                        </p>
                        <StartReadingButton />
                    </div>
                </div>
            </div>

            <div className="container-fluid welcome-xs d-block d-lg-none p-0 overflow-hidden">
                <div className="row">
                    <div className="col-11 offset-1 col-sm-10 offset-sm-2 col-md-7 offset-md-5">
                        <picture className="img-fluid teaser-img">
                            <Image
                                className="img-fluid teaser-img"
                                src={'/img/teaser-front@1140w2x.webp'}
                                style={{width: 'auto'}}
                                alt="Teaser"
                                title="Teaser"
                                width={635}
                                height={476}
                                priority={true}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                        </picture>
                    </div>
                </div>
            </div>

            {/* Welcome section (Desktop) */}

            <div className="welcome container-fluid d-none d-lg-block overflow-hidden">
                <div className="row">
                    <div className="col-lg-7 offset-lg-5">
                        <picture className="img-fluid teaser-img">
                            <Image
                                className="img-fluid teaser-img"
                                src={'/img/teaser-front@1140w2x.webp'}
                                style={{width: 'auto'}}
                                alt="Teaser"
                                width={998}
                                height={19}
                                priority={true}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
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
                                <h1
                                    className="welcome-heading"
                                    id="col-heading-1">
                                    AWS Unveiled: Your Gateway to Cloud
                                    Knowledge
                                </h1>
                                <p className="welcome-paragraph">
                                    By Ivan Yalovets. Since 2024, I published 0
                                    articles.
                                </p>
                                <StartReadingButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest post section */}
            <div className="container-fluid posts p-0" id="posts">
                <LazyPostCard
                    post={latestPost}
                    authorData={
                        authorData.find(
                            author => author.email === latestPost.email
                        ) as AuthorItem
                    }
                    style="massive"
                />
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
                            Subscribe to keep in touch with latest information
                            in tech industry
                        </h6>
                    </div>
                </div>

                <div className="row post-list">
                    {recentPosts.map((post, index) => {
                        const author = authorData.find(
                            author => author.email === post.email
                        ) as AuthorItem;
                        return (
                            <LazyPostCard
                                post={post}
                                authorData={author}
                                index={index + 1}
                                key={index + 1}
                                style="standard"
                            />
                        );
                    })}
                </div>
            </div>

            {/* Most popular posts */}

            <div className="container posts" id="posts">
                <div className="row pt-5">
                    <div className="col-12 category-link">
                        <h4
                            className="subheading-smaller"
                            id="btn-text col-secondary">
                            Popular posts
                        </h4>
                        <div className="horisontal-line" />
                        <h6 className="subheading-tiny" id="col-heading-1">
                            Those posts are most beloved ones by our subscribers
                        </h6>
                    </div>
                </div>

                <div className="row post-list">
                    {popularPosts.map((post, index) => (
                        <LazyPostCard
                            post={post}
                            authorData={
                                authorData.find(
                                    author => author.email === post.email
                                ) as AuthorItem
                            }
                            index={index + 10}
                            key={index + 10}
                            style="standard"
                        />
                    ))}
                </div>
            </div>
            <div className="container-fluid about-me py-5 mt-5">
                <div className="container d-flex row align-items-center">
                    <div className="d-flex col-sm-10 offset-md-1 col-md-5">
                        <Image
                            className="img-fluid ivan-yalovets"
                            src="/img/ivan-pfp.png"
                            alt="Teaser"
                            title="Teaser"
                            width={290}
                            height={290}
                            sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            loading="lazy"
                        />
                    </div>
                    <div className="col-7 col-md-5 col-lg-5 offset-md-1 offset-lg-0">
                        <h1 id="col-text" className="heading">
                            Hi, I&rsquo;m Ivan Yalovets!
                        </h1>
                        <p className="pt-2 subheading-smaller" id="col-text">
                            I started Yalovets Blog in 2024 to share the latest
                            tools and insights on web services. My goal is to
                            provide valuable, up-to-date content for web
                            professionals and enthusiasts alike.
                        </p>
                        <p className="subheading-smaller" id="col-text">
                            To support my work, please{' '}
                            <a
                                className="subheading-smaller"
                                id="link-light"
                                href="#">
                                subscribe
                            </a>{' '}
                            to the newsletter and share it with your friends or
                            colleagues.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
