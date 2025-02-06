'use client';
import { getAuthors } from '@/lib/authors';
import { getPaginationData } from '@/lib/pagination';
import { getPaginatedPosts, getSortedPosts, sortPosts } from '@/lib/posts';
import { AuthorItem, PaginationEntry, PaginationState, PostItem, TagItem } from '@/types';
import moment from 'moment';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
interface PostContextType {
    userConfig: { theme: string, postsPerPage: number };
    setUserConfig: React.Dispatch<React.SetStateAction<{ theme: string, postsPerPage: number }>>;
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
    fetchPosts: (limit: number, page?: number) => void;
    lastKey: string | null;
    setLastKey: React.Dispatch<React.SetStateAction<string>>;
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    postCount: number;
    setPostCount: React.Dispatch<React.SetStateAction<number>>;
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
    const [userConfig, setUserConfig] = useState<{ theme: string, postsPerPage: number }>(() => {
        if (typeof window === "undefined") return { theme: "light", postsPerPage: 14 }; // Prevent SSR errors

        const storedConfig = localStorage.getItem("userConfig");
        return storedConfig ? JSON.parse(storedConfig) : { theme: "light", postsPerPage: 14 };
    });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
    const [expandedPost, setExpandedPost] = useState<{ post: PostItem; boundingBox: DOMRect } | null>(null);
    const [authors, setAuthors] = useState<AuthorItem[]>([]);
    const [selectedMarkdown, setSelectedMarkdown] = useState<string | null>(null);
    const [previousPath, setPreviousPath] = useState<string | null>(null);
    const [tags, setTags] = useState<TagItem[]>([]); // An array of all saved tags

