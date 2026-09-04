import type { BookItem } from '@/types';

export const getBooks = async (): Promise<BookItem[]> => {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const response = await fetch(`${baseUrl}/api/books`, { method: 'GET', next: { revalidate: 0 } });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return [];
        }

        const data: BookItem[] = await response.json();
        return data;
    } catch (err) {
        console.error('Failed to fetch books from the database: ', err);
        return [];
    }
}