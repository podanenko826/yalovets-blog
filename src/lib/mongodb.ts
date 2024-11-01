import {MongoClient} from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Please add MONGODB_URI connection string to .env.local');
}

const uri = process.env.MONGODB_URI as string;
const options = {
    tls: true,
    tlsCAFile: 'cert/global-bundle.pem',
    directConnection: true,
    rejectUnauthorized: false,
};

let client: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
    if (!client) {
        client = new MongoClient(uri, options);
        await client.connect();
    }
    return client;
}
