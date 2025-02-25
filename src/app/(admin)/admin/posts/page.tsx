'use client';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import postCardStyles from '@/components/PostCard/PostCard.module.css';
import Link from 'next/link';
import PostList from '@/components/PostCard/PostList';
import { usePostStore } from '@/components/posts/store';
import { PostItem } from '@/types';

const PostsPage = () => {
    const { posts, fetchPosts } = usePostStore();

    const ARTICLES_PER_PAGE = 14;

    useEffect(() => {
        fetchPosts(ARTICLES_PER_PAGE);
    }, [fetchPosts]);

    return (
        <div>
            <div className="container-fluid posts" id="posts">
                <div>
                    <Link href={'/admin'}>
                        <button className="btn-filled px-3 py-3 mt-4">←Back to console</button>
                    </Link>
                </div>
                <div className="container-lg">
                    <div className="row post-list">
                        <div className="col-md-6 col-lg-4">
                            <div className="col-12">
                                <Link href={'/admin/posts/new'}>
                                    <div className={postCardStyles.image}>
                                        <Image
                                            className={`img-fluid full-image ${postCardStyles.newPostImage}`}
                                            src={'/ui/addpost.png'} // Using the image URL, including the placeholder logic if needed
                                            alt={'Create new post'}
                                            title={'Create new post'}
                                            priority={true} // Ensuring the image is preloaded and prioritized
                                            width={354}
                                            height={180}
                                            sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                        />
                                    </div>

                                    <div className={postCardStyles.postInfo}>
                                        <h2 className={postCardStyles.heading} id="col-heading-1">
                                            Create new post
                                        </h2>
                                        <p className={postCardStyles.description}>Start expressing yourself on latest IT news and insights.</p>
                                    </div>
                                </Link>

                                <div className={`${postCardStyles.profile_info} d-flex mb-5`}>
                                    <div className="align-content-center">
                                        <Image className={`${postCardStyles.pfp} ${postCardStyles.placeholder_pfp} img-fluid`} src={`/ui/placeholder-pfp.png`} alt="pfp" width={42.5} height={42.5} />
                                    </div>

                                    <div
                                        className={`
                                        ${postCardStyles.profile_info__details} gap-2
                                    `}>
                                        <div className={postCardStyles.placeholder_profile_info__text}>
                                            <p className={postCardStyles.dot}></p>

                                            <p className={postCardStyles.underscore}></p>
                                            <p className={postCardStyles.underscore}></p>

                                            <p className={postCardStyles.dot}></p>
                                            <p className={postCardStyles.underscore}></p>
                                            <p className={postCardStyles.dot}></p>
                                            <p className={postCardStyles.underscore}></p>
                                        </div>
                                        <div className={postCardStyles.placeholder_profile_info__text}>
                                            <p className={postCardStyles.underscore}></p>
                                            <p className={postCardStyles.dot}></p> <p className={postCardStyles.dot}></p>
                                            <p className={postCardStyles.underscore}></p>
                                            <p className={postCardStyles.underscore}></p>
                                            <p className={postCardStyles.dot}></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* {postData.posts.map((post, index) => (
                            <div className="col-md-6 col-lg-4" key={index}>
                            <LazyPostCard post={post} authorData={authorData.find(author => author.email === post.email) as AuthorItem} style="admin" index={index} key={index} />
                            </div>
                        ))} */}
                        <PostList postsData={posts} displayMode='admin' style='admin' limit={ARTICLES_PER_PAGE} infiniteScroll />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostsPage;
