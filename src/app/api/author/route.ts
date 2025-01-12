import { AuthorItem, PostItem } from '@/types';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
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
    const accountEmail = searchParams.get('email')?.split('/').at(-1);

    if (!TABLE_NAME) {
        return NextResponse.json({ error: 'Table name is not defined in environment variables' }, { status: 500 });
    }

    if (accountEmail) {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                email: accountEmail,
                slug: 'author-account',
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
                    ':slugValue': { S: 'author-account' }, // Wrap the value in `{ S: ... }` to indicate it's a string type in DynamoDB
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

/**
    A code to get a full object of all created authors on the database
**/

export async function POST(request: Request) {
    try {
        const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME;

        const { email, bio, fullName, profileImageUrl, socialLinks } = await request.json();

        if (email && fullName && bio) {
            const authorKey = `${fullName
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .replaceAll(' ', '')
                .replaceAll('-', '')
                .toLowerCase()}`;

            const { emailAddress = '', githubUrl = '', instagramUrl = '', linkedInUrl = '', xUrl = '', facebookUrl = '', redditUrl = '' } = socialLinks || {};

            const formattedSocialLinks = {
                emailAddress,
                githubUrl,
                instagramUrl,
                linkedInUrl,
                xUrl,
                facebookUrl,
                redditUrl,
            };

            const newAuthor = {
                email,
                slug: 'author-account',
                authorKey,
                bio,
                fullName,
                profileImageUrl,
                socialLinks: formattedSocialLinks,
            };

            const command = new PutCommand({
                TableName: TABLE_NAME,
                Item: newAuthor,
            });

            try {
                const response = await docClient.send(command);
                console.log('Author successfully created:', newAuthor);
                return new Response(JSON.stringify(response), { status: 200 });
            } catch (error) {
                console.error('Failed to create an author', error);
                return new Response('Failed to create an author', { status: 400 });
            }
        } else {
            return new Response('Missing required fields', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to create an author: ', err);
        return new Response('Failed to create an author', { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME;

        const { email, bio, fullName, profileImageUrl, socialLinks } = await request.json();

        if (fullName && bio) {
            const authorKey = `${fullName
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .replaceAll(' ', '')
                .replaceAll('-', '')
                .toLowerCase()}`;

            const { emailAddress = '', githubUrl = '', instagramUrl = '', linkedInUrl = '', xUrl = '', facebookUrl = '', redditUrl = '' } = socialLinks || {};

            const formattedSocialLinks = {
                emailAddress,
                githubUrl,
                instagramUrl,
                linkedInUrl,
                xUrl,
                facebookUrl,
                redditUrl,
            };

            const updatedAuthor = {
                email,
                slug: 'author-account',
                authorKey,
                bio,
                fullName,
                profileImageUrl,
                socialLinks: formattedSocialLinks,
            };

            const command = new UpdateCommand({
                TableName: TABLE_NAME,
                Key: {
                    email: email, // Partition key
                    slug: 'author-account', // Sort key (fixed)
                },
                UpdateExpression: `
                    SET 
                        bio = :bio,
                        fullName = :fullName,
                        profileImageUrl = :profileImageUrl,
                        authorKey = :authorKey,
                        socialLinks = :socialLinks
                `,
                ExpressionAttributeValues: {
                    ':bio': bio,
                    ':fullName': fullName,
                    ':profileImageUrl': profileImageUrl,
                    ':authorKey': authorKey,
                    ':socialLinks': formattedSocialLinks,
                },
                ReturnValues: 'UPDATED_NEW', // Return the updated fields
            });

            try {
                const response = await docClient.send(command);
                console.log('Author successfully updated:', updatedAuthor);
                return new Response(JSON.stringify(response), { status: 200 });
            } catch (error) {
                console.error('Failed to update an author', error);
                return new Response('Failed to update an author', { status: 400 });
            }
        } else {
            return new Response('Missing required fields', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to update an author: ', err);
        return new Response('Failed to update an author', { status: 500 });
    }
}
