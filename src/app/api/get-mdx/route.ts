// src/app/api/get-mdx/route.ts

import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
        return new Response('Missing slug parameter', {status: 400});
    }

    const filePath = path.join(process.cwd(), 'src/articles', `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return new Response('File not found', {status: 404});
    }

    const content = fs.readFileSync(filePath, 'utf8');

    return new Response(JSON.stringify({content}), {
        status: 200,
        headers: {
            'Content-Type': 'text/markdown',
        },
    });
}
