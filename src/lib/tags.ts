import { TagItem } from '@/types';
import { headers } from 'next/headers';

export async function getTagsData() {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/tag`, { method: 'GET' });
    if (!response.ok) {
        throw new Error('Failed to fetch tags data');
    }

    const data = await response.json();

    let tags: TagItem[] = [];

    if (data) {
        tags = [...tags, ...data.content];
    }

    return tags;
}

export async function getTagData(tag: string): Promise<{ content: TagItem }> {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/tag?tag=${tag}`, { method: 'GET' });
    if (!response.ok) {
        throw new Error('Failed to fetch tags data');
    }

    const content = await response.json();

    return content;
}

export async function createTag(tag: TagItem) {
    const newTag = {
        tag: tag.tag,
        title: tag.title,
        description: tag.description,
    };

    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/tag`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTag),
    });

    const content = await response.json();

    return content;
}

export async function editTag(tag: TagItem) {
    const updatedTag = {
        id: tag.id,
        tag: tag.tag,
        title: tag.title,
        description: tag.description,
        postCount: tag.postCount,
    };

    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/tag`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTag),
    });

    const content = await response.json();

    return content;
}

export async function deleteTag(id: number) {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/tag`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(id),
    });

    const content = await response.json();

    return content;
}
