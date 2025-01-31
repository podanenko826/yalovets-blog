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
import moment from 'moment';

const LazyPostCard = dynamic(() => import('@/components/LazyPostCard'));
interface AuthorPageProps {
    params: { authorKey: string };
    // mdxSource: MDXRemoteProps | MDXRemoteSerializeResult | null;
}

const AuthorPage: FC<AuthorPageProps> = ({ params }: AuthorPageProps) => {
    const { authorKey } = params;

    const { posts, setPosts } = usePostContext();
    const { authors, setAuthors } = usePostContext();
    const { selectedPost } = usePostContext();

    const [authorData, setAuthorData] = useState<AuthorItem | null>(null);
    const [authorPosts, setAuthorPosts] = useState<PostItem[]>([]);
    
    useEffect(() => {
        if (authors.length > 0 && !authorData) {
            setAuthorData(authors.find(author => author.authorKey === authorKey) as AuthorItem);
        }
    }, [authors, authorData]);

    useEffect(() => {
        if (authorData) {
            document.title = `${authorData?.fullName} / Yalovets Blog`;
        } else {
            document.title = `Author / Yalovets Blog`;
        }
    }, [document.URL, authorData]);

    useEffect(() => {
        if (posts.length > 0 && authorData) {
            const authorPosts = posts
                .map(post => {
                    if (post.email === authorData?.email) return post;
                })
                .filter(Boolean);

            setAuthorPosts(authorPosts as PostItem[]);
        }
    }, [posts, authorData]);

    // useEffect(() => {
    //     const getData = async () => {
    //         try {
    //             let sorted: PostItem[] | null = null;
    //             if (posts.length > 0) {
    //                 const postContextData = [...posts];

    //                 //? Sort posts gotten from usePostContext
    //                 sorted = postContextData.sort((a, b) => {
    //                     const format = 'DD-MM-YYYY';
    //                     const dateOne = moment(a.date, format);
    //                     const dateTwo = moment(b.date, format);

    //                     return dateTwo.diff(dateOne); // Descending order
    //                 });
    //             } else {
    //                 sorted = await getSortedPosts();

    //                 if (sorted.length > 0) {
    //                     setPosts(sorted);
    //                 } else {
    //                     return notFound();
    //                 }
    //             }

    //             if (!Array.isArray(sorted)) {
    //                 console.error('Error: Sorted posts is not an array:', sorted);
    //                 return;
    //             }
    //             // Ensure all posts have the expected structure
    //             sorted.forEach((post, index) => {
    //                 if (typeof post !== 'object' || post === null) {
    //                     console.error(`Post at index ${index} is invalid:`, post);
    //                 }
    //             });

    //             if (!author) {
    //                 author = await getAuthorByKey(authorKey);
    //             }

    //             const authorPosts = sorted
    //                 .map(post => {
    //                     if (post.email === author?.email) return post;
    //                 })
    //                 .filter(Boolean) as PostItem[];

    //             if (authorPosts.length > 0) {
    //                 setPostsData(authorPosts);
    //             } else {
    //                 return notFound();
    //             }
    //         } catch (error) {
    //             console.error('Error in getData:', error);
    //         }
    //     };

    //     getData();
    // }, [posts, setPosts, author, authors]);

    return (
        <>
            {authorData && authorPosts.length > 0 && (
                <div className="container">
                    <div className="container mb-5">
                        <div className={`${postCardStyles.profile_info} d-flex justify-content-center mt-4`}>
                            <Image className={`${postCardStyles.pfp}`} src={`/${authorData.profileImageUrl}`} alt="pfp" width={42.5} height={42.5} />
                            <h2 className="p-2 m-0">{authorData!.fullName}</h2>
                        </div>
                        <div className="my-4 d-flex justify-content-center">
                            <h5 className="m-0 p-0 col-9 subheading-small text-center">{authorData.bio}</h5>
                        </div>
                    </div>

                    <div className="container posts" id="posts">
                        <div className="row post-list">
                            <div className="d-flex justify-content-center p-0 m-0 mt-5">
                                <h3>
                                    {authorData.fullName}
                                    {authorData.fullName.at(-1)?.toLowerCase() === 's' ? "'" : "'s"} posts
                                </h3>
                            </div>
                            {authorPosts.map((post, index) => (
                                <LazyPostCard post={post as PostItem} authorData={authorData} style="standard" index={index} key={index} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AuthorPage;
