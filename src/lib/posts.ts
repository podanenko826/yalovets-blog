import moment from 'moment';
import Cookies from 'js-cookie';

import type { AuthorItem, PostItem } from '@/types';
import { supabase } from '@/lib/supabase';
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

const formatPostTags = (post: any): PostItem => {
    if (!post) return post;
    const tags = post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || post.tags || [];
    const formatted = { ...post, tags };
    delete formatted.post_tags;
    return formatted as PostItem;
};

export const getPaginatedPosts = async (page: number, limit: number): Promise<{ posts: PostItem[]; lastKey: string }> => {
    if (!limit || limit > 50) return { posts: [], lastKey: '' };

    try {
        const offset = (page - 1) * limit;
        const { data: postsData, error } = await supabase
            .from('posts')
            .select('*, post_tags ( tags (*) )')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Failed to fetch posts from Supabase:', error);
            return { posts: [], lastKey: '' };
        }

        const formattedPosts = (postsData || []).map(formatPostTags);
        const sortedPostsData = sortPosts(formattedPosts);

        return { posts: sortedPostsData, lastKey: '' };
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return { posts: [], lastKey: '' };
    }
};

export const getSortedPosts = async (limit: number, lastKey?: string): Promise<{ posts: PostItem[]; lastKey: string }> => {
    if (!limit || limit > 50) return { posts: [], lastKey: '' };

    try {
        let query = supabase
            .from('posts')
            .select('*, post_tags ( tags (*) )')
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data: postsData, error } = await query;

        if (error) {
            console.error('Failed to fetch sorted posts from Supabase:', error);
            return { posts: [], lastKey: '' };
        }

        const formattedPosts = (postsData || []).map(formatPostTags);
        const sortedPostsData = sortPosts(formattedPosts);

        return { posts: sortedPostsData, lastKey: '' };
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return { posts: [], lastKey: '' };
    }
};

export const getAuthorPosts = async (email: string, limit: number, offset: number = 0): Promise<{ posts: PostItem[]; lastKey: string }> => {
    if (!email || !limit || limit > 50) return { posts: [], lastKey: '' };

    try {
        const { data: author, error: authorError } = await supabase
            .from('authors')
            .select('id')
            .eq('email', email)
            .single();

        if (authorError || !author) {
            return { posts: [], lastKey: '' };
        }

        let query = supabase
            .from('posts')
            .select('*, post_tags ( tags (*) )')
            .eq('author_id', author.id)
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.range(offset, offset + limit - 1);
        }

        const { data: postsData, error: postsError } = await query;

        if (postsError) {
            console.error('Failed to fetch author posts from Supabase:', postsError);
            return { posts: [], lastKey: '' };
        }

        const formattedPosts = (postsData || []).map(formatPostTags);
        const sortedPostsData = sortPosts(formattedPosts);

        return { posts: sortedPostsData, lastKey: '' };
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return { posts: [], lastKey: '' };
    }
};

export const getPopularPosts = async (limit: number): Promise<PostItem[]> => {
    if (!limit || limit > 50) return [];

    try {
        let query = supabase
            .from('posts')
            .select('*, post_tags ( tags (*) )')
            .order('views_count', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data: postsData, error } = await query;

        if (error) {
            console.error('Failed to fetch popular posts from Supabase:', error);
            return [];
        }

        const formattedPosts = (postsData || []).map(formatPostTags);
        return sortPosts(formattedPosts);
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return [];
    }
};

export const getPostsByTag = async (tag: string, limit: number, offset: number = 0): Promise<{ posts: PostItem[]; lastKey: string }> => {
    if (!tag || !limit || limit > 50) return { posts: [], lastKey: '' };

    try {
        const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .select('id')
            .eq('tag', tag)
            .single();

        if (tagError || !tagData) {
            return { posts: [], lastKey: '' };
        }

        const { data: postTags, error: postTagsError } = await supabase
            .from('post_tags')
            .select('post_id')
            .eq('tag_id', tagData.id);

        if (postTagsError || !postTags || postTags.length === 0) {
            return { posts: [], lastKey: '' };
        }

        const postIds = postTags.map(pt => pt.post_id);

        let query = supabase
            .from('posts')
            .select('*, post_tags ( tags (*) )')
            .in('id', postIds)
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.range(offset, offset + limit - 1);
        }

        const { data: postsData, error: postsError } = await query;

        if (postsError) {
            console.error('Failed to fetch posts by tag from Supabase:', postsError);
            return { posts: [], lastKey: '' };
        }

        const formattedPosts = (postsData || []).map(formatPostTags);
        return { posts: sortPosts(formattedPosts), lastKey: '' };
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return { posts: [], lastKey: '' };
    }
};

export const getPost = async (slug: string): Promise<PostItem> => {
    if (!slug) return {} as PostItem;

    try {
        const { data: post, error } = await supabase
            .from('posts')
            .select('*, post_tags ( tags (*) )')
            .eq('slug', slug)
            .single();

        if (error || !post) {
            return {} as PostItem;
        }

        return formatPostTags(post);
    } catch (err) {
        console.error('Failed to fetch post from Supabase:', err);
        return {} as PostItem;
    }
};

export const getAdjacentPosts = async (createdAt: string): Promise<{ prevPost: PostItem | null; nextPost: PostItem | null }> => {
    if (!createdAt) return { prevPost: null, nextPost: null };

    try {
        const { data: prevData } = await supabase
            .from('posts')
            .select('slug, title, created_at')
            .gt('created_at', createdAt)
            .order('created_at', { ascending: true })
            .limit(1);

        const { data: nextData } = await supabase
            .from('posts')
            .select('slug, title, created_at')
            .lt('created_at', createdAt)
            .order('created_at', { ascending: false })
            .limit(1);

        return {
            prevPost: prevData && prevData.length > 0 ? (prevData[0] as unknown as PostItem) : null,
            nextPost: nextData && nextData.length > 0 ? (nextData[0] as unknown as PostItem) : null
        };
    } catch (err) {
        console.error('Failed to fetch adjacent posts: ', err);
        return { prevPost: null, nextPost: null };
    }
};

export const getPostsCount = async (): Promise<number> => {
    try {
        const { count, error } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Failed to count posts:', error);
            return 0;
        }
        return count || 0;
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
