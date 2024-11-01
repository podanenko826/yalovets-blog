import {NextResponse} from 'next/server';
import {getMongoClient} from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await getMongoClient();
        const db = client.db('yalovets-blog-metadata');
        const collection = db.collection('Post');

        const data = await collection.find({}).toArray();

        return NextResponse.json(data);
    } catch (err) {
        console.error('Error fetching data from DocumentDB:', err);
        return NextResponse.json(
            {error: 'Failed to fetch data'},
            {status: 500}
        );
    }
}