    const [originalPagination, setOriginalPagination] = useState<PaginationState | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        totalPages: 1,
        paginationData: {},
    });
    
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [lastKey, setLastKey] = useState<string>('');
    const [limit, setLimit] = useState<number | null>(null);
    const [page, setPage] = useState<number | null>(null);
    const [tag, setTag] = useState<string | null>(null); // A single tag for fetching purposes
    const [postCount, setPostCount] = useState<number>(0);

    const [request, setRequest] = useState<number>(0);

    const pathname = usePathname();

    /*
        Pagination logic
    */
   
    const PAGINATION_STORAGE_KEY = "cachedPagination";
    const PAGINATION_EXPIRATION_TIME = 1000 * 60 * 60 * 2; // 2 hours

    const savePaginationToLocalStorage = (newPagination: PaginationState) => {
        const data = {
            pagination: newPagination,
            timestamp: Date.now(),
        };
        localStorage.setItem(PAGINATION_STORAGE_KEY, JSON.stringify(data));
    };

    const getPaginationFromLocalStorage = (): PaginationState | null => {
        const data = localStorage.getItem(PAGINATION_STORAGE_KEY);
        if (!data) return null;

        const { pagination, timestamp } = JSON.parse(data);

        // Check expiration
        if (Date.now() - timestamp > PAGINATION_EXPIRATION_TIME) {
            localStorage.removeItem(PAGINATION_STORAGE_KEY);
            return null;
        }

        return pagination;
    };

    useEffect(() => {
        if (typeof window !== "undefined") { // Prevents server-side execution
            localStorage.setItem('userConfig', JSON.stringify(userConfig));
        }
    }, [userConfig]);

    useEffect(() => {
        const fetchPagination = async () => {
            if (!originalPagination) {
                const cachedPagination = getPaginationFromLocalStorage();
                console.log('cachedPagination: ', cachedPagination);
                
                if (cachedPagination) {
                    setOriginalPagination(cachedPagination);
                    console.log('Got pagination from cache');
                    return;
                }

                const paginationData = await getPaginationData();
                const totalPages = Object.keys(paginationData).length;
    
                setOriginalPagination({
                    totalPages,
                    paginationData,
                });
                savePaginationToLocalStorage({
                    totalPages,
                    paginationData,
                });
                console.log('saved: ', totalPages, paginationData);
                
            }
        };
    
        fetchPagination();
    }, [originalPagination]);

    useEffect(() => {
        if (!originalPagination) return;
    
        if (userConfig.postsPerPage === 14) {
            // Restore original pagination
            setPagination(originalPagination);
            return;
        }
    
        let modifiedPagination: Record<number, PaginationEntry> = {};
        Object.entries(originalPagination.paginationData).forEach(([key, value], index) => {
            if (userConfig.postsPerPage === 28 && index % 2 === 0) {
                modifiedPagination[parseInt(key) > 1 ? (parseInt(key) - 1) : parseInt(key)] = { date: value.date };
            } else if (userConfig.postsPerPage === 42 && index % 3 === 0) {
                modifiedPagination[parseInt(key)] = { date: value.date };
            }
        });       

        setPagination({
            totalPages: Object.keys(modifiedPagination).length,
            paginationData: modifiedPagination,
        });

    
    }, [userConfig.postsPerPage, originalPagination]);

    /*
        Post logic
    */

    const POSTS_STORAGE_KEY = "cachedPosts";
    const POSTS_EXPIRATION_TIME = 1000 * 60 * 60 * 2; // 2 hours

    const savePostsToLocalStorage = (newPosts: PostItem[]) => {
        const storedData = localStorage.getItem(POSTS_STORAGE_KEY);
        let existingPosts: PostItem[] = [];
    
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (Date.now() - parsedData.timestamp < POSTS_EXPIRATION_TIME) {
                existingPosts = parsedData.posts;
            }
        }
    
        const postMap = new Map(existingPosts.map(post => [post.slug, post]));
        newPosts.forEach(post => postMap.set(post.slug, post));
    
        const updatedPosts = Array.from(postMap.values());
    
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify({
            posts: updatedPosts,
            timestamp: Date.now(),
        }));
    };

    const getPostsFromLocalStorage = (): PostItem[] | null => {
        const data = localStorage.getItem(POSTS_STORAGE_KEY);
        if (!data) return null;

        const { posts, timestamp } = JSON.parse(data);

        // Check expiration
        if (Date.now() - timestamp > POSTS_EXPIRATION_TIME) {
            localStorage.removeItem(POSTS_STORAGE_KEY);
            return null;
        }

        return posts;
    };

    const findStartPostIndexByDate = (date: string, posts: PostItem[]): number => {
        return posts.findIndex(post => post.date === date);
    };

    useEffect(() => {
        // Automatically close modal if URL doesn't match the selected post
        if (selectedPost && pathname !== `/${selectedPost?.slug}`) {
            setSelectedPost(null);
            setSelectedMarkdown(null);
            setIsModalOpen(false); // Close the modal
        }
    }, [pathname, selectedPost]);

    useEffect(() => {
        const cachedPosts = getPostsFromLocalStorage();
        console.log(cachedPosts);
        
        if (cachedPosts) {
            setPosts(cachedPosts);
            console.log('Got from the cache');
            
            return;
        }
    }, [])

    useEffect(() => {
        const fetchPosts = async () => {
            if (page || !limit || limit > 50) return;
            if (!userConfig.postsPerPage) return;
            
            setLoading(true);
            
            try {
                let postsData;

                if (lastKey) {
                    postsData = await getSortedPosts(limit, lastKey);
                } else {
                    postsData = await getSortedPosts(limit);
                }
                
                const existingSlugs = new Set(posts.map(post => post.slug));
                const newUniquePosts = postsData.posts.filter(post => !existingSlugs.has(post.slug));

                // Clone and combine posts, avoiding mutation
                const combinedPosts = [...posts, ...newUniquePosts];
                const sortedCombinedPosts = sortPosts([...combinedPosts]);
                
                setPosts([...sortedCombinedPosts]);
                savePostsToLocalStorage([...sortedCombinedPosts]);

                // Update lastKey for pagination (only if it changes)
                if (postsData.lastKey && postsData.lastKey !== lastKey) {
                    setLastKey(postsData.lastKey);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPosts();
    }, [request, limit]);

    useEffect(() => {
        const fetchPostsByPage = async () => {
            if (!page || !limit || limit > 50) return;
            if (!userConfig.postsPerPage) return;
            if (Object.keys(pagination.paginationData).length === 0) return;
            
            setLoading(true);
            
            try {
                let postsData: { posts: PostItem[]; lastKey: string; } = { posts: [], lastKey: ''};

                const currentPageStartingDate = pagination.paginationData[page]?.date;
                const currentPageStartPostIndex = findStartPostIndexByDate(currentPageStartingDate, posts);

                if (currentPageStartPostIndex >= 0) {
                    const pagePosts = posts.slice(currentPageStartPostIndex, currentPageStartPostIndex + userConfig.postsPerPage);
                    
                    if (pagePosts.length > 0) postsData = {
                        lastKey: pagePosts.at(-1)?.date || '',
                        posts: pagePosts
                    };
                }

                if (postsData.posts.length === 0) {
                    postsData = await getPaginatedPosts(page, userConfig.postsPerPage, pagination);
                }
    
                if (postsData.posts.length > 0) {
                    const existingSlugs = new Set(posts.map(post => post.slug));
                    const newUniquePosts = postsData.posts.filter(post => !existingSlugs.has(post.slug));
                
                    const combinedPosts = [...posts, ...newUniquePosts];
                    const sortedCombinedPosts = sortPosts(combinedPosts);
                    setPosts([...sortedCombinedPosts]);

                    savePostsToLocalStorage([...sortedCombinedPosts]);
                }

                // setPage(null);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPostsByPage();
    }, [request, limit, page, pagination.paginationData]);

    /* 
        Author logic
    */

    const AUTHORS_STORAGE_KEY = "cachedAuthors";
    const AUTHORS_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

    const saveAuthorsToLocalStorage = (newAuthors: AuthorItem[]) => {
        const storedData = localStorage.getItem(AUTHORS_STORAGE_KEY);
        let existingAuthors: AuthorItem[] = [];
    
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (Date.now() - parsedData.timestamp < AUTHORS_EXPIRATION_TIME) {
                existingAuthors = parsedData;
            }
        }
    
        const authorMap = new Map(existingAuthors.map(author => [author.email, author]));
        newAuthors.forEach(author => authorMap.set(author.email, author));
    
        const updatedAuthors = Array.from(authorMap.values());
    
        localStorage.setItem(AUTHORS_STORAGE_KEY, JSON.stringify({
            authors: updatedAuthors,
            timestamp: Date.now(),
        }));
    };

    const getAuthorsFromLocalStorage = (): AuthorItem[] | null => {
        const data = localStorage.getItem(AUTHORS_STORAGE_KEY);
        if (!data) return null;

        const { authors, timestamp } = JSON.parse(data);

        // Check expiration
        if (Date.now() - timestamp > AUTHORS_EXPIRATION_TIME) {
            localStorage.removeItem(AUTHORS_STORAGE_KEY);
            return null;
        }

        return authors;
    };

    useEffect(() => {
        const getAuthorsData = async () => {
            if (authors.length === 0) {
                const cachedAuthors = getAuthorsFromLocalStorage();
                console.log(cachedAuthors);
                
                if (cachedAuthors) {
                    setAuthors(cachedAuthors)
                    console.log('Fetched autorhs from cache');
                    return;
                }

                const authors = await getAuthors();
                setAuthors(authors);
                saveAuthorsToLocalStorage(authors);
            }
        };

        getAuthorsData();
    }, [authors, setAuthors]);

    /*
        ArticleModal logic
    */

    // Trigger the useEffect to fetch another stack of posts
    const fetchPosts = (limit: number, page?: number, tag?: string) => {
        setRequest(prev => prev + 1);
        setLimit(limit);

        if (page) setPage(page);
        if (tag) setTag(tag);
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
                userConfig,
                setUserConfig,
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
                pagination,
                setPagination,
                postCount,
                setPostCount,
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
