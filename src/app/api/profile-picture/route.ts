import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: Request) {
    try {
        // Get the form data from the request
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Get file metadata
        const originalName = file.name.replace(/\s+/g, ''); // Remove spaces
        const filename = originalName.replace(/\.[^/.]+$/, ''); // Remove extension
        const size = file.size;
        const mimetype = file.type;

        // Set the upload directory
        const uploadDir = path.join(process.cwd(), `public/pfp`);

        // Convert the file to a buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Process & save the image (WebP conversion)
        await sharp(buffer)
            .toFormat('webp')
            .toFile(path.join(uploadDir, `${filename}.webp`));

        // Return the response with file metadata
        return NextResponse.json({
            originalName,
            size,
            mimetype,
            filePath: `/pfp/${filename}.webp`,
        });
    } catch (error) {
        console.error('Error during file upload:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
