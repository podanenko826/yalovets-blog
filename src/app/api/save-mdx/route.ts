// app/api/save-mdx/route.js

import fs from 'fs';
import {NextResponse} from 'next/server';
import path from 'path';

export async function POST(request: Request) {
    const {fileName, content} = await request.json();

    // Define the directory to save the file
    // const dirPath = path.join(process.cwd(), 'saved_files');
    const dirPath = 'src/articles';

    // Ensure the directory exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }

    const filePath = path.join(dirPath, fileName);

    // Write the file to the filesystem
    try {
        fs.writeFileSync(filePath, content);
        return NextResponse.json(filePath, {status: 200});
    } catch (err) {
        return NextResponse.json(
            {message: 'Failed to save file'},
            {status: 500}
        );
    }
}
