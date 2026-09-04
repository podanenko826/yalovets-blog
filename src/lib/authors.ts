import { NextResponse } from 'next/server';

import type { AuthorItem } from '@/types';

export const emptyAuthorObject: AuthorItem = {
    id: '',
    email: '',
    handle: '',
    bio: '',
    full_name: '',
    avatar_url: '',
    role: 'guest',
    social_links: {
        email: '',
        github: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        facebook: '',
        reddit: '',
    },
};

const transformAuthor = (author: any): AuthorItem => ({
    id: String(author.id),
    email: author.email,
    handle: author.handle,
    bio: author.bio,
    full_name: author.full_name,
    avatar_url: author.avatar_url,
    role: author.role,
    social_links: {
        email: author.social_links?.email || '',
        github: author.social_links?.github || '',
        instagram: author.social_links?.instagram || '',
        linkedin: author.social_links?.linkedin || '',
        twitter: author.social_links?.twitter || '',
        facebook: author.social_links?.facebook || '',
        reddit: author.social_links?.reddit || '',
    },
});

export const getAuthors = async (): Promise<AuthorItem[]> => {
    try {
        if (typeof window === 'undefined') {
            const { createClient } = await import('@supabase/supabase-js');
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
            const { data, error } = await supabaseAdmin.from('authors').select('*');
            if (error) throw error;
            if (Array.isArray(data)) {
                return data.map(transformAuthor).reverse();
            }
            return [];
        } else {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
            const response = await fetch(`${baseUrl}/api/author`, { cache: 'no-store' });
            const data = await response.json();
            
            if (Array.isArray(data)) {
                return data.map(transformAuthor).reverse();
            }
            return [];
        }
    } catch (err) {
        console.error('Failed to fetch authors from the database: ', err);
        return [];
    }
};

export const getAuthorByEmail = async (email: string): Promise<AuthorItem> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/author?email=${email}`, { cache: 'no-store' });
        if (!response.ok) return emptyAuthorObject;
        
        const data = await response.json();
        return data ? transformAuthor(data) : emptyAuthorObject;
    } catch (err) {
        console.error('Failed to fetch author from the database: ', err);
        return emptyAuthorObject;
    }
};

export const getAuthorByKey = async (handle: string): Promise<AuthorItem> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/author`, { cache: 'no-store' });
        if (!response.ok) return emptyAuthorObject;
        
        const data = await response.json();
        if (Array.isArray(data)) {
            const author = data.find((author: any) => author.handle === handle);
            return author ? transformAuthor(author) : emptyAuthorObject;
        }
        return emptyAuthorObject;
    } catch (err) {
        console.error('Failed to fetch author from the database: ', err);
        return emptyAuthorObject;
    }
};

export const getAuthorEmails = async (): Promise<string[]> => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    try {
        const response = await fetch(`${baseUrl}/api/author-list`, { cache: 'no-store' });
        const data = await response.json();
        return data || [];
    } catch (err) {
        console.error('Failed to fetch author emails from the database.');
        return [];
    }
};

export const createAuthor = async (author: any) => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const newAuthor = {
        email: author.email,
        bio: author.bio,
        full_name: author.full_name || author.full_name,
        avatar_url: author.avatar_url || author.avatar_url,
        role: author.role || 'guest',
        social_links: {
            Email: author.social_links?.email || author.social_links?.Email || '',
            GitHub: author.social_links?.github || author.social_links?.GitHub || '',
            Instagram: author.social_links?.instagram || author.social_links?.Instagram || '',
            LinkedIn: author.social_links?.linkedin || author.social_links?.LinkedIn || '',
            Twitter: author.social_links?.twitter || author.social_links?.Twitter || '',
            Facebook: author.social_links?.facebook || author.social_links?.Facebook || '',
            Reddit: author.social_links?.reddit || author.social_links?.Reddit || '',
        },
    };

    const response = await fetch(`${baseUrl}/api/author`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAuthor),
    });

    return await response.json();
};

export const updateAuthor = async (author: any) => {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const updatedAuthor = {
        id: author.id,
        email: author.email,
        bio: author.bio,
        full_name: author.full_name || author.full_name,
        avatar_url: author.avatar_url || author.avatar_url,
        role: author.role || 'guest',
        social_links: {
            Email: author.social_links?.email || author.social_links?.Email || '',
            GitHub: author.social_links?.github || author.social_links?.GitHub || '',
            Instagram: author.social_links?.instagram || author.social_links?.Instagram || '',
            LinkedIn: author.social_links?.linkedin || author.social_links?.LinkedIn || '',
            Twitter: author.social_links?.twitter || author.social_links?.Twitter || '',
            Facebook: author.social_links?.facebook || author.social_links?.Facebook || '',
            Reddit: author.social_links?.reddit || author.social_links?.Reddit || '',
        },
    };

    const response = await fetch(`${baseUrl}/api/author`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAuthor),
    });

    return await response.json();
};
