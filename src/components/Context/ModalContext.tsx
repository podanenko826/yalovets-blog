'use client';
import { PostItem } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
interface ModalContextType {
    openModal: (post: PostItem, markdown: string) => void;
    closeModal: () => void;
    selectedPost: PostItem | null;
    setSelectedPost: React.Dispatch<React.SetStateAction<PostItem | null>>;
    expandedPost: { post: PostItem; boundingBox: DOMRect } | null; // Update type here
    setExpandedPost: React.Dispatch<React.SetStateAction<{ post: PostItem; boundingBox: DOMRect } | null>>;
    selectedMarkdown: string | null;
    setSelectedMarkdown: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create Context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
    const [expandedPost, setExpandedPost] = useState<{ post: PostItem; boundingBox: DOMRect } | null>(null);
    const [selectedMarkdown, setSelectedMarkdown] = useState<string | null>(null);

    const pathname = usePathname();

    const router = useRouter();

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

    const openModal = (post: PostItem, markdown: string) => {
        setSelectedPost(post);
        setSelectedMarkdown(markdown);

        // Update the URL state
        router.push(`/${post?.slug}`, { scroll: false });
    };

    const closeModal = () => {
        router.back();

        setSelectedPost(null);
        setSelectedMarkdown(null);
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
