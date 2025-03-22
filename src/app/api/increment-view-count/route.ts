import { PostItem } from '@/types';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { NextResponse } from 'next/server';

const dbClient = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY as string,
    },
});

export async function PATCH(request: Request) {
    const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME;

    const { email, slug } = await request.json();

    if (!TABLE_NAME) {
        return NextResponse.json({ error: 'Table name is not defined in environment variables' }, { status: 500 });
    }

    if (!email || !slug) {
        return NextResponse.json({ error: 'Invalid email or slug format' }, { status: 400 });
    }

    // First, attempt to fetch posts if we have a specific slug
        try {
            const params = {
                TableName: TABLE_NAME,
                Key: {
                    email,
                    slug,
                },
                UpdateExpression: 'SET viewsCount = if_not_exists(viewsCount, :start) + :inc',
                ExpressionAttributeValues: {
                    ':inc': 1,
                    ':start': 0,
                },
            };

            const command = new UpdateCommand(params);
            const result = await dbClient.send(command);

            return NextResponse.json(result, { status: 201 });
        } catch (err) {
            console.error('Failed to fetch data from the database: ', err);
            return NextResponse.json(err, { status: 500 });
        }
}
