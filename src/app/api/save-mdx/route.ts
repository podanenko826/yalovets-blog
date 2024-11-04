// app/api/save-mdx/route.js

import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    const {fileName, content} = await request.json();

    // Define the directory to save the file
    // const dirPath = path.join(process.cwd(), 'saved_files');
    const dirPath = 'src/app/(user)/[slug]';

    // Ensure the directory exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }

    const filePath = path.join(dirPath, fileName);

    // Write the file to the filesystem
    return new Promise(resolve => {
        fs.writeFile(filePath, content, err => {
            if (err) {
                return resolve(
                    new Response('Failed to save file', {status: 500})
                );
            }
            resolve(new Response('File saved successfully', {status: 200}));
        });
    });
}
