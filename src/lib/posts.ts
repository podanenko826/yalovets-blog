import matter from 'gray-matter';
import moment from 'moment';
import { remark } from 'remark';
import html from 'remark-html';
import Cookies from 'js-cookie'; // Use js-cookie library for easy cookie handling

import { DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import type { AuthorItem, PostItem } from '@/types';
import { getAuthorEmails, getAuthorByEmail } from './authors';
import { request } from 'http';

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
    return data.map(post => ({
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
    }));
}

export const getSortedPosts = async () => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/post`);
        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            throw new Error('Failed to fetch posts');
        }

        const data = await response.json();

        let posts: any[] = [];

        if (data) {
            posts = [...posts, ...data];
        }

        const transformedPostData = transformPostData(data);

        const sortedPostsData = transformedPostData.sort((a, b) => {
            const format = 'DD-MM-YYYY';
            const dateOne = moment(a.date, format);
            const dateTwo = moment(b.date, format);

            return dateTwo.diff(dateOne); // Descending order
        });

        console.log(sortedPostsData);

        return sortedPostsData;
    } catch (err) {
        console.error('Failed to fetch posts from the database: ', err);
        return [];
    }
};

export const getPost = async (slug: string): Promise<PostItem> => {
    const authorEmails: any = await getAuthorEmails();

    let post: any[] = [];

    for (const authorEmail of authorEmails) {
        try {
            const params = {
                TableName: DYNAMODB_TABLE_NAME, // Replace with your actual posts table name
                KeyConditionExpression: 'email = :email AND slug = :slug', // Querying by slug in the GSI
                ExpressionAttributeValues: {
                    ':email': { S: authorEmail }, // The email value to search for
                    ':slug': { S: slug },
                },
            };

            const command = new QueryCommand(params);
            const result = await docClient.send(command);
            const data = result.Items;

            if (data && data.length > 0) {
                post = [...post, ...data];
            }
        } catch (err) {
            console.error('Error fetching content: ', err);
        }
    }

    const transformedPostData = transformPostData(post);

    return transformedPostData[0];
};

export const formatPostDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export const getMDXContent = async (slug: string): Promise<{ slug: string; markdown: string }> => {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        // Fetch the markdown content
        const response = await fetch(`${baseUrl}/api/mdx?slug=${slug}`, {
            method: 'GET',
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

export const saveMDXContent = async (postTitle: string, markdown: string, slug?: string): Promise<{ content: string; slug: string }> => {
    if (!slug) {
        slug = `${postTitle
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replaceAll(' ', '-')
            .toLowerCase()}`;
    }

    const fileName = `${slug}`;

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        const response = await fetch(`${baseUrl}/api/mdx`, {
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
        return {content, slug};
    } catch (error) {
        console.error('Error:', error);
    }

    return {content: '', slug: ''};
};

export const deleteMDXContent = async (slug: string): Promise<{ success: boolean; slug: string }> => {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        const response = await fetch(`${baseUrl}/api/mdx?slug=${slug}`, {
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

    return {success: false, slug: ''};
};

export const createPost = async (postData: Partial<PostItem>, markdown: string): Promise<{ slug: string; markdown: string }> => {
    const { email, title, description, date, imageUrl, readTime, postType, tags } = postData;
    let { slug } = postData;
    
    if (!email || !title || !description || !date || !imageUrl || !readTime || !postType) {
        console.error('Recieved invalid or incomplete post data');
        return {slug: '', markdown: ''};
    }

    if (!slug) {
        slug = `${title
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replaceAll(' ', '-')
            .toLowerCase()}`;
    }

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const savedMarkdown = await saveMDXContent(title, markdown, slug);

        if (savedMarkdown.content === '' || savedMarkdown.slug === '') {
            console.error('Failed to save markdown content to file system. Post creation aborted.')
            return { slug: '', markdown: '' };
        }

        const newPost: PostItem = {
            email,
            slug: slug,
            title,
            description,
            imageUrl,
            date: date,
            modifyDate: date,
            postType: postType,
            tags: tags || [],
            readTime: readTime,
            viewsCount: 0,
        };
        

        const response = await fetch(`${baseUrl}/api/post`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        });

        if (!response.ok) {
            console.error('Failed to upload post metadata to DB. Post creation aborted.');
            await deleteMDXContent(slug);
            return { slug: '', markdown: '' };  // Return a failed result
        }

        console.log('Post successfully uploaded:', newPost);
        return {slug, markdown: savedMarkdown.slug};
    } catch (error) {
        console.error('Failed to upload post:', error);
    }

    return {slug: '', markdown: ''};
};

export const deletePost = async (postData: { email: string; slug: string }): Promise<string> => {
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

        const response = await fetch(`${baseUrl}/api/post`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, slug }),
        })

        if (!response.ok) {
            console.error('Failed to delete post metadata to DB. Post deleting aborted.');
            return ''; // Return empty slug
        }
        console.log('Post successfully deleted:', slug);
        
        // Deletes the Article folder in file system after successful metadata deletion
        const deletedPost = await deleteMDXContent(slug);

        if (!deletedPost.success || !deletedPost.slug) {
            return '';
        }

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
        const mdxContent = await getMDXContent(slug);
        if (!mdxContent) {
            throw new Error('No content found for the given key.');
        }
        const markdown = mdxContent.markdown;

        const postData = await getPost(slug);

        const authorData = await getAuthorByEmail(postData.email);

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
            },
            authorData: {
                email: '',
                slug: '',
                fullName: '',
                authorKey: '',
                profileImageUrl: '',
                bio: '',
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

        const response = await fetch(`${baseUrl}/api/incrementViewCount`, {
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
