import { PostItem } from '@/types';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
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

    if (!TABLE_NAME) {
        return NextResponse.json([], { status: 500 });
    }

    try {
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'slug = :slugValue',
            ExpressionAttributeValues: {
                ':slugValue': { S: 'book' }, // Wrap the value in `{ S: ... }` to indicate it's a string type in DynamoDB
            },
        };

        const command = new QueryCommand(params);
        const result = await dbClient.send(command);
        const booksData = result.Items;       

        if (!booksData || booksData.length === 0) {
            return NextResponse.json([], { status: 201 });
        }

        return NextResponse.json([], { status: 201 });
    } catch (err) {
        console.error('Failed to fetch books from the database: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}


export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('slug')?.split('/').at(-1);

    const postData = await request.json();
    const { email, description, imageUrl, date, modifyDate, postType, readTime, viewsCount, sponsoredBy } = postData;
    let {slug, title, sponsorUrl} = postData;

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

    let modifiedSponsorUrl: string | undefined = undefined;
    if (sponsorUrl && !sponsorUrl.startsWith('http://') && !sponsorUrl.startsWith('https://')) {
        modifiedSponsorUrl = `https://${sponsorUrl}`;
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
        imageUrl,
        date,
        modifyDate: modifyDate || date, // Automatically generated modifyDate
        postType,
        readTime: readTime,
        viewsCount: viewsCount || 0,
        postGroup: 'ALL_POSTS',
        sponsoredBy: sponsoredBy || '',
        sponsorUrl: modifiedSponsorUrl || ''
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

export async function PUT(request: Request) {
    const postData = await request.json();
    const { email, slug, description, imageUrl, date, postType, readTime, sponsoredBy } = postData;
    let { title, modifyDate, sponsorUrl } = postData;

    if (!TABLE_NAME) {
        return NextResponse.json({ error: 'Table name is not defined in environment variables' }, { status: 500 });
    }

    if (!email || !slug || !title || !description || !date || !imageUrl || !readTime || !postType) {
        return NextResponse.json({ error: 'Recieved invalid or incomplete post data' }, { status: 500 });
    }

    let modifiedSponsorUrl: string | undefined = undefined;
    if (sponsorUrl && !sponsorUrl.startsWith('http://') && !sponsorUrl.startsWith('https://')) {
        modifiedSponsorUrl = `https://${sponsorUrl}`;
    }

    // Ensure the fileName does not exceed 255 characters, including the '.mdx' extension
    const MAX_FILENAME_LENGTH = 150;
    const fileExtension = '.mdx';

    // Truncate the slug if the full fileName would exceed the limit
    if (title.length > MAX_FILENAME_LENGTH) {
        title = title.slice(0, MAX_FILENAME_LENGTH - fileExtension.length);
    }

    modifyDate = modifyDate || moment.utc().toISOString();

    try {
        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { email, slug },
            UpdateExpression: `
                SET title = :title,
                    description = :description,
                    imageUrl = :imageUrl,
                    modifyDate = :modifyDate,
                    postType = :postType,
                    readTime = :readTime,
                    sponsoredBy = :sponsoredBy,
                    sponsorUrl = :sponsorUrl
            `,
            ExpressionAttributeValues: {
                ":title": title,
                ":description": description,
                ":imageUrl": imageUrl,
                ":modifyDate": modifyDate,
                ":postType": postType,
                ":readTime": readTime,
                ":sponsoredBy": sponsoredBy || '',
                ":sponsorUrl": modifiedSponsorUrl || ''
            },
            ReturnValues: "UPDATED_NEW",
        });

        await dbClient.send(command);
        return NextResponse.json({ message: 'Successfully updated post' }, { status: 200 });
    } catch (err) {
        console.error('Failed to update post:', err);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
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