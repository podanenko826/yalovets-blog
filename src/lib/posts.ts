import matter from 'gray-matter';
import moment from 'moment';
import { remark } from 'remark';
import html from 'remark-html';
import Cookies from 'js-cookie'; // Use js-cookie library for easy cookie handling

import { DescribeTableCommand, DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import type { AuthorItem, PaginationEntry, PaginationState, PostItem } from '@/types';
import { getAuthorEmails, getAuthorByEmail } from './authors';
import { request } from 'http';
import { updatePagination } from './pagination';

const AWS_REGION = process.env.NEXT_PUBLIC_REGION;
const DYNAMODB_TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME;
const ACCESS_KEY_ID = process.env.NEXT_PUBLIC_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY;

const dbClient = new DynamoDB({
    credentials: {
        accessKeyId: ACCESS_KEY_ID!,
        secretAccessKey: SECRET_ACCESS_KEY!,
    },
    region: 'eu-west-1',
});
const docClient = DynamoDBDocumentClient.from(dbClient);

function transformPostData(data: any[]): PostItem[] {
    return data.map(post => {
        return {
            email: post.email?.S,
            slug: post.slug?.S,
            title: post.title?.S,
            description: post.description?.S,
            imageUrl: post.imageUrl?.S,
            date: post.date?.S,
            modifyDate: post.modifyDate?.S,
            postType: post.postType?.S,
            tags: post.tags?.L ? post.tags.L.map((tag: { S: any }) => tag.S) : [],
            readTime: parseInt(post.readTime?.N || '0'),
            viewsCount: parseInt(post.viewsCount?.N || '0'),
            postGroup: post.postGroup?.S,
            sponsoredBy: post.sponsoredBy?.S,
            sponsorUrl: post.sponsorUrl?.S,
        };
    });
}

type FetchPostsResponse = {
    posts: PostItem[];
    lastKey: string; // The last key is the exclusive start key for pagination
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

export function sortPosts(postsData: PostItem[]): PostItem[] {
    const sortedPostsData = [...postsData].sort((a, b) => {
        const dateOne = moment(a.date);
        const dateTwo = moment(b.date);

        return dateTwo.diff(dateOne); // Descending order
    });

    return sortedPostsData;
}

export const getPaginatedPosts = async (page: number, limit: number, paginationData: PaginationState): Promise<{ posts: PostItem[]; lastKey: string }> => {
    if (!limit || limit > 50) return { posts: [], lastKey: '' };

    if (page > paginationData.totalPages) return { posts: [], lastKey: '' };

    if (Object.keys(paginationData.paginationData).length === 0) return { posts: [], lastKey: '' };

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const pageStartingKey = paginationData.paginationData[page].date;

        const response = await fetch(`${baseUrl}/api/posts?limit=${limit}&lastKey=${pageStartingKey}`, { cache: "force-cache" });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return { posts: [], lastKey: '' };
        }

        const data: FetchPostsResponse = await response.json();
        const transformedPostData = transformPostData(data.posts);
        const sortedPostsData = sortPosts(transformedPostData);

        savePostsToLocalStorage(sortedPostsData);

        return { posts: sortedPostsData, lastKey: data.lastKey };
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return { posts: [], lastKey: '' };
    }
};

export const getSortedPosts = async (limit: number, lastKey?: string): Promise<{ posts: PostItem[]; lastKey: string }> => {
    if (!limit || limit > 50) return { posts: [], lastKey: '' };

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const response = lastKey ? await fetch(`${baseUrl}/api/posts?limit=${limit}&lastKey=${lastKey}`, { cache: "force-cache" }) : await fetch(`${baseUrl}/api/posts?limit=${limit}`, { cache: "force-cache" });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return { posts: [], lastKey: '' };
        }

        const data: FetchPostsResponse = await response.json();

        const transformedPostData = transformPostData(data.posts);

        const sortedPostsData = sortPosts(transformedPostData);

        return { posts: sortedPostsData, lastKey: data.lastKey };
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return { posts: [], lastKey: '' };
    }
};

