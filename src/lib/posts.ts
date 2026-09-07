import moment from 'moment';
import Cookies from 'js-cookie';

import type { AuthorItem, PostItem } from '@/types';
import { getAuthorEmails, getAuthorByEmail } from './authors';

export const postTypes = [
    'Article',
    'Review',
    'Guide',
    'News'
];

type FetchPostsResponse = {
    posts: PostItem[];
    lastKey: string;
};

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

// Utility to recursively unwrap DynamoDB format ({ S: "string" }, { N: "123" }, { M: {...} })

export function sortPosts(postsData: PostItem[]): PostItem[] {
    const unwrappedPosts = Array.isArray(postsData) ? postsData : [];
    
    const sortedPostsData = [...unwrappedPosts].sort((a, b) => {
        const dateOne = moment(a.created_at);
        const dateTwo = moment(b.created_at);

        return dateTwo.diff(dateOne); // Descending order
    });

    return sortedPostsData;
}

export const getPaginatedPosts = async (page: number, limit: number): Promise<{ posts: PostItem[]; lastKey: string }> => {
    if (!limit || limit > 50) return { posts: [], lastKey: '' };

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        const offset = (page - 1) * limit;

        const response = await fetch(`${baseUrl}/api/posts?limit=${limit}&offset=${offset}`, { next: { revalidate: 0 } });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return { posts: [], lastKey: '' };
        }

        const data = await response.json();
        const posts = Array.isArray(data) ? data : (data.posts || []);
        const sortedPostsData = sortPosts(posts);

        return { posts: sortedPostsData, lastKey: '' };
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return { posts: [], lastKey: '' };
    }
};

export const getSortedPosts = async (limit: number, lastKey?: string): Promise<{ posts: PostItem[]; lastKey: string }> => {
    if (!limit || limit > 50) return { posts: [], lastKey: '' };

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        // For simplicity, converting lastKey usage to just limit fetching since lastKey implies cursor pagination
        const response = await fetch(`${baseUrl}/api/posts?limit=${limit}`, { next: { revalidate: 0 } });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return { posts: [], lastKey: '' };
        }

        const data = await response.json();
        const posts = Array.isArray(data) ? data : (data.posts || []);
        const sortedPostsData = sortPosts(posts);

        return { posts: sortedPostsData, lastKey: '' };
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return { posts: [], lastKey: '' };
    }
};

export const getAuthorPosts = async (email: string, limit: number, offset: number = 0): Promise<{ posts: PostItem[]; lastKey: string }> => {
    if (!email || !limit || limit > 50) return { posts: [], lastKey: '' };

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const response = await fetch(`${baseUrl}/api/posts-by-author?email=${email}&limit=${limit}&offset=${offset}`, { next: { revalidate: 0 } });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return { posts: [], lastKey: '' };
        }

        const data = await response.json();
        const posts = data.posts || [];
        const sortedPostsData = sortPosts(posts);

        return { posts: sortedPostsData, lastKey: '' };
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return { posts: [], lastKey: '' };
    }
};

export const getPopularPosts = async (limit: number): Promise<PostItem[]> => {
    if (!limit || limit > 50) return [];

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const response = await fetch(`${baseUrl}/api/posts-by-views?limit=${limit}`, { next: { revalidate: 0 } });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return [];
        }

        const data: PostItem[] = await response.json();
        const sortedPostsData = sortPosts(data);

        return sortedPostsData;
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return [];
    }
};

export const getPostsByTag = async (tag: string, limit: number, offset: number = 0): Promise<{ posts: PostItem[]; lastKey: string }> => {
    if (!tag || !limit || limit > 50) return { posts: [], lastKey: '' };

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const response = await fetch(`${baseUrl}/api/posts-by-tag?tag=${tag}&limit=${limit}&offset=${offset}`, { next: { revalidate: 0 } });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return { posts: [], lastKey: '' };
        }

        const data = await response.json();
        const posts = data.posts || [];
        const sortedPostsData = sortPosts(posts);

        return { posts: sortedPostsData, lastKey: '' };
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return { posts: [], lastKey: '' };
    }
};

export const getPost = async (slug: string): Promise<PostItem> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
    
    const response = await fetch(`${baseUrl}/api/post-by-slug?slug=${slug}`, { next: { revalidate: 0 } });
    const data: PostItem[] = await response.json();
    
    const unwrappedData = Array.isArray(data) ? data : [data];
    return unwrappedData[0] || {} as PostItem;
};

export const getPostsCount = async (): Promise<number> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
    
    try {
        const response = await fetch(`${baseUrl}/api/posts`, { method: 'GET', next: { revalidate: 0 } });
        const posts = await response.json();
        return Array.isArray(posts) ? posts.length : (posts.posts?.length || 0);
    } catch (err) {
        console.error('Failed to count posts:', err);
        return 0;
    }
};

