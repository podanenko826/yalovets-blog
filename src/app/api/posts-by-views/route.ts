import { getAuthorEmails } from '@/lib/authors';
import { DynamoDBClient, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import moment from 'moment';
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

    const limit: number | undefined = Number(searchParams.get('limit')) || undefined;

    if (!TABLE_NAME) {
        return NextResponse.json([], { status: 500 });
    }

    try {
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'GSI_PostsByViews',
            KeyConditionExpression: 'postGroup = :postGroup',
            ExpressionAttributeValues: {
                ':postGroup': { S: 'ALL_POSTS' },
            },
            ScanIndexForward: false, // Descending order
            Limit: limit,
        };

        const command = new QueryCommand(params);
        const result = await dbClient.send(command);
        const postsData = result.Items;       

        if (!postsData || postsData.length === 0) {
            return NextResponse.json([], { status: 201 });
        }

        return NextResponse.json(postsData, { status: 201 });
    } catch (err) {
        console.error('Failed to fetch data from the database: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}

export { POST, PUT, DELETE } from "@/app/api/posts/route";