export const getAuthorPosts = async (email: string, limit: number, lastKey?: string): Promise<{ posts: PostItem[]; lastKey: string }> => {
    if (!email || !limit || limit > 50) return { posts: [], lastKey: '' };

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const response = lastKey ? await fetch(`${baseUrl}/api/posts-by-author?email=${email}&limit=${limit}&lastKey=${lastKey}`, { cache: "force-cache" }) : await fetch(`${baseUrl}/api/posts-by-author?email=${email}&limit=${limit}`, { cache: "force-cache" });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return { posts: [], lastKey: '' };
        }

        const data: FetchPostsResponse = await response.json();

        const transformedPostData = transformPostData(data.posts);

        const sortedPostsData = sortPosts(transformedPostData);

        return { posts: sortedPostsData, lastKey: data.lastKey };
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return { posts: [], lastKey: '' };
    }
};

export const getPopularPosts = async (limit: number): Promise<PostItem[]> => {
    if (!limit || limit > 50) return [];

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const response = await fetch(`${baseUrl}/api/posts-by-views?limit=${limit}`, { cache: "force-cache" });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return [];
        }

        const data: PostItem[] = await response.json();

        const transformedPostData = transformPostData(data);

        const sortedPostsData = sortPosts(transformedPostData);

        return sortedPostsData;
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return [];
    }
};

export const getPost = async (slug: string): Promise<PostItem> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
    const response = await fetch(`${baseUrl}/api/post-by-slug?slug=${slug}`, { method: 'GET', next: { revalidate: 3600 }, cache: "force-cache" });
    const data: PostItem[] = await response.json();

    let post: any[] = [];

    if (data.length > 0) {
        post = [...data];
    }
    const transformedPostData = transformPostData(post);

    return transformedPostData[0];
};

export const getPostsCount = async (): Promise<number> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
    const authorLengthResponse = await fetch(`${baseUrl}/api/author-list`, { cache: "force-cache" });
    const authorLength = (await authorLengthResponse.json()) || [];

    const params = {
        TableName: DYNAMODB_TABLE_NAME,
    };

    const command = new DescribeTableCommand(params);
    const response = await docClient.send(command);

    if (!response.Table?.ItemCount) return 0;

    const postsCount = Number(response.Table.ItemCount) - authorLength.length;

    return postsCount || 0;
};

export const formatPostDate = (date: Date) => {
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, '0');
    // const day = String(date.getDate()).padStart(2, '0');
    // return `${year}-${month}-${day}`;

    return moment(date).utc().toISOString();
};

export const getMDXContent = async (slug: string, date: string): Promise<{ slug: string; markdown: string }> => {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        // Fetch the markdown content
        const response = await fetch(`${baseUrl}/api/mdx?slug=${slug}&date=${date}`, {
            method: 'GET',
            cache: "force-cache",
        });
        if (!response.ok) {
            console.error('Failed to fetch markdown content');
            return { slug, markdown: '' };
        }

        const { content } = await response.json();

        const markdown = content;

        if (!markdown) {
            console.error('No content found for the given key.');
            return { slug, markdown: '' };
        }

        return {
            slug,
            markdown,
        };
    } catch (err) {
        console.error('Failed to fetch post from server: ', err);
        return { slug, markdown: '' };
    }
};

