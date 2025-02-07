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

    const authorEmail: string | undefined = searchParams.get('email') || undefined;
    const limit: number | undefined = Number(searchParams.get('limit')) || undefined;
    let lastKey = searchParams.get('lastKey') || moment.utc().toISOString();

    if (!TABLE_NAME || !authorEmail) {
        return NextResponse.json({
            posts: [],
            lastKey: '',
        }, { status: 500 });
    }

    try {
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'GSI_PostsByAuthorAndDate',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': { S: authorEmail },
            },
            ExclusiveStartKey: {
                //? The primary value that defines the start key of a Query (others don't matter)
                email: { S: authorEmail },
                date: { S: moment(lastKey).add(1, 'second').toISOString() || moment.utc().toISOString() },
                slug: { S: 'ANY_SLUG' },
            },
            ScanIndexForward: false, // Descending order
            Limit: limit,
        };

        const command = new QueryCommand(params);
        const result = await dbClient.send(command);
        const postsData = result.Items;       
        
        if (postsData && postsData?.length >= 1) {
            const sortedPosts = postsData.sort((a, b) => {
                const dateOne = moment(a.date.S);
                const dateTwo = moment(b.date.S);
    
                return dateTwo.diff(dateOne); // Descending order
            });  
            
            const lastEvaluatedKey = sortedPosts.at(-1);
            if (lastEvaluatedKey) {
                lastKey = lastEvaluatedKey.date.S || '';
            }
        }

        if (!postsData || postsData.length === 0) {
            return NextResponse.json({
                posts: [],
                lastKey: ''
            }, { status: 201 });
        }

        return NextResponse.json({
            posts: postsData,
            lastKey: lastKey,
        }, { status: 201 });
    } catch (err) {
        console.error('Failed to fetch data from the database: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}

export { POST, PUT, DELETE } from "@/app/api/posts/route";