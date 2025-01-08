'use client';
import { AuthorItem, PostItem, TagItem } from '@/types';
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
}

// Create Context
const PostContext = createContext<PostContextType | undefined>(undefined);

// Provider
export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
    const [expandedPost, setExpandedPost] = useState<{ post: PostItem; boundingBox: DOMRect } | null>(null);
    const [authors, setAuthors] = useState<AuthorItem[]>([]);
    const [selectedMarkdown, setSelectedMarkdown] = useState<string | null>(null);
    const [previousPath, setPreviousPath] = useState<string | null>(null);
    const [tags, setTags] = useState<TagItem[]>([]);

    const pathname = usePathname();

    useEffect(() => {
        // Automatically close modal if URL doesn't match the selected post
        if (selectedPost && pathname !== `/${selectedPost.slug}`) {
            setSelectedPost(null);
            setSelectedMarkdown(null);
            setIsModalOpen(false); // Close the modal
        }
    }, [pathname, selectedPost]);

    const openModal = (post: PostItem, markdown: string, previousPath: string) => {
        setSelectedPost(post);
        setSelectedMarkdown(markdown);
        setPreviousPath(previousPath);
        setIsModalOpen(true);

        // Update the URL state
        window.history.pushState({}, '', `/${post.slug}`);
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
