'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AuthorItem, PostItem } from '@/types';
import LazyPostCard from './LazyPostCard';
import moment from 'moment';
import { usePostStore } from '../posts/store';
import { useAuthorStore } from '../authors/store';
import { usePaginationStore } from '../pagination/store';
import LoadingSkeleton from '../LoadingSkeleton';
import { getAuthorPosts, getPopularPosts, sortPosts } from '@/lib/posts';
import { getAuthorByEmail } from '@/lib/authors';

interface PostListProps {
    displayMode: 'linear' | 'latest' | 'recent' | 'popular' | 'author' | 'admin';
    style: 'massive' | 'full' | 'expanded' | 'preview' | 'admin' | 'standard';
    limit: number;  // Add limit as a prop for pagination
    indexIncrement?: number;
    infiniteScroll?: boolean;
    postsData?: PostItem[];
    authorEmail?: string;
}

const PostList: React.FC<PostListProps> = ({ displayMode, style, limit = 28, indexIncrement = 0, infiniteScroll = false, postsData, authorEmail }) => {
    const { posts, setPosts, fetchPosts, fetchPostsByAuthor } = usePostStore();
    const { authors } = useAuthorStore();
    const { pagination } = usePaginationStore();

    const [loading, setLoading] = useState<boolean>(true);
    const [isAllFetched, setAllFetched] = useState<boolean>(false);

    const POSTS_PER_PAGE = limit;

    const memoizedPosts = postsData && postsData.length > 0 ? 
        useMemo(() => postsData.slice(), [postsData]) : 
        useMemo(() => posts.slice(), [posts]);

    const memoizedAuthors = useMemo(() => new Map(authors.map((author) => [author.email, author])), [authors]);

    const recent = useMemo(() => memoizedPosts.slice(0, 9), [memoizedPosts]);

    const latest = useMemo(() => memoizedPosts[0] || null, [memoizedPosts]);

    const [mostViewed, setMostViewed] = useState<PostItem[]>([]);

    const [authorPosts, setAuthorPosts] = useState<PostItem[]>([]);

    useEffect(() => {
        const fetchPopularPosts = async () => {
            if (displayMode === 'popular' && mostViewed.length === 0) {
                const popularPosts = await getPopularPosts(3);

                if (popularPosts.length > 0) setMostViewed(popularPosts);
            }
        }

        fetchPopularPosts();
    }, [displayMode, mostViewed.length])

    useEffect(() => {
        const fetchAuthorPosts = async () => {
            if (displayMode === 'author' && authorPosts.length === 0 && authorEmail && POSTS_PER_PAGE) {
                const authorPosts = await getAuthorPosts(authorEmail, POSTS_PER_PAGE);

                console.log(authorPosts);
                
                if (authorPosts.posts.length > 0) setAuthorPosts(authorPosts.posts);
            }
        }

        fetchAuthorPosts();
    }, [displayMode, authorPosts.length, authorEmail, POSTS_PER_PAGE])

    // Scroll-based pagination or load more trigger
    const loadMorePosts = async () => {
        if (loading) return;
        setLoading(true);
        
        if (authorEmail) {
            const existingSlugs = new Set(authorPosts.map(post => post.slug));

            // We increment the POSTS_PER_PAGE by 1 to avoid the last post from not being downloaded, due to lastKey's nature to fetch the post equal to the lastKey
            const _authorPosts = await fetchPostsByAuthor(authorEmail, POSTS_PER_PAGE + 1, pagination, authorPosts.at(-1)?.date || undefined);
            const newUniquePosts = _authorPosts.posts.filter(post => !existingSlugs.has(post.slug));

            const combinedPosts = [...authorPosts, ...newUniquePosts];
            const sortedCombinedPosts = sortPosts(combinedPosts);

            setAuthorPosts(sortedCombinedPosts);

            if (newUniquePosts.length === 0 || newUniquePosts.length < limit) setAllFetched(true);
        } else {
            const existingSlugs = new Set(posts.map(post => post.slug));

            // We increment the POSTS_PER_PAGE by 1 to avoid the last post from not being downloaded, due to lastKey's nature to fetch the post equal to the lastKey
            const _posts = await fetchPosts(POSTS_PER_PAGE + 1, posts.at(-1)?.date); // Increment the page for the next fetch
            const newUniquePosts = _posts.posts.filter(post => !existingSlugs.has(post.slug));

            const combinedPosts = [...posts, ...newUniquePosts];
            const sortedCombinedPosts = sortPosts(combinedPosts);

            setPosts(sortedCombinedPosts);
            
            if (newUniquePosts.length === 0 || newUniquePosts.length < limit) setAllFetched(true);
        }

        setTimeout(() => {
            setLoading(false);
        }, 1500)
    };

    if (displayMode !== 'author' && !postsData && posts.length === 0 || authors.length === 0) return;

    if (displayMode === 'author' && authorPosts.length === 0) return;

    if (displayMode === 'author' && !authorEmail) return <div>Pass authorEmail to the PostList</div>;
    
    return (
        <>
            {/* Render dynamically fetched posts */}
            {displayMode === 'linear' ? (
                postsData && postsData.length > 0 ?
                    postsData.map((post, index) => (
                        <LazyPostCard 
                            post={post} 
                            authorData={memoizedAuthors.get(post.email) as AuthorItem} 
                            key={post.slug}
                            index={index + indexIncrement} 
                            style={style} 
                            isLoading={loading}
                            setLoading={setLoading}
                        />
                    )) :
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
                    <div key={`${post.slug}-${index}`} className="col-md-6 col-lg-4">
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
            ) : displayMode === 'popular' ? (
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
            ) : (
                authorPosts.map((post, index) => (
                    <LazyPostCard 
                        post={post} 
                        authorData={memoizedAuthors.get(post.email) as AuthorItem} 
                        key={`${post.slug}-${index}`} 
                        index={index + indexIncrement} 
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

