import { PaginationEntry } from '@/types';
import { headers } from 'next/headers';

export async function getPaginationData(): Promise<Record<number, PaginationEntry>> {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/pagination`, { method: 'GET' });
    if (!response.ok) {
        throw new Error('Failed to fetch pagination data');
    }

    const data = await response.json();

    if (Object.keys(data).length === 0) return {};

    return data;
}

export async function updatePagination(paginationData: Record<number, PaginationEntry>): Promise<Record<number, PaginationEntry>> {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const response = await fetch(`${baseUrl}/api/pagination`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paginationData),
    });

    const content = await response.json();

    return content;
}