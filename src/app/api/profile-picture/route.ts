import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
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

        const webpBuffer = await sharp(buffer)
            .resize({ width: 200, height: 200, fit: 'cover' }) // ensure profile pics are appropriately sized
            .toFormat('webp')
            .toBuffer();

        const uploadPath = `pfp/${filename}.webp`;

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
