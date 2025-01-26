'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { usePostContext } from './PostContext';
import { AuthorItem, PostItem } from '@/types';
import LazyPostCard from './LazyPostCard';
import moment from 'moment';

interface PostListProps {
    displayMode: 'linear' | 'latest' | 'recent' | 'popular';
    style: 'massive' | 'full' | 'expanded' | 'preview' | 'admin' | 'standard';
    limit: number;  // Add limit as a prop for pagination
    indexIncrement?: number;
    infiniteScroll?: boolean;
    postsData?: PostItem[];
}

const PostList: React.FC<PostListProps> = ({ displayMode, style, limit, indexIncrement = 0, infiniteScroll = false, postsData }) => {
    const { posts, setPosts } = usePostContext();
    const { authors, setAuthors } = usePostContext();
    const { fetchPosts } = usePostContext();
    const { loading } = usePostContext();
    const { lastKey } = usePostContext();

    const [sortedPosts, setSortedPosts] = useState<PostItem[]>([]);

    useEffect(() => {
        console.log('Recieved:', postsData);
        
    }, [postsData])

    useEffect(() => {
        let sortedPosts;

        if (postsData && postsData?.length > 0) {
            sortedPosts = [...postsData];
        } else {
            const format = 'YYYY-MM-DD';

            sortedPosts = [...posts].sort((a, b) => {
                const dateOne = moment(a.date, format);
                const dateTwo = moment(b.date, format);
                return dateTwo.diff(dateOne); // Sorting by date (descending)
            });
        }


        setSortedPosts(sortedPosts); // Set sorted posts state
    }, [posts, postsData]);  // Recalculate whenever `posts` change

    // useEffect(() => {
    //     const fetchPost = () => {
    //         fetchPosts(page, limit);
    //     }

    //     fetchPost()
    // }, [limit])

    const recent = sortedPosts.slice(0, 9);
    
    const latest = sortedPosts[0] || null;
    const mostViewed = [...sortedPosts]
    .sort((a, b) => (b.viewsCount ?? 0) - (a.viewsCount ?? 0)) // Sort by viewsCount in descending order
    .slice(0, 3);

    // Scroll-based pagination or load more trigger
    const loadMorePosts = () => {
        if (!loading) {
            fetchPosts(limit); // Increment the page for the next fetch
        }
    };

    return (
        <>
            {/* Render initial posts followed by fetched ones */}
            {/* {posts.map((post, index) => (
                <LazyPostCard 
                    post={post} 
                    authorData={authors.find((author) => author.email === post.email) as AuthorItem} 
                    key={post.slug} 
                    index={index + indexIncrement} 
                    style={style} 
                />
            ))} */}

            {/* Render dynamically fetched posts */}
            {displayMode === 'linear' ? (
                sortedPosts.map((post, index) => (
                    <LazyPostCard 
                        post={post} 
                        authorData={authors.find((author) => author.email === post.email) as AuthorItem} 
                        key={post.slug} 
                        index={index + indexIncrement} 
                        style={style} 
                    />
                ))
            ): displayMode === 'latest' ? (
                    <LazyPostCard 
                        post={latest} 
                        authorData={authors.find((author) => author.email === latest.email) as AuthorItem} 
                        key={latest.slug} 
                        index={indexIncrement} 
                        style={style} 
                    />
            ): displayMode === 'recent' ? (
                recent.map((post, index) => (
                    <LazyPostCard 
                        post={post} 
                        authorData={authors.find((author) => author.email === post.email) as AuthorItem} 
                        key={post.slug} 
                        index={index + posts.length + indexIncrement} 
                        style={style} 
                    />
                ))
            ): (
                mostViewed.map((post, index) => (
                    <LazyPostCard 
                        post={post} 
                        authorData={authors.find((author) => author.email === post.email) as AuthorItem} 
                        key={post.slug} 
                        index={index + posts.length + indexIncrement} 
                        style={style} 
                    />
                ))
            )}

            {/* Show a "Load More" button if more posts are available */}
            {infiniteScroll && lastKey && !loading && (
                <button onClick={loadMorePosts} className="btn-filled">
                    Load More Posts
                </button>
            )}
        </>
    );
};

export default PostList;

