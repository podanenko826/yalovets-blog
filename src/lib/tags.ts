import { TagItem } from '@/types';

// Utility to recursively unwrap DynamoDB format ({ S: "string" }, { N: "123" }, { M: {...} })

export const getTags = async (): Promise<TagItem[]> => {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        const response = await fetch(`${baseUrl}/api/tags`, { next: { revalidate: 0 } });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return [];
        }

        const data = await response.json();
        const tags = Array.isArray(data) ? data : (data.tags || []);

        return tags;
    } catch (err) {
        console.error('Failed to fetch tags from the database: ', err);
        return [];
    }
};

export const getTagBySlug = async (slug: string): Promise<TagItem | null> => {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        const response = await fetch(`${baseUrl}/api/tags?slug=${slug}`, { next: { revalidate: 0 } });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return null;
        }

        const data = await response.json();
        const tag = Array.isArray(data) ? data[0] : (data.tags || null);

        return tag;
    } catch (err) {
        console.error('Failed to fetch tag from the database: ', err);
        return null;
    }
};

export const getTagById = async (id: string): Promise<TagItem | null> => {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        const response = await fetch(`${baseUrl}/api/tags?id=${id}`, { next: { revalidate: 0 } });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return null;
        }

        const data = await response.json();
        const tag = Array.isArray(data) ? data[0] : (data.tags || null);

        return tag;
    } catch (err) {
        console.error('Failed to fetch tag from the database: ', err);
        return null;
    }
};

export const createTag = async (tagData: Partial<TagItem>): Promise<{ tag: string }> => {
    let { tag, title, description } = tagData;

    if (!title || !description) {
        console.error('Recieved invalid or incomplete post data');
        return { tag: '' };
    }

    if (!tag) {
        tag = `${title
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replaceAll(' ', '-')
            .toLowerCase()}`;
    }

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const newTag = {
            tag,
            title,
            description,
            views_count: 0
        };

        const response = await fetch(`${baseUrl}/api/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTag),
        });

        if (!response.ok) {
            return { tag: '' };
        }

        return { tag };
    } catch (error) {
        console.error('Failed to upload tag:', error);
    }

    return { tag: '' };
};

export const updateTag = async (tagData: Partial<TagItem>): Promise<{ tag: string }> => {
    const { id, tag, title, description } = tagData;

    if (!id || !tag || !title || !description) {
        console.error('Recieved invalid or incomplete post data:', { id, tag, title, description });
        return { tag: '' };
    }

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const updatedTag = {
            id,
            tag,
            title,
            description
        };

        const response = await fetch(`${baseUrl}/api/tags`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTag),
        });

        if (!response.ok) {
            return { tag: '' };
        }

        return { tag };
    } catch (error) {
        console.error('Failed to update tag:', error);
    }

    return { tag: '' };
};

export const deleteTag = async (tagData: { id: string; tag: string }): Promise<string> => {
    try {
        const { id, tag } = tagData;

        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';
        if (!id || !tag) return '';

        const response = await fetch(`${baseUrl}/api/tags`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) return '';

        return tag;
    } catch (error) {
        console.error('Failed to delete tag:', error);
        return '';
    }
};