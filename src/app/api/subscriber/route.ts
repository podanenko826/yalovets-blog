import { SubscriberItem, PostItem } from '@/types';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import moment from 'moment';
import { NextResponse } from 'next/server';

const dbClient = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY as string,
    },
});
const docClient = DynamoDBDocumentClient.from(dbClient);

export async function GET(request: Request) {
    const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME;

    const { searchParams } = new URL(request.url);
    const subscriberEmail = searchParams.get('email')?.split('/').at(-1);

    if (!TABLE_NAME) {
        return NextResponse.json({ error: 'Table name is not defined in environment variables' }, { status: 500 });
    }

    if (subscriberEmail) {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                email: subscriberEmail,
                slug: 'subscriber',
            },
        });

        try {
            const response = await docClient.send(command);
            const item = response.Item;       

            if (item === undefined) {
                return NextResponse.json([], { status: 404 });
            } else {
                return NextResponse.json(item, { status: 201 });
            }
        } catch (err) {
            console.error('Failed to fetch data from the database: ', err);
            return NextResponse.json(err, { status: 500 });
        }
    } else {
        try {
            const params = {
                TableName: TABLE_NAME,
                FilterExpression: 'slug = :slugValue',
                ExpressionAttributeValues: {
                    ':slugValue': { S: 'subscriber' }, // Wrap the value in `{ S: ... }` to indicate it's a string type in DynamoDB
                },
            };
            const command = new ScanCommand(params);
            const result = await dbClient.send(command);
            const data = result.Items;

            return NextResponse.json(data, { status: 201 });
        } catch (err) {
            console.error('Failed to fetch data from the database: ', err);
            return NextResponse.json(err, {
                status: 500,
            });
        }
    }
}

export async function POST(request: Request) {
    try {
        const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME;

        const { email, name, subscribedAt, status } = await request.json();

        if (email && name) {
            const newDate = subscribedAt || moment.utc().toISOString();
            const newStatus = status || 'subscribed';

            const newSubscriber = {
                email,
                slug: 'subscriber',
                name,
                subscribedAt: newDate,
                status: newStatus,
            };

            try {
                const command = new PutCommand({
                    TableName: TABLE_NAME,
                    Item: newSubscriber,
                });

                const response = await docClient.send(command);
                console.log('Subscriber successfully created:', newSubscriber);
                return new Response(JSON.stringify(response), { status: 200 });
            } catch (error) {
                console.error('Failed to create a subscriber', error);
                return new Response('Failed to create a subscriber', { status: 400 });
            }
        } else {
            return new Response('Missing required fields', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to create a subscriber: ', err);
        return new Response('Failed to create a subscriber', { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME;

        const { email, name, subscribedAt, status } = await request.json();

        if (email && name && subscribedAt && status) {
            const updatedSubscriber = {
                email,
                slug: 'subscriber',
                name,
                subscribedAt,
                status,
            };

            const command = new UpdateCommand({
                TableName: TABLE_NAME,
                Key: {
                    email,
                    slug: 'subscriber',
                },
                UpdateExpression: 'SET #n = :name, #s = :status, subscribedAt = :subscribedAt',
                ExpressionAttributeNames: {
                    '#n': 'name', // alias 'name' to avoid reserved word issue
                    '#s': 'status', // alias 'status' to avoid reserved word issue
                },
                ExpressionAttributeValues: {
                    ':name': name,
                    ':status': status,
                    ':subscribedAt': subscribedAt,
                },
                ReturnValues: 'UPDATED_NEW',
            });

            try {
                const response = await docClient.send(command);
                console.log('Subscriber successfully updated:', updatedSubscriber);
                return new Response(JSON.stringify(response), { status: 200 });
            } catch (error) {
                console.error('Failed to update a subscriber', error);
                return new Response('Failed to update a subscriber', { status: 400 });
            }
        } else {
            return new Response('Missing required fields', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to update a subscriber: ', err);
        return new Response('Failed to update a subscriber', { status: 500 });
    }
}
