import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { supabase } from '@/lib/supabase';

async function listAllFiles(bucket: string, currentPath: string = ''): Promise<string[]> {
    const { data, error } = await supabase.storage.from(bucket).list(currentPath);
    if (error || !data) return [];
    
    let files: string[] = [];
    for (const item of data) {
        if (!item.id) {
            // It's a folder, recursively list
            const subPath = currentPath ? `${currentPath}/${item.name}` : item.name;
            const subFiles = await listAllFiles(bucket, subPath);
            files.push(...subFiles);
        } else {
            // It's a file
            if (item.name !== '.emptyFolderPlaceholder') {
                files.push(currentPath ? `${currentPath}/${item.name}` : item.name);
            }
        }
    }
    return files;
}

export async function GET() {
    try {
        const imagesPaths = await listAllFiles('images');
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

        const widthParam = searchParams.get('width');
        const width = widthParam ? parseInt(widthParam, 10) : null;

        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const originalName = file.name.replace(/\s+/g, ''); // Remove spaces
        const filename = originalName.replace(/\.[^/.]+$/, ''); // Remove extension
        const size = file.size;
        const mimetype = file.type;

        const buffer = Buffer.from(await file.arrayBuffer());

        let finalFilename = filename;
        let sharpInstance = sharp(buffer);

        if (width && !isNaN(width)) {
            finalFilename = `${filename}@${width}w2x`;
            sharpInstance = sharpInstance.resize({ width: width * 2 });
        }

        const webpBuffer = await sharpInstance.toFormat('webp').toBuffer();
        const uploadPath = `${year}/${month}/${finalFilename}.webp`;

        const { data, error } = await supabase.storage
            .from('images')
            .upload(uploadPath, webpBuffer, {
                contentType: 'image/webp',
                upsert: true
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw error;
        }

        const { data: urlData } = supabase.storage.from('images').getPublicUrl(uploadPath);

        return NextResponse.json({
            originalName,
            size,
            mimetype,
            filePath: urlData.publicUrl,
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

        if (!imagePath) {
            return NextResponse.json({ error: 'No imagePath provided' }, { status: 400 });
        }

        // Extract the relative path from the full public URL if necessary
        let relativePath = imagePath;
        if (imagePath.includes('/storage/v1/object/public/images/')) {
            relativePath = imagePath.split('/storage/v1/object/public/images/')[1];
        } else if (imagePath.startsWith('/images/')) {
            relativePath = imagePath.replace('/images/', '');
        }

        const { data, error } = await supabase.storage.from('images').remove([relativePath]);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Deleted the image successfully' }, { status: 201 });
    } catch (err) {
        console.error('Error during file deletion:', err);
        return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }
}
