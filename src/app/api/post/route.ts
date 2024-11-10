import {PostItem} from '@/types';
import {DynamoDBClient, ScanCommand} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, GetCommand} from '@aws-sdk/lib-dynamodb';
import {NextResponse} from 'next/server';

const dbClient = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY as string,
    },
});

export async function GET(request: Request) {
    const baseUrl =
        typeof window === 'undefined'
            ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
            : '';

    const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME;

    const {searchParams} = new URL(request.url);
    const postSlug = searchParams.get('slug')?.split('/').at(-1);

    if (!TABLE_NAME) {
        return NextResponse.json(
            {error: 'Table name is not defined in environment variables'},
            {status: 500}
        );
    }

    if (postSlug) {
        try {
            const params = {
                TableName: TABLE_NAME,
                FilterExpression: 'slug = :slugValue',
                ExpressionAttributeValues: {
                    ':slugValue': {S: postSlug}, // Wrap the value in `{ S: ... }` to indicate it's a string type in DynamoDB
                },
            };

            const command = new ScanCommand(params);
            const result = await dbClient.send(command);
            const data = result.Items?.at(0);

            return NextResponse.json(data, {status: 201});
        } catch (err) {
            console.error('Failed to fetch data from the database: ', err);
            return NextResponse.json(err, {status: 500});
        }
    } else {
        try {
            const response = await fetch(`${baseUrl}/api/author-list`);
            const data = await response.json();

            let posts: any[] = [];

            for (const authorEmail of data) {
                const params = {
                    TableName: TABLE_NAME,
                    FilterExpression: 'email = :emailValue',
                    ExpressionAttributeValues: {
                        ':emailValue': {S: authorEmail}, // Wrap the value in `{ S: ... }` to indicate it's a string type in DynamoDB
                    },
                };
                const command = new ScanCommand(params);
                const result = await dbClient.send(command);
                const data = result.Items;

                if (data && data.length > 0) {
                    posts = [...posts, ...data];
                }
            }

            const filteredPosts = posts.filter(
                post => post.slug?.S !== 'author-account'
            );

            return NextResponse.json(filteredPosts, {status: 201});
        } catch (err) {
            console.error('Failed to fetch data from the database: ', err);
            return NextResponse.json(err, {status: 500});
        }
    }
}
