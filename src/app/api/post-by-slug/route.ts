import { getAuthorEmails } from '@/lib/authors';
import { DynamoDBClient, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { NextResponse } from 'next/server';

const dbClient = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY as string,
    },
});

const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME || '';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const postSlug = searchParams.get('slug')?.split('/').at(-1);

    if (!TABLE_NAME || !postSlug) {
        return NextResponse.json({}, { status: 500 });
    }

    const authorEmails: any = await getAuthorEmails();

    let post: any[] = [];

    for (const authorEmail of authorEmails) {
        try {
            const params = {
                TableName: TABLE_NAME, // Replace with your actual posts table name
                KeyConditionExpression: 'email = :email AND slug = :slug', // Querying by slug in the GSI
                ExpressionAttributeValues: {
                    ':email': { S: authorEmail }, // The email value to search for
                    ':slug': { S: postSlug },
                },
            };

            const command = new QueryCommand(params);
            const result = await dbClient.send(command);
            const data = result.Items;

            if (data && data.length > 0) {
                post = [...post, ...data];
            }
        } catch (err) {
            console.error('Failed to fetch data from the database: ', err);
            return NextResponse.json(err, { status: 500 });
        }
    }

    return NextResponse.json(post, { status: 201 });
}

export { POST, PUT, DELETE } from "@/app/api/posts/route";