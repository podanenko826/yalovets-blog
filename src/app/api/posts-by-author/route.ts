import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const authorEmail: string | undefined = searchParams.get('email') || undefined;
    const limit: number | undefined = Number(searchParams.get('limit')) || undefined;
    const offset: number = Number(searchParams.get('offset')) || 0;

    if (!authorEmail) {
        return NextResponse.json({
            posts: []
        }, { status: 400 });
    }

    try {
        // First get the author ID based on the email
        const { data: author, error: authorError } = await supabase
            .from('authors')
            .select('id')
            .eq('email', authorEmail)
            .single();

        if (authorError || !author) {
            return NextResponse.json({ posts: [] }, { status: 404 });
        }

        // Now query posts by author_id
        let query = supabase
            .from('posts')
            .select('*')
            .eq('author_id', author.id)
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.range(offset, offset + limit - 1);
        }

        const { data: postsData, error: postsError } = await query;

        if (postsError) {
            throw postsError;
        }

        return NextResponse.json({
            posts: (postsData || [])
        }, { status: 200 });
    } catch (err) {
        console.error('Failed to fetch data from the database: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}

export { POST, PUT, DELETE } from "@/app/api/posts/route";