export const saveMDXContent = async (postTitle: string, markdown: string, date: string, slug?: string): Promise<{ content: string; slug: string }> => {
    if (!slug) {
        slug = `${postTitle
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replaceAll(' ', '-')
            .toLowerCase()}`;
    }

    const fileName = `${slug}`;

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        const response = await fetch(`${baseUrl}/api/mdx?date=${date}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName, content: markdown }),
        });

        if (!response.ok) {
            throw new Error('Failed to save file');
        }

        const content = await response.text();
        return { content, slug };
    } catch (error) {
        console.error('Error:', error);
    }

    return { content: '', slug: '' };
};

export const deleteMDXContent = async (slug: string, date: string): Promise<{ success: boolean; slug: string }> => {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        const response = await fetch(`${baseUrl}/api/mdx?slug=${slug}&date=${date}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete file');
        }

        const success = await response.json();
        return { success, slug };
    } catch (error) {
        console.error('Error:', error);
    }

    return { success: false, slug: '' };
};

export const rebuildPagination = async (): Promise<Record<number, PaginationEntry>> => {
    try {
        console.log('Started pagination rebuild.');

        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        const response = await fetch(`${baseUrl}/api/posts`, { method: 'GET' });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return {};
        }

        const data: FetchPostsResponse = await response.json();

        const transformedPostData = transformPostData(data.posts);

        const sortedPostsData = sortPosts(transformedPostData);

        let newPagination: Record<number, PaginationEntry> = {};

        for (let index = 0; index < sortedPostsData.length; index++) {
            if (index % 14 === 0) {
                // Every 14th post
                const post = sortedPostsData[index];
                newPagination[index / 14 + 1] = {
                    // +1 to make the page number 1-based
                    date: post.date as string,
                };
            }
        }

        console.log('New Pagination:', newPagination);

        if (Object.keys(newPagination).length === 0) return {};

        const result = updatePagination(newPagination);

        if (Object.keys(result).length > 0) console.log('Pagination rebuilt successfully.');

        return result;
    } catch (err) {
        console.error('Failed to rebuild pagination: ', err);
        return {};
    }
};

