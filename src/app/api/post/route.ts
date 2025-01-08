import { PostItem } from '@/types';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { NextResponse } from 'next/server';

const dbClient = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY as string,
    },
});

// /api/post (GET method)
export async function GET(request: Request) {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

    const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME;

    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('slug')?.split('/').at(-1);

    if (!TABLE_NAME) {
        return NextResponse.json({ error: 'Table name is not defined in environment variables' }, { status: 500 });
    }

    // First, attempt to fetch posts if we have a specific slug
    if (postSlug) {
        try {
            const params = {
                TableName: TABLE_NAME,
                FilterExpression: 'slug = :slugValue',
                ExpressionAttributeValues: {
                    ':slugValue': { S: postSlug },
                },
            };

            const command = new ScanCommand(params);
            const result = await dbClient.send(command);
            const data = result.Items?.at(0);

            return NextResponse.json(data, { status: 201 });
        } catch (err) {
            console.error('Failed to fetch data from the database: ', err);
            return NextResponse.json(err, { status: 500 });
        }
    } else {
        try {
            const params = {
                TableName: TABLE_NAME,
                FilterExpression: 'slug <> :excludedSlug',
                ExpressionAttributeValues: {
                    ':excludedSlug': { S: 'author-account' },
                },
            };

            const command = new ScanCommand(params);
            const result = await dbClient.send(command);
            const data = result.Items;

            return NextResponse.json(data, { status: 201 });
        } catch (err) {
            console.error('Failed to fetch data from the database: ', err);
            return NextResponse.json(err, { status: 500 });
        }
    }
}
