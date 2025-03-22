import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {

    const filePath = path.join(process.cwd(), 'src/app/(user)/imprint', `imprint.mdx`);
    if (!fs.existsSync(filePath)) {
        return new Response('File not found', { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf8');

    return new Response(JSON.stringify({ content }), {
        status: 200,
        headers: {
            'Content-Type': 'text/markdown',
        },
    });
}

export async function PUT(request: Request) {
    const { content } = await request.json();

    // Define the directory to save the file
    const dirPath = `src/app/(user)/imprint`;

    // Ensure the directory exists
    if (!fs.existsSync(dirPath)) {
        return NextResponse.json({ message: 'The Imprint directory is not found' }, { status: 200 });
    }
    
    const filePath = path.join(dirPath, 'imprint.mdx');

    // Write the file to the filesystem
    try {
        fs.writeFileSync(filePath, content);
        return NextResponse.json(filePath, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Failed to save file' }, { status: 500 });
    }
}