// src/app/api/s3/route.ts
import {NextResponse} from 'next/server';
import {S3} from 'aws-sdk';

const s3 = new S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const key = searchParams.get('key');
    const fileName = searchParams.get('key')?.split('/').at(-1);

    if (!BUCKET_NAME) {
        return NextResponse.json(
            {error: 'Bucket name is not defined in environment variables'},
            {status: 500}
        );
    }

    // Check if key is provided
    if (fileName) {
        try {
            const params = {
                Bucket: BUCKET_NAME as string,
                Key: key as string,
            };
            const data = await s3.getObject(params).promise();
            const fileContent = data.Body?.toString('utf-8');

            return NextResponse.json({content: fileContent}, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                {error: 'Failed to fetch object from S3'},
                {status: 500}
            );
        }
    } else {
        console.log("Key doesn't exist");

        try {
            const params = {
                Bucket: BUCKET_NAME as string,
                Prefix: 'mdx/' as string,
            };
            const data = await s3.listObjectsV2(params).promise();
            const files = data.Contents?.map(item => item.Key) || [];
            console.log('S3 listObjectsV2 response: ', data.Contents);

            return NextResponse.json({files});
        } catch (err) {
            console.error('Error listing objects: ', err);
            return NextResponse.json(
                {error: 'Failed to list objects'},
                {status: 500}
            );
        }
    }
}
