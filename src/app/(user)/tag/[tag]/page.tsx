'use client';
import React, { useEffect, useState } from 'react';

import { getSortedPosts } from '@/lib/posts';
import { getAuthors } from '@/lib/authors';
import { AuthorItem, PostItem, TagItem } from '@/types';
import dynamic from 'next/dynamic';

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import Link from 'next/link';
import { usePostContext } from '@/components/PostContext';
import moment from 'moment';
import { getTagData, getTagsData } from '@/lib/tags';
import { get } from 'http';
import { notFound } from 'next/navigation';

const LazyPostCard = dynamic(() => import('@/components/LazyPostCard'), { ssr: false });

export default function TagPage({ params }: { params: { tag: string } }) {
    const { posts, setPosts } = usePostContext();
    const { authors, setAuthors } = usePostContext();
    const { tags, setTags } = usePostContext();

    const [postsData, setPostsData] = useState<PostItem[]>([]);
    const [authorData, setAuthorData] = useState<AuthorItem[]>([]);
    const [tagData, setTagData] = useState<TagItem | null>(null);

    useEffect(() => {
        document.title = `#${params.tag} / Yalovets Blog`;
    }, [document.URL]);

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

                    if (posts.length === 0) {
                        setPosts(sorted);
                    }
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

                const tagPosts = sorted.filter(post => post.tags?.toString().includes(params.tag));
                console.log(tagPosts);
                console.log(sorted);

                setPostsData(tagPosts);
            } catch (error) {
                console.error('Error in getData:', error);
            }
        };

        getData();
    }, [posts, setPosts]);

    useEffect(() => {
        const getTag = async () => {
            let _tagData;

            const targetTag = tags.find(tag => tag.tag === params.tag);

            if (targetTag) {
                _tagData = { content: targetTag };
            } else {
                _tagData = await getTagData(params.tag);

                if (_tagData) {
                    setTags([...tags, _tagData.content]);
                }
            }

            if (!_tagData) return notFound();

            setTagData(_tagData.content);
        };

        getTag();
    }, [params.tag]);

    useEffect(() => {
        const getAuthorsData = async () => {
            if (authors.length > 0 && authorData.length === 0) {
                const authorData = [...authors];
                setAuthorData(authorData);
            } else if (authors.length === 0 && authorData.length === 0) {
                const authorData = await getAuthors();
                setAuthorData(authorData);
                setAuthors(authorData);
            }
        };

        getAuthorsData();
    }, [authorData, authors, setAuthors]);

    // //? Fulfills tags data when the first post is loaded
    // useEffect(() => {
    //     const getTags = async () => {
    //         if (selectedPost && tags.length === 0) {
    //             const _tags = await getTagsData();

    //             if (_tags.length > 0) setTags(_tags);
    //         }
    //     };

    //     getTags();
    // }, [selectedPost, tags]);

    return (
        <>
            {tagData && (
                <main id="body">
                    <div className="container posts" id="posts">
                        <h1 className="heading heading-large mt-5">
                            #{tagData?.tag} | {tagData.title}
                        </h1>
                        <p className="subheading-smaller py-3" id="col-heading-2">
                            {tagData.description}
                        </p>

                        <div className="row post-list">
                            {postsData.map((post, index) => {
                                const author = authorData.find(author => author.email === post.email);

                                return <LazyPostCard key={index} post={post} authorData={author as AuthorItem} style="standard" index={index} />;
                            })}
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}
