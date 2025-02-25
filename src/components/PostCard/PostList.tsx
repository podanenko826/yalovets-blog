'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AuthorItem, PostItem } from '@/types';
import LazyPostCard from './LazyPostCard';
import moment from 'moment';
import { usePostStore } from '../posts/store';
import { useAuthorStore } from '../authors/store';
import { usePaginationStore } from '../pagination/store';
import LoadingSkeleton from '../LoadingSkeleton';

interface PostListProps {
    displayMode: 'linear' | 'latest' | 'recent' | 'popular' | 'admin';
    style: 'massive' | 'full' | 'expanded' | 'preview' | 'admin' | 'standard';
    limit: number;  // Add limit as a prop for pagination
    indexIncrement?: number;
    infiniteScroll?: boolean;
    postsData?: PostItem[];
    authorEmail?: string;
}

const PostList: React.FC<PostListProps> = ({ displayMode, style, limit, indexIncrement = 0, infiniteScroll = false, postsData, authorEmail }) => {
    const { posts, fetchPosts, fetchPostsByAuthor } = usePostStore()
    const { authors } = useAuthorStore();
    const { pagination } = usePaginationStore();

    const [loading, setLoading] = useState<boolean>(true);
    const [isAllFetched, setAllFetched] = useState<boolean>(false);

    const POSTS_PER_PAGE = 28;

    const memoizedPosts = useMemo(() => posts.slice(), [posts]);
    const memoizedAuthors = useMemo(() => new Map(authors.map((author) => [author.email, author])), [authors]);

    const recent = useMemo(() => memoizedPosts.slice(0, 9), [memoizedPosts]);

    const latest = useMemo(() => memoizedPosts[0] || null, [memoizedPosts]);
    const mostViewed = useMemo(() => 
        [...memoizedPosts].sort((a, b) => (b.viewsCount ?? 0) - (a.viewsCount ?? 0)).slice(0, 3),
        [memoizedPosts]);

    // Scroll-based pagination or load more trigger
    const loadMorePosts = async () => {
        if (loading) return;
        setLoading(true);
        
        const existingSlugs = new Set(posts.map(post => post.slug));

        if (authorEmail) {
            const posts = await fetchPostsByAuthor(authorEmail, POSTS_PER_PAGE, pagination);
            const newUniquePosts = posts.posts.filter(post => !existingSlugs.has(post.slug));

            if (newUniquePosts.length === 0) setAllFetched(true);
        } else {
            const posts = await fetchPosts(limit); // Increment the page for the next fetch
            const newUniquePosts = posts.posts.filter(post => !existingSlugs.has(post.slug));
            
            if (newUniquePosts.length === 0) setAllFetched(true);
        }

        setTimeout(() => {
            setLoading(false);
        }, 1500)
    };

    return (
        <>
            {/* Render dynamically fetched posts */}
            {displayMode === 'linear' ? (
                posts.map((post, index) => (
                    <LazyPostCard 
                        post={post} 
                        authorData={memoizedAuthors.get(post.email) as AuthorItem} 
                        key={post.slug}
                        index={index + indexIncrement} 
                        style={style} 
                        isLoading={loading}
                        setLoading={setLoading}
                    />
                ))
            ) : displayMode === 'latest' ? (
                    <LazyPostCard 
                        post={latest} 
                        authorData={memoizedAuthors.get(latest.email) as AuthorItem} 
                        key={latest.slug}
                        index={indexIncrement}
                        style={style}
                        isLoading={loading}
                        setLoading={setLoading}
                    />
            ) : displayMode === 'recent' ? (
                recent.map((post, index) => (
                    <LazyPostCard 
                        post={post} 
                        authorData={memoizedAuthors.get(post.email) as AuthorItem} 
                        key={`${post.slug}-${index}`}
                        index={index + posts.length + indexIncrement} 
                        style={style}
                        isLoading={loading}
                        setLoading={setLoading}
                    />
                ))
            ) : displayMode === 'admin' ? (
                posts.map((post, index) => (
                    <div className="col-md-6 col-lg-4">
                        <LazyPostCard 
                            post={post} 
                            authorData={memoizedAuthors.get(post.email) as AuthorItem} 
                            key={`${post.slug}-${index}`}
                            index={index + posts.length + indexIncrement} 
                            style={style}
                            isLoading={loading}
                            setLoading={setLoading}
                        />
                    </div>
                ))
            ) : (
                mostViewed.map((post, index) => (
                    <LazyPostCard 
                        post={post} 
                        authorData={memoizedAuthors.get(post.email) as AuthorItem} 
                        key={`${post.slug}-${index}`} 
                        index={index + posts.length + indexIncrement} 
                        style={style}
                        isLoading={loading}
                        setLoading={setLoading}
                    />
                ))
            )}

            {/* Show a "Load More" button if more posts are available */}
            {!isAllFetched && infiniteScroll && !loading && (
                <button onClick={loadMorePosts} className="btn-outlined my-5 py-3">
                    Load More Posts
                </button>
            )}

            {loading && (
                <LoadingSkeleton />
            )}
        </>
    );
};

export default PostList;

