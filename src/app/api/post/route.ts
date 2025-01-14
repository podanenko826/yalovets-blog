import { PostItem } from '@/types';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { NextResponse } from 'next/server';

const dbClient = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY as string,
    },
});

const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME;

// /api/post (GET method)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('slug')?.split('/').at(-1);

    // A limit to determine how many posts to be fetched after the last fetched post by date
    const limit = searchParams.get('limit') || 10;
    const lastKey = searchParams.get('limit');

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
                // ExclusiveStartKey: lastKey ? JSON.parse(lastKey) : undefined,
                // Limit: Number(limit),
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

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('slug')?.split('/').at(-1);

    const postData = await request.json();
    const { email, description, imageUrl, date, modifyDate, postType, tags, readTime, viewsCount } = postData;
    let {slug, title} = postData;

    if (!TABLE_NAME) {
        return NextResponse.json({ error: 'Table name is not defined in environment variables' }, { status: 500 });
    }

    if (!email || !title || !description || !date || !imageUrl || !readTime || !postType) {
        return NextResponse.json({ error: 'Recieved invalid or incomplete post data' }, { status: 500 });
    }

    if (!slug && postSlug) {
        slug = postSlug;
    }

    if (!slug) {
        slug = `${title
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replaceAll(' ', '-')
            .toLowerCase()}`;
    }

    // Ensure the fileName does not exceed 255 characters, including the '.mdx' extension
    const MAX_FILENAME_LENGTH = 150;
    const fileExtension = '.mdx';

    // Truncate the slug if the full fileName would exceed the limit
    if (slug.length + fileExtension.length > MAX_FILENAME_LENGTH) {
        slug = slug.slice(0, MAX_FILENAME_LENGTH - fileExtension.length);

        title = title.slice(0, MAX_FILENAME_LENGTH - fileExtension.length);
    }

    const newPost: PostItem = {
        email,
        slug,
        title,
        description,
        imageUrl: imageUrl,
        date: date,
        modifyDate: modifyDate || date, // Automatically generated modifyDate
        postType: postType,
        tags: tags || [],
        readTime: readTime,
        viewsCount: viewsCount || 0,
    };
    
    try {
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: newPost,
        });

        await dbClient.send(command);
        return NextResponse.json({ message: 'Successfully uploaded post' }, { status: 200 });
    } catch (err) {
        console.error('Failed to upload post:', err);
        return NextResponse.json({ error: 'Failed to upload post' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { email, slug } = await request.json();

        // Check that the required slug is provided
        if (!email) {
            return NextResponse.json({ error: 'Missing required identifier: email.' }, { status: 500 })
        }
        if (!slug) {
            return NextResponse.json({ error: 'Missing required identifier: slug.' }, { status: 500 })
        }

        // Create the delete command with the specified TableName and Key (slug in this case)
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                email,
                slug,
            },
        });
        
        await dbClient.send(command);
        
        return NextResponse.json({ message: 'Successfully deleted post' }, { status: 200 });
    } catch (err) {
        console.error('Failed to delete post:', err);
        return NextResponse.json({ error: 'Failed to upload post' }, { status: 500 });
    }
}