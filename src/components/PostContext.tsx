'use client';
import { getAuthors } from '@/lib/authors';
import { getSortedPosts } from '@/lib/posts';
import { AuthorItem, PostItem, TagItem } from '@/types';
import moment from 'moment';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
interface PostContextType {
    openModal: (post: PostItem, markdown: string, previousPath: string) => void;
    closeModal: () => void;
    posts: PostItem[];
    setPosts: React.Dispatch<React.SetStateAction<PostItem[]>>;
    selectedPost: PostItem | null;
    setSelectedPost: React.Dispatch<React.SetStateAction<PostItem | null>>;
    expandedPost: { post: PostItem; boundingBox: DOMRect } | null; // Update type here
    setExpandedPost: React.Dispatch<React.SetStateAction<{ post: PostItem; boundingBox: DOMRect } | null>>;
    authors: AuthorItem[];
    setAuthors: React.Dispatch<React.SetStateAction<AuthorItem[]>>;
    selectedMarkdown: string | null;
    setSelectedMarkdown: React.Dispatch<React.SetStateAction<string | null>>;
    previousPath: string | null;
    setPreviousPath: React.Dispatch<React.SetStateAction<string | null>>;
    tags: TagItem[];
    setTags: React.Dispatch<React.SetStateAction<TagItem[]>>;
    fetchPosts: (limit: number) => void;
    lastKey: string | null;
    setLastKey: React.Dispatch<React.SetStateAction<string>>
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

type FetchPostsResponse = {
    posts: PostItem[];
    lastKey: string; // The last key is the exclusive start key for pagination
};

// Create Context
const PostContext = createContext<PostContextType | undefined>(undefined);

// Provider
export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
    const [expandedPost, setExpandedPost] = useState<{ post: PostItem; boundingBox: DOMRect } | null>(null);
    const [authors, setAuthors] = useState<AuthorItem[]>([]);
    const [selectedMarkdown, setSelectedMarkdown] = useState<string | null>(null);
    const [previousPath, setPreviousPath] = useState<string | null>(null);
    const [tags, setTags] = useState<TagItem[]>([]);
    
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [lastKey, setLastKey] = useState<string>('');
    const [limit, setLimit] = useState<number | null>(null);
    const [request, setRequest] = useState<number>(0);

    const pathname = usePathname();

    useEffect(() => {
        // Automatically close modal if URL doesn't match the selected post
        if (selectedPost && pathname !== `/${selectedPost?.slug}`) {
            setSelectedPost(null);
            setSelectedMarkdown(null);
            setIsModalOpen(false); // Close the modal
        }
    }, [pathname, selectedPost]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!limit || authors.length === 0) return;
            
            setLoading(true);

            console.log('FETCHING!!');
            

            try {
                let postsData;

                if (lastKey) {
                    postsData = await getSortedPosts(limit, lastKey);
                } else {
                    postsData = await getSortedPosts(limit)
                }
                
                const existingSlugs = new Set(posts.map(post => post.slug));
                const newUniquePosts = postsData.posts.filter(post => !existingSlugs.has(post.slug));
                
                // Log unique posts
                console.log('New unique:', newUniquePosts);

                // Clone and combine posts, avoiding mutation
                const combinedPosts = [...posts, ...newUniquePosts];

                // Log combined posts
                console.log('Combined posts:', combinedPosts);
                
                // Set posts if they've changed (deep clone ensures no mutation)
                setPosts([...combinedPosts]);

                // Update lastKey for pagination (only if it changes)
                if (postsData.lastKey !== lastKey) {
                    setLastKey(postsData.lastKey);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPosts();
    }, [request, limit, authors]);

    useEffect(() => {
        const getAuthorsData = async () => {
            if (authors.length === 0) {
                const authors = await getAuthors();
                setAuthors(authors);
            }
        };

        getAuthorsData();
    }, [authors, setAuthors]);

    // Trigger the useEffect to fetch another stack of posts
    const fetchPosts = (limit: number) => {
        setRequest(prev => prev + 1);
        setLimit(limit);
    }

    const openModal = (post: PostItem, markdown: string, previousPath: string) => {
        setSelectedPost(post);
        setSelectedMarkdown(markdown);
        setPreviousPath(previousPath);
        setIsModalOpen(true);

        // Update the URL state
        window.history.pushState({}, '', `/${post?.slug}`);
    };

    const closeModal = () => {
        setSelectedPost(null);
        setSelectedMarkdown(null);
        setIsModalOpen(false);

        const currentPath = window.location.href;

        if (previousPath === currentPath) {
            window.history.pushState({}, '', `/`);
        } else {
            window.history.pushState({}, '', previousPath ? previousPath : '/');
        }
    };

    return (
        <PostContext.Provider
            value={{
                openModal,
                closeModal,
                posts,
                setPosts,
                selectedPost,
                setSelectedPost,
                expandedPost,
                setExpandedPost,
                authors,
                setAuthors,
                selectedMarkdown,
                setSelectedMarkdown,
                previousPath,
                setPreviousPath,
                tags,
                setTags,
                fetchPosts,
                lastKey,
                setLastKey,
                loading,
                setLoading,
            }}>
            {children}
        </PostContext.Provider>
    );
};

// Hook to use context
export const usePostContext = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePostContext must be used within a PostProvider');
    }
    return context;
};
