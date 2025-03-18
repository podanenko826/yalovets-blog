import { NextResponse } from 'next/server';

import type { AuthorItem } from '@/types';

function transformAuthorData(data: any[]): AuthorItem[] {
    return data.map(author => ({
        email: author.email?.S,
        slug: author.slug?.S,
        bio: author.bio?.S,
        fullName: author.fullName?.S,
        profileImageUrl: author.profileImageUrl?.S,
        isGuest: author.isGuest?.BOOL,
        socialLinks: {
            Email: author.socialLinks?.M.Email?.S,
            GitHub: author.socialLinks?.M.GitHub?.S,
            Instagram: author.socialLinks?.M.Instagram?.S,
            LinkedIn: author.socialLinks?.M.LinkedIn?.S,
            X: author.socialLinks?.M.X?.S,
            Facebook: author.socialLinks?.M.Facebook?.S,
            Reddit: author.socialLinks?.M.Reddit?.S,
        },
        authorKey: author.authorKey?.S,
    }));
}

export const emptyAuthorObject: AuthorItem = {
    email: '',
    slug: '',
    bio: '',
    fullName: '',
    profileImageUrl: '',
    isGuest: false,
    socialLinks: {
        Email: '',
        GitHub: '',
        Instagram: '',
        LinkedIn: '',
        X: '',
        Facebook: '',
        Reddit: '',
    },
    authorKey: '',
};

export const getAuthors = async () => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/author`);
        const data = await response.json();
        let authors: any[] = [];

        if (data) {
            authors = [...authors, ...data];
        }

        const transformedAuthorData = transformAuthorData(authors);
        const authorData = transformedAuthorData.reverse();
        
        return authorData;
    } catch (err) {
        console.error('Failed to fetch authors from the database: ', err);
        return [];
    }
};

export const getAuthorByEmail = async (email: string): Promise<AuthorItem> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/author?email=${email}`);
        const data = await response.json();
        let author: any = {};

        if (data) {
            author = data;
        }

        return author;
    } catch (err) {
        console.error('Failed to fetch author from the database: ', err);
        return emptyAuthorObject;
    }
};

export const getAuthorByKey = async (authorKey: string): Promise<AuthorItem> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/author`);
        const data = await response.json();
        let authors: any = {};

        if (data) {
            authors = data;
        }
        const author = authors.find((author: any) => author.authorKey.S === authorKey);

        const transformedAuthor = transformAuthorData([author]);

        return transformedAuthor[0];
    } catch (err) {
        console.error('Failed to fetch author from the database: ', err);
        return emptyAuthorObject;
    }
};

export const getAuthorEmails = async (): Promise<string[]> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/author-list`);
        const data = await response.json();

        return data;
    } catch (err) {
        console.error('Failed to fetch author emails from the database.');
        return [];
    }
};

export const createAuthor = async (author: AuthorItem) => {
    const newAuthor = {
        email: author.email,
        slug: 'author-account',
        authorKey: '',
        bio: author.bio,
        fullName: author.fullName,
        profileImageUrl: author.profileImageUrl,
        isGuest: author.isGuest || false,
        socialLinks: {
            Email: author.socialLinks.Email || '',
            GitHub: author.socialLinks.GitHub,
            Instagram: author.socialLinks.Instagram || '',
            LinkedIn: author.socialLinks.LinkedIn || '',
            X: author.socialLinks.X || '',
            Facebook: author.socialLinks.Facebook || '',
            Reddit: author.socialLinks.Reddit || '',
        },
    };

    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/author`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAuthor),
    });

    const content = await response.json();

    return content;
};

export const updateAuthor = async (author: AuthorItem) => {
    const updatedAuthor = {
        email: author.email,
        slug: 'author-account',
        authorKey: '',
        bio: author.bio,
        fullName: author.fullName,
        profileImageUrl: author.profileImageUrl,
        isGuest: author.isGuest,
        socialLinks: {
            Email: author.socialLinks.Email || '',
            GitHub: author.socialLinks.GitHub || '',
            Instagram: author.socialLinks.Instagram || '',
            LinkedIn: author.socialLinks.LinkedIn || '',
            X: author.socialLinks.X || '',
            Facebook: author.socialLinks.Facebook || '',
            Reddit: author.socialLinks.Reddit || '',
        },
    };

    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/author`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAuthor),
    });

    const content = await response.json();

    return content;
};
