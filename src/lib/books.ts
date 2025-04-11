
import { DescribeTableCommand, DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import type { AuthorItem, BookItem, PaginationEntry, PaginationState } from '@/types';
import { getAuthorEmails, getAuthorByEmail } from './authors';
import { request } from 'http';
import { updatePagination } from './pagination';

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

function transformBookData(data: any[]): BookItem[] {
    return data.map(post => {
        const rawLinks = post.purchaseLinks?.M;
    
        const purchaseLinks = rawLinks
            ? Object.fromEntries(
                    Object.entries(rawLinks).map(([shop, value]) => {
                        // Safe cast to expected DynamoDB string format
                        if (typeof value === "object" && value !== null && "S" in value) {
                            return [shop, (value as { S: string }).S];
                        }
                        return [shop, ""]; // Fallback or you can throw an error here
                    })
                )
            : undefined;
    
        return {
            email: post.email?.S,
            slug: post.slug?.S,
            title: post.title?.S,
            description: post.description?.S,
            imageUrl: post.imageUrl?.S,
            postGroup: post.postGroup?.S,
            purchaseLinks, // Now correctly typed as Record<string, string> | undefined
        };
    });
}

export const getBooks = async (): Promise<BookItem[]> => {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

        const response = await fetch(`${baseUrl}/api/books`, { method: 'GET', cache: "force-cache" });

        if (!response.ok) {
            console.error('API returned an error:', response.status, await response.text());
            return [];
        }

        const data = await response.json();
        const transformedBookData = transformBookData(data);

        return transformedBookData;
    } catch (err) {
        console.error('Failed to fetch books from the database: ', err);
        return [];
    }
}