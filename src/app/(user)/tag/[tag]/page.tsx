'use client';
import React, { useEffect, useState } from 'react';

import { getSortedPosts } from '@/lib/posts';
import { getAuthors } from '@/lib/authors';
import { AuthorItem, PostItem, TagItem } from '@/types';
import dynamic from 'next/dynamic';

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import Link from 'next/link';
import { usePostContext } from '@/components/Context/PostDataContext';
import { useModalContext } from '@/components/Context/ModalContext';
import moment from 'moment';
import { getTagData, getTagsData } from '@/lib/tags';
import { get } from 'http';
// import { notFound } from 'next/navigation';
import PostList from '@/components/PostCard/PostList';

const LazyPostCard = dynamic(() => import('@/components/PostCard/LazyPostCard'), { ssr: false });

export default function TagPage({ params }: { params: { tag: string } }) {
    const { posts, setPosts } = usePostContext();
    const { authors, setAuthors } = usePostContext();
    const { tags, setTags } = usePostContext();
    const { selectedPost } = useModalContext();
    const { fetchPosts } = usePostContext();

    const [tagData, setTagData] = useState<TagItem | null>(null);

    const ARTICLES_PER_PAGE = 28;

    useEffect(() => {
        if (!selectedPost && typeof document !== "undefined") {
            document.title = `#${params.tag} / Yalovets Blog`;
        }
    }, [selectedPost]);

    useEffect(() => {
        if (ARTICLES_PER_PAGE) {
            fetchPosts(ARTICLES_PER_PAGE); 
        }
    }, [ARTICLES_PER_PAGE])

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

            // if (!_tagData) return notFound();

            setTagData(_tagData.content);
        };

        getTag();
    }, [params.tag]);

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
                            <PostList displayMode='linear' limit={28} style='full' postsData={posts} infiniteScroll />
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}
