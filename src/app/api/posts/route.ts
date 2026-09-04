import { PostItem } from '@/types';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const limit: number | undefined = Number(searchParams.get('limit')) || undefined;
    const offset: number = Number(searchParams.get('offset')) || 0;

    try {
        let query = supabase.from('posts').select('*').order('created_at', { ascending: false });

        if (limit) {
            query = query.range(offset, offset + limit - 1);
        }

        const { data: postsData, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json({
            posts: (postsData || []),
        }, { status: 200 });
    } catch (err) {
        console.error('Failed to fetch data from the database: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('slug')?.split('/').at(-1);

    const postData = await request.json();
    const { author_id, description, image_url, post_type, read_time, views_count, sponsored_by, content } = postData;
    let { slug, title, sponsor_url, created_at, updated_at } = postData;

    if (!author_id || !title || !description || !image_url || !read_time || !post_type || !content) {
        return NextResponse.json({ error: 'Received invalid or incomplete post data' }, { status: 400 });
    }

    if (!slug && postSlug) {
        slug = postSlug;
    }

    if (!slug) {
        slug = `${title
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replaceAll(' ', '-')
            .toLowerCase()}`;
    }

    let modifiedSponsorUrl: string | undefined = undefined;
    if (sponsor_url && !sponsor_url.startsWith('http://') && !sponsor_url.startsWith('https://')) {
        modifiedSponsorUrl = `https://${sponsor_url}`;
    }

    // Ensure the slug does not exceed 255 characters
    const MAX_FILENAME_LENGTH = 150;
    if (slug.length > MAX_FILENAME_LENGTH) {
        slug = slug.slice(0, MAX_FILENAME_LENGTH);
    }
    if (title.length > MAX_FILENAME_LENGTH) {
        title = title.slice(0, MAX_FILENAME_LENGTH);
    }

    const newPost = {
        author_id,
        slug,
        title,
        description,
        content,
        image_url: image_url || null,
        created_at: created_at || new Date().toISOString(),
        updated_at: created_at || new Date().toISOString(),
        post_type: post_type || 'article',
        read_time: read_time || 0,
        views_count: views_count || 0,
        sponsored_by: sponsored_by || null,
        sponsor_url: modifiedSponsorUrl || null
    };
    
    try {
        const { error } = await supabase.from('posts').insert([newPost]);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Successfully uploaded post' }, { status: 201 });
    } catch (err) {
        console.error('Failed to upload post:', err);
        return NextResponse.json({ error: 'Failed to upload post' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const postData = await request.json();
    const { id, title, description, content, image_url, post_type, read_time, sponsored_by, sponsor_url } = postData;
    let { updated_at } = postData;

    if (!id) {
        return NextResponse.json({ error: 'Missing required identifier: id.' }, { status: 400 });
    }

    let modifiedSponsorUrl: string | undefined = undefined;
    if (sponsor_url && !sponsor_url.startsWith('http://') && !sponsor_url.startsWith('https://')) {
        modifiedSponsorUrl = `https://${sponsor_url}`;
    }

    updated_at = updated_at || new Date().toISOString();

    const updatedPost = {
        title,
        description,
        content,
        image_url: image_url || null,
        updated_at,
        post_type: post_type,
        read_time: read_time,
        sponsored_by: sponsored_by || null,
        sponsor_url: modifiedSponsorUrl || null
    };

    // Remove undefined values
    Object.keys(updatedPost).forEach(key => {
        if (updatedPost[key as keyof typeof updatedPost] === undefined) {
            delete updatedPost[key as keyof typeof updatedPost];
        }
    });

    try {
        const { error } = await supabase
            .from('posts')
            .update(updatedPost)
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Successfully updated post' }, { status: 200 });
    } catch (err) {
        console.error('Failed to update post:', err);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing required identifier: id.' }, { status: 400 })
        }
        
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);
            
        if (error) {
            throw error;
        }
        
        return NextResponse.json({ message: 'Successfully deleted post' }, { status: 200 });
    } catch (err) {
        console.error('Failed to delete post:', err);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}