export const createPost = async (postData: Partial<PostItem>, markdown: string): Promise<{ slug: string; markdown: string }> => {
    const { email, title, description, date, imageUrl, readTime, postType, tags, sponsoredBy, sponsorUrl } = postData;
    let { slug } = postData;

    if (!email || !title || !description || !date || !imageUrl || !readTime || !postType) {
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

        const savedMarkdown = await saveMDXContent(title, markdown, date, slug);

        if (savedMarkdown.content === '' || savedMarkdown.slug === '') {
            console.error('Failed to save markdown content to file system. Post creation aborted.');
            return { slug: '', markdown: '' };
        }

        const newPost: PostItem = {
            email,
            slug,
            title,
            description,
            imageUrl,
            date,
            modifyDate: date,
            postType,
            tags: tags || [],
            readTime,
            viewsCount: 0,
            postGroup: 'ALL_POSTS',
            sponsoredBy,
            sponsorUrl,
        };

        const response = await fetch(`${baseUrl}/api/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        });

        if (!response.ok) {
            console.error('Failed to upload post metadata to DB. Post creation aborted.');
            await deleteMDXContent(slug, newPost.date as string);
            return { slug: '', markdown: '' }; // Return a failed result
        }

        await rebuildPagination();

        console.log('Post successfully uploaded:', newPost);
        return { slug, markdown: savedMarkdown.slug };
    } catch (error) {
        console.error('Failed to upload post:', error);
    }

    return { slug: '', markdown: '' };
};

export const updatePost = async (postData: Partial<PostItem>, markdown: string): Promise<{ slug: string; markdown: string }> => {
    const { email, slug, title, description, date, modifyDate, imageUrl, readTime, postType, viewsCount, tags, sponsoredBy, sponsorUrl } = postData;

    if (!email || !slug || !title || !description || !date || !imageUrl || !readTime || !postType) {
        console.error('Recieved invalid or incomplete post data');
        return { slug: '', markdown: '' };
    }

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const savedMarkdown = await saveMDXContent(title, markdown, date, slug);

        if (savedMarkdown.content === '' || savedMarkdown.slug === '') {
            console.error('Failed to save markdown content to file system. Post updating aborted.');
            return { slug: '', markdown: '' };
        }

        const updatedPost: PostItem = {
            email,
            slug,
            title,
            description,
            imageUrl,
            date,
            modifyDate: modifyDate || moment.utc().toISOString(),
            postType,
            tags: tags || [],
            readTime,
            viewsCount: viewsCount || 0,
            postGroup: 'ALL_POSTS',
            sponsoredBy,
            sponsorUrl,
        };

        const response = await fetch(`${baseUrl}/api/posts`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPost),
        });

        if (!response.ok) {
            console.error('Failed to upload post metadata to DB. Post creation aborted.');
            return { slug: '', markdown: '' }; // Return a failed result
        }

        console.log('Post successfully updated:', updatedPost);
        return { slug, markdown: savedMarkdown.slug };
    } catch (error) {
        console.error('Failed to update post:', error);
    }

    return { slug: '', markdown: '' };
};

export const deletePost = async (postData: { email: string; slug: string; date: string }): Promise<string> => {
    try {
        const { email, slug } = postData;

        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        // Check that the required slug is provided
        if (!email) {
            console.error('Missing required identifier: email.');
            return '';
        }
        if (!slug) {
            console.error('Missing required identifier: slug.');
            return '';
        }

        const response = await fetch(`${baseUrl}/api/posts`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, slug }),
        });

        if (!response.ok) {
            console.error('Failed to delete post metadata to DB. Post deleting aborted.');
            return ''; // Return empty slug
        }
        console.log('Post successfully deleted:', slug);

        // Deletes the Article folder in file system after successful metadata deletion
        const deletedPost = await deleteMDXContent(slug, postData.date);

        if (!deletedPost.success || !deletedPost.slug) {
            return '';
        }

        await rebuildPagination();

        return deletedPost.slug;
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

        const authorData = await getAuthorByEmail(postData.email);

        const mdxContent = await getMDXContent(slug, postData.date as string);
        const markdown = mdxContent.markdown;

        if (!mdxContent) {
            throw new Error('No content found for the given key.');
        }
        return {
            slug,
            markdown,
            postData,
            authorData,
        };
    } catch (err) {
        console.error('Failed to fetch post from server: ', err);
        return {
            slug,
            markdown: '',
            postData: {
                email: '',
                slug: '',
                title: '',
                description: '',
                postGroup: '',
            },
            authorData: {
                email: '',
                slug: '',
                fullName: '',
                authorKey: '',
                profileImageUrl: '',
                bio: '',
                isGuest: false,
                socialLinks: {
                    emailAddress: '',
                    githubUrl: '',
                    instagramUrl: '',
                    linkedInUrl: '',
                    xUrl: '',
                    facebookUrl: '',
                    redditUrl: '',
                },
            },
        };
    }
};

const VIEW_COOKIE_NAME = 'viewed_articles';
const COOKIE_EXPIRATION_DAYS = 1; // Cookie expires in 1 day

async function incrementViewCount(email: string, slug: string) {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const response = await fetch(`${baseUrl}/api/increment-view-count`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, slug }),
        });

        if (!response.ok) {
            throw new Error('Failed to increment view count');
        }
    } catch (error) {
        console.error('Error incrementing view count:', error);
    }
}

export async function trackView(email: string, slug: string) {
    // Read the existing viewed articles from the cookie
    const viewedArticles = Cookies.get(VIEW_COOKIE_NAME) ? JSON.parse(Cookies.get(VIEW_COOKIE_NAME) as string) : [];

    // Check if this article has already been viewed
    if (viewedArticles.includes(slug)) {
        return;
    }

    // Add the article to the viewed list
    viewedArticles.push(slug);
    Cookies.set(VIEW_COOKIE_NAME, JSON.stringify(viewedArticles), {
        expires: COOKIE_EXPIRATION_DAYS,
        path: '/', // Ensure cookie is accessible site-wide
    });

    // Increment the view count in DynamoDB
    await incrementViewCount(email, slug);
}
