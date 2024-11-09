import {DynamoDBClient, ScanCommand} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, GetCommand} from '@aws-sdk/lib-dynamodb';
import {NextResponse} from 'next/server';

const dbClient = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY as string,
    },
});
const docClient = DynamoDBDocumentClient.from(dbClient);

export async function GET(request: Request) {
    const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME;

    const {searchParams} = new URL(request.url);
    const email = searchParams.get('email');
    const accountEmail = searchParams.get('email')?.split('/').at(-1);

    if (!TABLE_NAME) {
        return NextResponse.json(
            {error: 'Table name is not defined in environment variables'},
            {status: 500}
        );
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
                return NextResponse.json([], {status: 404});
            } else {
                return NextResponse.json(item, {status: 201});
            }
        } catch (err) {
            console.error('Failed to fetch data from the database: ', err);
            return NextResponse.json(err, {status: 500});
        }
    } else {
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'slug = :slugValue',
            ExpressionAttributeValues: {
                ':slugValue': {S: 'author-account'}, // Wrap the value in `{ S: ... }` to indicate it's a string type in DynamoDB
            },
        };

        try {
            const command = new ScanCommand(params);
            const result = await dbClient.send(command);

            const emailAddresses: string[] = [];

            if (result.Items) {
                // Iterate over the items and extract the email addresses
                result.Items.forEach(item => {
                    // Check if the email field exists and extract the value
                    if (item.email && item.email.S) {
                        emailAddresses.push(item.email.S); // Push the email string to the array
                    }
                });
            }

            return NextResponse.json(emailAddresses, {status: 201});
        } catch (err) {
            return NextResponse.json(err, {
                status: 500,
            });
        }
    }
}