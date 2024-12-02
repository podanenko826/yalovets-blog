'use client';
import React, { useEffect } from 'react';
import { usePostContext } from './PostContext';
import { AuthorItem, PostItem } from '@/types';
import LazyPostCard from './LazyPostCard';

interface PostListProps {
    initialPosts: PostItem[];
    initialAuthors: AuthorItem[];
    style: 'massive' | 'full' | 'preview' | 'admin' | 'standard';
}

const PostList: React.FC<PostListProps> = ({ initialPosts, initialAuthors, style }) => {
    const { posts, setPosts } = usePostContext();
    const { authors, setAuthors } = usePostContext();

    console.log(initialAuthors);

    useEffect(() => {
        setPosts(initialPosts); // Populate context with initial data
    }, [initialPosts, setPosts]);

    useEffect(() => {
        setAuthors(initialAuthors); // Populate context with initial data
    }, [initialAuthors, setAuthors]);

    return (
        <>
            {initialPosts.map((post, index) => (
                <LazyPostCard post={post} authorData={authors.find(author => author.email === post.email) as AuthorItem} key={post.slug} index={index} style={style} />
            ))}
        </>
    );
};

export default PostList;
