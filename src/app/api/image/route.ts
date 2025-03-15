import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

export async function GET() {
    try {
        const imagesDir = path.join(process.cwd(), 'public/images');
        const imageFiles = fs.readdirSync(imagesDir, { recursive: true });

        let imagesPaths: string[] = [];
        for (const file of imageFiles) {
            for (const extension of IMAGE_EXTENSIONS) {
                if (file.includes(extension)) {
                    imagesPaths.push(file as string);
                }
            }
        }

        return NextResponse.json(imagesPaths);
    } catch (err) {
        console.error('Failed to get images paths:', err);
        return NextResponse.json({ error: 'Failed to get images paths' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year')?.split('/').at(-1);
        const month = searchParams.get('month')?.split('/').at(-1);

        if (!year || !month) {
            return NextResponse.json({ error: 'Either year or month is not passed to search parameters' }, { status: 400 });
        }

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
        const uploadDir = path.join(process.cwd(), `public/images/${year}/${month}`);
        fs.mkdirSync(uploadDir, { recursive: true });

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
            filePath: `/images/${year}/${month}/${filename}.webp`,
        });
    } catch (error) {
        console.error('Error during file upload:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const imagePath = searchParams.get('imagePath');

        if (imagePath && fs.existsSync(path.join(process.cwd(), imagePath))) {
            fs.rmSync(imagePath);

            return NextResponse.json({ message: 'Deleted the image successfully' }, { status: 201 });
        }

        return NextResponse.json({ message: 'The image in given path does not exist' }, { status: 404 });
    } catch (err) {
        console.error('Error during file deletion:', err);
        return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }
}
