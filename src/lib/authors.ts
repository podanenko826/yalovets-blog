import { NextResponse } from 'next/server';

import type { AuthorItem } from '@/types';

function transformAuthorData(data: any[]): AuthorItem[] {
    return data.map(author => ({
        email: author.email?.S,
        slug: author.slug?.S,
        bio: author.bio?.S,
        fullName: author.fullName?.S,
        profileImageUrl: author.profileImageUrl?.S,
        socialLinks: {
            emailAddress: author.socialLinks?.M.emailAddress?.S,
            githubUrl: author.socialLinks?.M.githubUrl?.S,
            instagramUrl: author.socialLinks?.M.instagramUrl?.S,
            linkedInUrl: author.socialLinks?.M.linkedInUrl?.S,
            xUrl: author.socialLinks?.M.xUrl?.S,
            facebookUrl: author.socialLinks?.M.facebookUrl?.S,
            redditUrl: author.socialLinks?.M.redditUrl?.S,
        },
        authorKey: author.authorKey?.S,
    }));
}

const emptyAuthorObject: AuthorItem = {
    email: '',
    slug: '',
    bio: '',
    fullName: '',
    profileImageUrl: '',
    socialLinks: {
        emailAddress: '',
        githubUrl: '',
        instagramUrl: '',
        linkedInUrl: '',
        xUrl: '',
        facebookUrl: '',
        redditUrl: '',
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

export const getAuthorEmails = async (): Promise<String[]> => {
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
        socialLinks: {
            emailAddress: author.socialLinks.emailAddress,
            githubUrl: author.socialLinks.githubUrl,
            instagramUrl: author.socialLinks.instagramUrl,
            linkedInUrl: author.socialLinks.linkedInUrl,
            xUrl: author.socialLinks.xUrl,
            facebookUrl: author.socialLinks.facebookUrl,
            redditUrl: author.socialLinks.redditUrl,
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
        socialLinks: {
            emailAddress: author.socialLinks.emailAddress,
            githubUrl: author.socialLinks.githubUrl,
            instagramUrl: author.socialLinks.instagramUrl,
            linkedInUrl: author.socialLinks.linkedInUrl,
            xUrl: author.socialLinks.xUrl,
            facebookUrl: author.socialLinks.facebookUrl,
            redditUrl: author.socialLinks.redditUrl,
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
