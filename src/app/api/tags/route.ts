import { PostItem } from '@/types';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const id: string | null = searchParams.get('id');
    const slug: string | null = searchParams.get('slug');

    try {
        let query = supabase.from('tags').select('*').order('created_at', { ascending: false });

        if (id) {
            query = query.eq('id', id);
        }

        if (slug) {
            query = query.eq('tag', slug);
        }

        const { data: tagsData, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json({
            tags: (tagsData || []),
        }, { status: 200 });
    } catch (err) {
        console.error('Failed to fetch data from the database: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}

export async function POST(request: Request) {
    const tagData = await request.json();
    let { tag, title, description } = tagData;

    if (!tag || !title || !description) {
        return NextResponse.json({ error: 'Received invalid or incomplete tag data' }, { status: 400 });
    }

    if (!tag) {
        tag = `${title
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replaceAll(' ', '-')
            .toLowerCase()}`;
    }

    // Ensure the slug does not exceed 255 characters
    const MAX_FILENAME_LENGTH = 50;
    if (tag.length > MAX_FILENAME_LENGTH) {
        tag = tag.slice(0, MAX_FILENAME_LENGTH);
    }
    if (title.length > MAX_FILENAME_LENGTH) {
        title = title.slice(0, MAX_FILENAME_LENGTH);
    }

    const newTag = {
        tag,
        title,
        description
    };
    
    try {
        const { error } = await supabase.from('tags').insert([newTag]);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Successfully uploaded tag' }, { status: 201 });
    } catch (err) {
        console.error('Failed to upload tag:', err);
        return NextResponse.json({ error: 'Failed to upload tag' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const tagData = await request.json();
    let { id, tag, title, description } = tagData;

    if (!id) {
        return NextResponse.json({ error: 'Missing required identifier: id.' }, { status: 400 });
    }

    if (!tag) {
        tag = `${title
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replaceAll(' ', '-')
            .toLowerCase()}`;
    }

    // Ensure the slug does not exceed 255 characters
    const MAX_FILENAME_LENGTH = 50;
    if (tag.length > MAX_FILENAME_LENGTH) {
        tag = tag.slice(0, MAX_FILENAME_LENGTH);
    }
    if (title.length > MAX_FILENAME_LENGTH) {
        title = title.slice(0, MAX_FILENAME_LENGTH);
    }

    const updatedTag = {
        tag,
        title,
        description
    };

    // Remove undefined values
    Object.keys(updatedTag).forEach(key => {
        if (updatedTag[key as keyof typeof updatedTag] === undefined) {
            delete updatedTag[key as keyof typeof updatedTag];
        }
    });

    try {
        const { error } = await supabase
            .from('tags')
            .update(updatedTag)
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Successfully updated tag' }, { status: 200 });
    } catch (err) {
        console.error('Failed to update tag:', err);
        return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing required identifier: id.' }, { status: 400 })
        }
        
        const { error } = await supabase
            .from('tags')
            .delete()
            .eq('id', id);
            
        if (error) {
            throw error;
        }
        
        return NextResponse.json({ message: 'Successfully deleted tag' }, { status: 200 });
    } catch (err) {
        console.error('Failed to delete tag:', err);
        return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
    }
}