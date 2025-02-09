'use client';
import { PostItem } from '@/types';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
interface ModalContextType {
    openModal: (post: PostItem, markdown: string, previousPath: string) => void;
    closeModal: () => void;
    selectedPost: PostItem | null;
    setSelectedPost: React.Dispatch<React.SetStateAction<PostItem | null>>;
    expandedPost: { post: PostItem; boundingBox: DOMRect } | null; // Update type here
    setExpandedPost: React.Dispatch<React.SetStateAction<{ post: PostItem; boundingBox: DOMRect } | null>>;
    selectedMarkdown: string | null;
    setSelectedMarkdown: React.Dispatch<React.SetStateAction<string | null>>;
    previousPath: string | null;
    setPreviousPath: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create Context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
    const [expandedPost, setExpandedPost] = useState<{ post: PostItem; boundingBox: DOMRect } | null>(null);
    const [selectedMarkdown, setSelectedMarkdown] = useState<string | null>(null);
    const [previousPath, setPreviousPath] = useState<string | null>(null);

    const pathname = usePathname();

    useEffect(() => {
        // Automatically close modal if URL doesn't match the selected post
        if (selectedPost && pathname !== `/${selectedPost?.slug}`) {
            setSelectedPost(null);
            setSelectedMarkdown(null);
        }
    }, [pathname, selectedPost]);

    /*
        ArticleModal logic
    */

    const openModal = (post: PostItem, markdown: string, previousPath: string) => {
        setSelectedPost(post);
        setSelectedMarkdown(markdown);
        setPreviousPath(previousPath);

        // Update the URL state
        window.history.pushState({}, '', `/${post?.slug}`);
    };

    const closeModal = () => {
        setSelectedPost(null);
        setSelectedMarkdown(null);

        const currentPath = window.location.href;

        if (previousPath === currentPath) {
            window.history.pushState({}, '', `/`);
        } else {
            window.history.pushState({}, '', previousPath ? previousPath : '/');
        }
    };

    return (
        <ModalContext.Provider
            value={{
                openModal,
                closeModal,
                selectedPost,
                setSelectedPost,
                expandedPost,
                setExpandedPost,
                selectedMarkdown,
                setSelectedMarkdown,
                previousPath,
                setPreviousPath,
            }}>
            {children}
        </ModalContext.Provider>
    );
};

// Hook to use context
export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('usePostContext must be used within a PostProvider');
    }
    return context;
};
