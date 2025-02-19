import { create } from "zustand";

import { PaginationState, PostItem } from "@/types";
import { getAuthorPosts, getPaginatedPosts, getSortedPosts, sortPosts } from "@/lib/posts";

interface PostStore {
    posts: PostItem[];
    setPosts: (posts: PostItem[]) => void;
    loadPostsFromStorage: () => void;
    selectedPost: PostItem | null;
    setSelectedPost: (post: PostItem | null) => void;
    expandedPost: { post: PostItem; boundingBox: DOMRect } | null;
    setExpandedPost: (post: { post: PostItem; boundingBox: DOMRect } | null) => void;
    lastKey: string | null;
    setLastKey: (lastKey: string | null) => void;
    fetchPosts: (limit: number) => Promise<{ posts: PostItem[], lastKey: string }>;
    fetchPostsByPage: (page: number, postsPerPage: number, pagination: PaginationState) => Promise<PostItem[]>;
    fetchPostsByAuthor: (authorEmail: string, postsPerPage: number, pagination: PaginationState, lastKey?: string) => Promise<{ posts: PostItem[], lastKey: string }>;
}

export const usePostStore = create<PostStore>((set, get) => {
    
    const posts: PostItem[] = [];
    const lastKey: string | null = null;


    const setPosts = (posts: PostItem[]) => {
        set({ posts });
        savePostsToLocalStorage(posts);
    };

    const selectedPost: PostItem | null = null;

    const setSelectedPost = (post: PostItem | null) => {
        set({ selectedPost: post });
    };

    const expandedPost: { post: PostItem; boundingBox: DOMRect } | null = null;

    const setExpandedPost = (value: { post: PostItem; boundingBox: DOMRect } | null) => {
        set({ expandedPost: value });
    };


    const setLastKey = (key: string | null) => {
        console.log("⏳ Attempting to set lastKey:", key);
        console.log("🔍 Current Zustand lastKey:", get().lastKey);

        if (get().lastKey !== key) {
            console.log("✅ Zustand is updating lastKey to:", key);
            set({ lastKey: key })
        } else {
            console.log("🚫 Skipping lastKey update, it's the same.");
        }
    };

    const POSTS_STORAGE_KEY = "cachedPosts";
    const POSTS_EXPIRATION_TIME = 1000 * 60 * 60 * 2; // 2 hours

    const savePostsToLocalStorage = (newPosts: PostItem[]) => {
        if (typeof localStorage === 'undefined') return;
        
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

    const loadPostsFromStorage = () => {
        if (typeof localStorage === 'undefined') return;

        const savedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
        if (savedPosts) {
            const parsedPosts = JSON.parse(savedPosts).posts;
            
            if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
                const lastKeyFromStorage = parsedPosts.at(-1)?.date ?? null;
                setPosts(parsedPosts);
                console.log("Loaded lastKey from storage:", lastKeyFromStorage);
                setLastKey(lastKeyFromStorage);
            }
        }
    };

    loadPostsFromStorage();


    const fetchPosts = async (limit: number): Promise<{ posts: PostItem[], lastKey: string }> => {
        if (!limit || limit > 50) return { posts: [], lastKey: "" };
        
        try {
            const { posts, lastKey } = get();

            let postsData;

            if (lastKey) {
                postsData = await getSortedPosts(limit, lastKey || undefined);
            } else {
                postsData = await getSortedPosts(limit);
            }

            // Clone and sort posts, avoiding mutation
            const existingSlugs = new Set(posts.map(post => post.slug));
            const newUniquePosts = postsData.posts.filter(post => !existingSlugs.has(post.slug));

            // Clone and combine posts, avoiding mutation
            const combinedPosts = [...posts, ...newUniquePosts];
            const sortedCombinedPosts = sortPosts([...combinedPosts]);
            
            savePostsToLocalStorage([...sortedCombinedPosts]);
            setPosts([...sortedCombinedPosts]);

            // Update lastKey for pagination (only if it changes)
            if (postsData.lastKey) {
                // set({ lastKey: postsData.lastKey });
            }

            return { posts: [...sortedCombinedPosts], lastKey: postsData.lastKey };
        } catch (error) {
            console.error("Error fetching posts:", error);
            return { posts: [], lastKey: "" };
        }
    };

    const findStartPostIndexByDate = (date: string, posts: PostItem[]): number => {
        return posts.findIndex(post => post.date === date);
    };

    const fetchPostsByPage = async (page: number, postsPerPage: number, pagination: PaginationState): Promise<PostItem[]> => {
        if (!page || !postsPerPage) return [];
        if (Object.keys(pagination.paginationData).length === 0) return [];
        
        try {
            let postsData: { posts: PostItem[]; lastKey: string; } = { posts: [], lastKey: ''};

            const currentPageStartingDate = pagination.paginationData[page]?.date;
            const currentPageStartPostIndex = findStartPostIndexByDate(currentPageStartingDate, posts);

            if (currentPageStartPostIndex >= 0) {
                const pagePosts = posts.slice(currentPageStartPostIndex, currentPageStartPostIndex + postsPerPage);
                
                if (pagePosts.length > 0) postsData = {
                    lastKey: pagePosts.at(-1)?.date || '',
                    posts: pagePosts
                };
            }

            if (postsData.posts.length === 0) {
                postsData = await getPaginatedPosts(page, postsPerPage, pagination);
            }

            if (postsData.posts.length > 0) {
                const existingSlugs = new Set(posts.map(post => post.slug));
                const newUniquePosts = postsData.posts.filter(post => !existingSlugs.has(post.slug));
            
                const combinedPosts = [...posts, ...newUniquePosts];
                const sortedCombinedPosts = sortPosts(combinedPosts);

                setPosts([...sortedCombinedPosts]);
                savePostsToLocalStorage([...sortedCombinedPosts]);

                return sortedCombinedPosts;
            }

            return [];
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
        }
    };

    const fetchPostsByAuthor = async (authorEmail: string, postsPerPage: number, pagination: PaginationState): Promise<{ posts: PostItem[], lastKey: string}> => {
        if (!authorEmail || !postsPerPage) return { posts: [], lastKey: "" };
        if (Object.keys(pagination.paginationData).length === 0) return { posts: [], lastKey: "" };
        
        try {
            const postsData = await getAuthorPosts(authorEmail, postsPerPage, lastKey || undefined);

            if (postsData.posts.length > 0) {
                const existingSlugs = new Set(posts.map(post => post.slug));
                const newUniquePosts = postsData.posts.filter(post => !existingSlugs.has(post.slug));
            
                const combinedPosts = [...posts, ...newUniquePosts];
                const sortedCombinedPosts = sortPosts(combinedPosts);
                setPosts([...sortedCombinedPosts]);
                savePostsToLocalStorage([...sortedCombinedPosts]);

                // Update lastKey for pagination (only if it changes)
                if (postsData.lastKey && postsData.lastKey !== lastKey) {
                    setLastKey(postsData.lastKey);
                }

                return { posts: [...sortedCombinedPosts], lastKey: postsData.lastKey };
            }

            return { posts: [], lastKey: "" };
        } catch (error) {
            console.error("Error fetching posts:", error);
            return { posts: [], lastKey: "" };
        }
    };

    return {
        posts,
        setPosts,
        loadPostsFromStorage,
        selectedPost,
        setSelectedPost,
        expandedPost,
        setExpandedPost,
        lastKey,
        setLastKey,
        fetchPosts,
        fetchPostsByPage,
        fetchPostsByAuthor
    }
});
