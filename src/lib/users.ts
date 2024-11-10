import {NextResponse} from 'next/server';

import type {AuthorItem} from '@/types';

function transformAuthorData(data: any[]): AuthorItem[] {
    return data.map(author => ({
        email: author.email?.S,
        slug: author.slug?.S,
        bio: author.bio?.S,
        fullName: author.fullName?.S,
        profileImageUrl: author.profileImageUrl?.S,
        socialLinks: {
            emailAddress: author.socialLinks?.M.emailAddress?.S,
            facebookUrl: author.socialLinks?.M.facebookUrl?.S,
            instagramUrl: author.socialLinks?.M.instagramUrl?.S,
            linkedInUrl: author.socialLinks?.M.linkedInUrl?.S,
        },
    }));
}

export const getUsers = async (email?: string) => {
    const baseUrl =
        typeof window === 'undefined'
            ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
            : '';

    try {
        if (email) {
            const response = await fetch(`${baseUrl}/api/user?email=${email}`);
            const data = await response.json();
            let user: any = {};

            if (data) {
                user = data;
            }
            return user;
        } else {
            const response = await fetch(`${baseUrl}/api/user`);
            const data = await response.json();
            let users: any[] = [];

            if (data) {
                users = [...users, ...data];
            }

            const transformedAuthorData = transformAuthorData(users);
            return transformedAuthorData;
        }
    } catch (err) {
        console.error('Failed to fetch users from the database: ', err);
        return [];
    }
};

export const getAuthorEmails = async (): Promise<String[]> => {
    const baseUrl =
        typeof window === 'undefined'
            ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
            : '';

    try {
        const response = await fetch(`${baseUrl}/api/author-list`);
        const data = await response.json();

        return data;
    } catch (err) {
        console.error('Failed to fetch author emails from the database.');
        return [];
    }
};

export const createUser = async (email: string) => {};