export const formatPostDate = (date: Date) => {
    return moment(date).utc().toISOString();
};





export const createPost = async (postData: Partial<PostItem>, markdown: string, email: string): Promise<{ slug: string; markdown: string }> => {
    const { title, description, created_at, image_url, read_time, post_type, sponsored_by, sponsor_url, tags } = postData;
    let { slug } = postData;

    if (!title || !description || !created_at || !image_url || !read_time || !post_type) {
        console.error('Recieved invalid or incomplete post data');
        return { slug: '', markdown: '' };
    }

    if (!slug) {
        slug = `${title
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replaceAll(' ', '-')
            .toLowerCase()}`;
    }

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const authorResponse = await fetch(`${baseUrl}/api/author?email=${email}`);
        const author = await authorResponse.json();
        
        if (!author || !author.id) {
            throw new Error('Author not found');
        }

        

        const newPost = {
            author_id: author.id,
            slug,
            title,
            description,
            content: markdown,
            image_url,
            created_at,
            post_type,
            read_time,
            views_count: 0,
            sponsored_by,
            sponsor_url,
            tags,
        };

        const response = await fetch(`${baseUrl}/api/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost),
        });

        if (!response.ok) {
            
            return { slug: '', markdown: '' };
        }


        return { slug, markdown };
    } catch (error) {
        console.error('Failed to upload post:', error);
    }

    return { slug: '', markdown: '' };
};

export const updatePost = async (postData: Partial<PostItem>, markdown: string): Promise<{ slug: string; markdown: string }> => {
    const { id, slug, title, description, created_at, updated_at, image_url, read_time, post_type, views_count, sponsored_by, sponsor_url, tags } = postData;

    if (!id || !slug || !title || !created_at || read_time === undefined || read_time === null || !post_type) {
        console.error('Recieved invalid or incomplete post data:', { id, slug, title, description, created_at, image_url, read_time, post_type });
        return { slug: '', markdown: '' };
    }

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        

        const updatedPost = {
            id,
            slug,
            title,
            description,
            content: markdown,
            image_url,
            created_at,
            updated_at: updated_at || moment.utc().toISOString(),
            post_type,
            read_time,
            views_count: views_count || 0,
            sponsored_by,
            sponsor_url,
            tags,
        };

        const response = await fetch(`${baseUrl}/api/posts`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPost),
        });

        if (!response.ok) {
            return { slug: '', markdown: '' };
        }

        return { slug, markdown };
    } catch (error) {
        console.error('Failed to update post:', error);
    }

    return { slug: '', markdown: '' };
};

export const deletePost = async (postData: { id: string; slug: string; created_at: string }): Promise<string> => {
    try {
        const { id, slug, created_at } = postData;

        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        if (!id || !slug) return '';

        const response = await fetch(`${baseUrl}/api/posts`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) return '';

        



        return slug;
    } catch (error) {
        console.error('Failed to delete post:', error);
        return '';
    }
};

export const getPostsData = async (
    slug: string
): Promise<{
    slug: string;
    markdown: string;
    postData: PostItem;
    authorData: AuthorItem;
}> => {
    try {
        const postData = await getPost(slug);

        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        const authorResponse = await fetch(`${baseUrl}/api/author?id=${postData.author_id}`);
        const authorData = await authorResponse.json();

        const markdown = postData.content || '';

        return {
            slug,
            markdown,
            postData,
            authorData: authorData || {} as AuthorItem,
        };
    } catch (err) {
        console.error('Failed to fetch post from server: ', err);
        return {
            slug,
            markdown: '',
            postData: {} as PostItem,
            authorData: {} as AuthorItem,
        };
    }
};

const VIEW_COOKIE_NAME = 'viewed_articles';
const COOKIE_EXPIRATION_DAYS = 1;

async function incrementViewCount(id: string) {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const response = await fetch(`${baseUrl}/api/increment-view-count`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            throw new Error('Failed to increment view count');
        }
    } catch (error) {
        console.error('Error incrementing view count:', error);
    }
}

export async function trackView(id: string, slug: string) {
    const viewedArticles = Cookies.get(VIEW_COOKIE_NAME) ? JSON.parse(Cookies.get(VIEW_COOKIE_NAME) as string) : [];

    if (viewedArticles.includes(slug)) {
        return;
    }

    viewedArticles.push(slug);
    Cookies.set(VIEW_COOKIE_NAME, JSON.stringify(viewedArticles), {
        expires: COOKIE_EXPIRATION_DAYS,
        path: '/',
    });

    await incrementViewCount(id);
}
