import fs from 'fs';
import moment from 'moment';
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

// export async function POST(request: Request) {
//     const { searchParams } = new URL(request.url);
//     const date = searchParams.get('date');

//     const year = moment.utc(date).year().toString();
//     const month = (moment.utc(date).month() + 1).toString().padStart(2, '0');

//     const { fileName, content } = await request.json();

//     // Define the directory to save the file
//     const dirPath = `src/articles/${year}/${month}`;

//     // Ensure the directory exists
//     if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath);
//     }
    
//     const filePath = path.join(dirPath, `${fileName}.mdx`);

//     // Write the file to the filesystem
//     try {
//         fs.writeFileSync(filePath, content);
//         return NextResponse.json(filePath, { status: 200 });
//     } catch (err) {
//         return NextResponse.json({ message: 'Failed to save file' }, { status: 500 });
//     }
// }

// export async function DELETE(request: Request) {
//     const { searchParams } = new URL(request.url);
//     const slug = searchParams.get('slug');
//     const date = searchParams.get('date');

//     if (!slug || !date) {
//         console.error('Missing slug or date paramether');
//         return NextResponse.json(false, { status: 400 });
//     }

//     const year = moment.utc(date).year().toString();
//     const month = (moment.utc(date).month() + 1).toString().padStart(2, '0');

//     const dirPath = `src/articles/${year}/${month}`;
//     const filePath = path.join(process.cwd(), dirPath, `${slug}.mdx`);

//     if (!fs.existsSync(filePath)) {
//         return NextResponse.json(false, { status: 404 });
//     }

//     try {
//         await fs.promises.rm(filePath);
//         return NextResponse.json(true, { status: 200 });
//     } catch (err) {
//         console.error('File deletion error:', err);
//         return NextResponse.json(false, { status: 500 });
//     }
// }
