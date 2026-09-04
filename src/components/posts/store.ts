import { create } from "zustand";

import { PostItem } from "@/types";
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
    fetchPosts: (limit: number, _lastKey?: string) => Promise<{ posts: PostItem[], lastKey: string }>;
    fetchPostsByPage: (page: number, postsPerPage: number) => Promise<PostItem[]>;

}

export const usePostStore = create<PostStore>((set, get) => {
    
    const posts: PostItem[] = [];
    const lastKey: string | null = null;


    const setPosts = (posts: PostItem[]) => {
        set({ posts });
        // savePostsToLocalStorage(posts);
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
        if (get().lastKey !== key) {
            set({ lastKey: key })
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
        if (!savedPosts) return;

        try {
            const parsedData = JSON.parse(savedPosts);
            const parsedPosts = parsedData.posts;
            const parsedTimestamp = parsedData.timestamp;

            // Check if data is expired
            if (!parsedTimestamp || (Date.now() - parsedTimestamp) >= POSTS_EXPIRATION_TIME) {
                localStorage.removeItem(POSTS_STORAGE_KEY);
                return; // Expired, so we don't set posts
            }

            if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
                // If the cached posts are from DynamoDB, they will have object fields like { S: "title" }
                if (parsedPosts[0] && typeof parsedPosts[0].title === 'object') {
                    localStorage.removeItem(POSTS_STORAGE_KEY);
                    return;
                }
                const lastKeyFromStorage = parsedPosts.at(-1)?.created_at ?? null;
                setPosts(parsedPosts);
                setLastKey(lastKeyFromStorage);
            }
        } catch (err) {
            console.error("Error parsing posts from storage:", err);
            localStorage.removeItem(POSTS_STORAGE_KEY);
        }
    };

    // loadPostsFromStorage();


    const fetchPosts = async (limit: number, _lastKey?: string): Promise<{ posts: PostItem[], lastKey: string }> => {
        if (!limit || limit > 50) return { posts: [], lastKey: "" };
        
        try {
            const { posts, lastKey } = get();

            let postsData;

            if (_lastKey) {
                postsData = await getSortedPosts(limit, _lastKey);
            } else {
                postsData = await getSortedPosts(limit);
            }

            // Clone and sort posts, avoiding mutation
            const existingSlugs = new Set(posts.map(post => post.slug));
            const newUniquePosts = postsData.posts.filter(post => !existingSlugs.has(post.slug));

            // Clone and combine posts, avoiding mutation
            const combinedPosts = [...posts, ...newUniquePosts];
            const sortedCombinedPosts = sortPosts([...combinedPosts]);
            
            // savePostsToLocalStorage([...sortedCombinedPosts]);
            setPosts([...sortedCombinedPosts]);

            // Update lastKey for pagination (only if it changes)
            if (!lastKey && postsData.lastKey) {
                set({ lastKey: postsData.lastKey });
            }

            return { posts: [...sortedCombinedPosts], lastKey: postsData.lastKey };
        } catch (error) {
            console.error("Error fetching posts:", error);
            return { posts: [], lastKey: "" };
        }
    };

    const findStartPostIndexByDate = (date: string, posts: PostItem[]): number => {
        return posts.findIndex(post => post.created_at === date);
    };

    const fetchPostsByPage = async (page: number, postsPerPage: number): Promise<PostItem[]> => {
        if (!page || !postsPerPage) return [];
        
        try {
            let postsData: { posts: PostItem[]; lastKey: string; } = { posts: [], lastKey: ''};

            postsData = await getPaginatedPosts(page, postsPerPage);

            if (postsData.posts.length > 0) {
                const existingSlugs = new Set(posts.map(post => post.slug));
                const newUniquePosts = postsData.posts.filter(post => !existingSlugs.has(post.slug));
            
                const combinedPosts = [...posts, ...newUniquePosts];
                const sortedCombinedPosts = sortPosts(combinedPosts);

                setPosts([...sortedCombinedPosts]);
                // savePostsToLocalStorage([...sortedCombinedPosts]);

                return sortedCombinedPosts;
            }

            return [];
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
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

    }
});
