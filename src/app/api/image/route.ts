import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

    // Get the file from the form data
    const file = formData.get('image') as File;
    
    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Get file metadata
    const originalName = file.name;
    const extension = path.extname(originalName);
    const size = file.size;
    const mimetype = file.type;

    // Set the upload directory (e.g., public/images)
    const uploadDir = path.join(process.cwd(), `public/images/${year}/${month}`);
    
    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Define the file path where the image will be saved
    const filePath = path.join(uploadDir, originalName);

    // Convert the file to a buffer and save it to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Return the response with file metadata
    return NextResponse.json({
      originalName,
      extension,
      size,
      mimetype,
      filePath: `/images/${year}/${month}/${originalName}`,
    });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
