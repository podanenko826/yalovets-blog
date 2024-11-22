import matter from 'gray-matter';
import moment from 'moment';
import {remark} from 'remark';
import html from 'remark-html';

import {DynamoDB, QueryCommand} from '@aws-sdk/client-dynamodb';
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import type {AuthorItem, PostItem} from '@/types';
import {getAuthorEmails, getUsers} from './users';
import {request} from 'http';

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
        readTime: parseInt(post.readTime?.N || '0'),
        viewsCount: parseInt(post.viewsCount?.N || '0'),
    }));
}

export const getSortedPosts = async (): Promise<PostItem[]> => {
    const authorEmails: any = await getAuthorEmails();

    if (!authorEmails) {
        return [];
    }

    const baseUrl =
        typeof window === 'undefined'
            ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
            : '';

    let allPosts: any[] = [];

    for (const authorEmail of authorEmails) {
        try {
            const params = {
                TableName: DYNAMODB_TABLE_NAME, // Replace with your actual posts table name
                KeyConditionExpression: 'email = :email', // Querying by slug in the GSI
                ExpressionAttributeValues: {
                    ':email': {S: authorEmail}, // The email value to search for
                },
            };

            const command = new QueryCommand(params);
            const result = await docClient.send(command);
            const data = result.Items;

            const filteredPost = data?.filter(
                post => post.slug?.S !== 'author-account'
            );

            if (filteredPost && filteredPost.length > 0) {
                allPosts = [...allPosts, ...filteredPost];
            }
        } catch (err) {
            console.error('Error fetching content: ', err);
        }
    }

    const transformedPostData = transformPostData(allPosts);

    const sortedPostsData = transformedPostData.sort((a, b) => {
        const format = 'DD-MM-YYYY';
        const dateOne = moment(a.date, format);
        const dateTwo = moment(b.date, format);

        if (dateOne.isBefore(dateTwo)) {
            return -1;
        } else if (dateTwo.isAfter(dateOne)) {
            return 1;
        } else {
            return 0;
        }
    });
    return sortedPostsData.reverse();
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
                    ':email': {S: authorEmail}, // The email value to search for
                    ':slug': {S: slug},
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

export const getLatestPost = async (): Promise<PostItem> => {
    const sortedPosts = await getSortedPosts();
    const latestArticle: PostItem = sortedPosts[0];

    return latestArticle;
};

export const getRecentPosts = async (): Promise<PostItem[]> => {
    const sortedPosts = await getSortedPosts();

    const recentPosts: PostItem[] = sortedPosts.slice(0, 9);

    return recentPosts;
};

export const getPopularPosts = async (): Promise<PostItem[]> => {
    const sortedPosts = await getSortedPosts();

    // Sort posts by viewsCount in descending order
    const sortedByViews = sortedPosts
        .filter(post => post.viewsCount !== undefined) // Filter out posts with undefined viewsCount
        .sort((a, b) => (b.viewsCount ?? 0) - (a.viewsCount ?? 0));

    const mostPopularPosts = sortedByViews.slice(0, 3); // Returs an array of 3 most popular posts by views
    return mostPopularPosts;
};

export const formatPostDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export const getMDXContent = async (
    slug: string
): Promise<{slug: string; markdown: string}> => {
    try {
        const baseUrl =
            typeof window === 'undefined'
                ? process.env.NEXT_PUBLIC_API_BASE_URL ||
                  'http://localhost:3000'
                : '';

        // Fetch the markdown content
        const response = await fetch(`${baseUrl}/api/mdx?slug=${slug}`, {
            method: 'GET',
        });
        if (!response.ok) {
            console.error('Failed to fetch markdown content');
            return {slug, markdown: ''};
        }

        const {content} = await response.json();

        const markdown = content;

        if (!markdown) {
            console.error('No content found for the given key.');
            return {slug, markdown: ''};
        }

        return {
            slug,
            markdown,
        };
    } catch (err) {
        console.error('Failed to fetch post from server: ', err);
        return {slug, markdown: ''};
    }
};

export const saveMDXContent = async (
    postTitle: string,
    markdown: string,
    slug?: string
) => {
    if (!slug) {
        slug = `${postTitle
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replaceAll(' ', '-')
            .toLowerCase()}`;
    }

    const fileName = `${slug}.mdx`;

    try {
        const response = await fetch('/api/mdx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({fileName, content: markdown}),
        });

        if (!response.ok) {
            throw new Error('Failed to save file');
        }

        const data = await response.text();
        return slug;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const createPost = async (
    postData: Partial<PostItem>,
    markdown: string
) => {
    const {
        email,
        description,
        date,
        modifyDate,
        imageUrl,
        readTime,
        viewsCount,
    } = postData;
    let {slug, title} = postData;

    if (!email || !title || !description || !date || !modifyDate) {
        throw new Error(
            'Missing required post data: email, slug, title, description, date or modifyDate.'
        );
    }

    if (!slug) {
        if (title) {
            slug = `${title
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .replaceAll(' ', '-')
                .toLowerCase()}`;
        } else {
            throw new Error('Missing required slug identifier.');
        }
    }

    // Ensure the fileName does not exceed 255 characters, including the '.mdx' extension
    const MAX_FILENAME_LENGTH = 150;
    const fileExtension = '.mdx';
    const ellipsis = '...';

    // Truncate the slug if the full fileName would exceed the limit
    if (slug.length + fileExtension.length > MAX_FILENAME_LENGTH) {
        slug = slug.slice(
            0,
            MAX_FILENAME_LENGTH - fileExtension.length - ellipsis.length
        );

        title =
            title.slice(
                0,
                MAX_FILENAME_LENGTH - fileExtension.length - ellipsis.length
            ) + ellipsis;
    }

    const savedPostSlug = saveMDXContent(title, markdown, slug);

    const newPost: PostItem = {
        email,
        slug,
        title,
        description,
        imageUrl: imageUrl ?? '', // Optional imageUrl, default to an empty string if not provided
        date: date,
        modifyDate: modifyDate, // Automatically generated modifyDate
        readTime: readTime || 0, // Default readTime
        viewsCount: viewsCount || 0, // Default viewsCount
    };

    const command = new PutCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Item: newPost,
    });

    try {
        const response = await docClient.send(command);
        console.log('Post successfully uploaded:', newPost);
        return savedPostSlug;
    } catch (error) {
        console.error('Failed to upload post:', error);
    }
};

export const deletePost = async (postData: {email: string; slug: string}) => {
    const {email, slug} = postData;
    // Check that the required slug is provided
    if (!slug) {
        throw new Error('Missing required identifier: slug.');
    }

    // Create the delete command with the specified TableName and Key (slug in this case)
    const command = new DeleteCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: {
            email,
            slug,
        },
    });

    try {
        const response = await docClient.send(command);
        console.log('Post successfully deleted:', slug);
    } catch (error) {
        console.error('Failed to delete post:', error);
        throw new Error('Error deleting post.');
    }

    const response = await fetch(`/api/mdx?slug=${slug}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete file');
    }
    return slug;
};

export const getArticleData = async (
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

        const authorData = await getUsers(postData.email);

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
                profileImageUrl: '',
                bio: '',
                socialLinks: {
                    emailAddress: '',
                    linkedInUrl: '',
                    instagramUrl: '',
                    facebookUrl: '',
                },
            },
        };
    }
};
