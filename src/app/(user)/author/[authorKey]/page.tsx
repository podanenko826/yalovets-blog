'use client';
import { getAuthorByKey, getAuthors } from '@/lib/authors';
import { AuthorItem, PostItem } from '@/types';
import { notFound } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';

import Image from 'next/image';

import postCardStyles from '@/components/PostCard.module.css';
import { getPost, getSortedPosts } from '@/lib/posts';
import { usePostContext } from '@/components/PostContext';
import dynamic from 'next/dynamic';

const LazyPostCard = dynamic(() => import('@/components/LazyPostCard'));
interface AuthorPageProps {
    params: { authorKey: string };
    // mdxSource: MDXRemoteProps | MDXRemoteSerializeResult | null;
}

const AuthorPage: FC<AuthorPageProps> = ({ params }: AuthorPageProps) => {
    const { authorKey } = params;

    const { posts, setPosts } = usePostContext();
    const { authors, setAuthors } = usePostContext();
    console.log(posts);
    console.log(authors.length);

    let author: AuthorItem | null = null;
    if (authors) {
        author = authors.find(author => author.authorKey === authorKey) as AuthorItem;

        setAuthors(authors);
    }

    const [authorData, setAuthorData] = useState<AuthorItem | null>(null);
    const [postsData, setPostsData] = useState<PostItem[]>([]);

    useEffect(() => {
        if (author) {
            setAuthorData(author);
        }
        if (posts) {
            const authorPosts = posts
                .map(post => {
                    if (post.email === author?.email) return post;
                })
                .filter(Boolean);

            setPostsData(authorPosts as PostItem[]);
        }
    }, []);

    useEffect(() => {
        const getAuthorData = async () => {
            if (!author) {
                const authorData = await getAuthors();
                if (authorData) {
                    setAuthors(authorData);
                }

                const author = authorData.find(author => author.authorKey === authorKey);
                if (!author || !author.email) return notFound();

                setAuthorData(author);
            }
        };
        getAuthorData();
    }, []);

    useEffect(() => {
        const getPostData = async () => {
            if (posts.length === 0) {
                const sortedPosts = await getSortedPosts();
                let author: AuthorItem | null = null;
                if (authors.length > 0) {
                    author = authors.find(author => author.authorKey === authorKey) as AuthorItem;
                } else {
                    author = await getAuthorByKey(authorKey);
                }

                if (sortedPosts.length > 0) {
                    setPosts(sortedPosts);
                } else {
                    return notFound();
                }

                const authorPosts = sortedPosts
                    .map(post => {
                        if (post.email === author?.email) return post;
                    })
                    .filter(Boolean) as PostItem[];

                if (authorPosts.length > 0) {
                    setPostsData(authorPosts);
                } else {
                    return notFound();
                }
            }
        };
        getPostData();
    }, []);

    return (
        <>
            {authorData && postsData.length > 0 && (
                <div className="container">
                    <div className="container mb-5">
                        <div className={`${postCardStyles.profile_info} d-flex justify-content-center mt-4`}>
                            <Image className={`${postCardStyles.pfp}`} src={`/${authorData!.profileImageUrl}`} alt="pfp" width={42.5} height={42.5} />
                            <h2 className="p-2 m-0">{authorData!.fullName}</h2>
                        </div>
                        <div className="my-4 d-flex justify-content-center">
                            <h5 className="m-0 p-0 col-9 subheading-small text-center">{authorData!.bio}</h5>
                        </div>
                    </div>

                    <div className="container posts" id="posts">
                        <div className="row post-list">
                            <div className="d-flex justify-content-center p-0 m-0 mt-5">
                                <h3>
                                    {authorData!.fullName}
                                    {authorData!.fullName.at(-1)?.toLowerCase() === 's' ? "'" : "'s"} posts
                                </h3>
                            </div>
                            {postsData.map((post, index) => (
                                <LazyPostCard post={post as PostItem} authorData={authorData!} style="standard" index={index} key={index} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AuthorPage;
