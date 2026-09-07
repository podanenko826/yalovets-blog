import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('slug')?.split('/').at(-1);

    if (!postSlug) {
        return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    try {
        const { data: post, error } = await supabase
            .from('posts')
            .select('*, post_tags ( tags (*) )')
            .eq('slug', postSlug)
            .single();

        if (error) {
            throw error;
        }

        let formattedPost = post;

        if (post) {
            const tags = (post as any).post_tags?.map((pt: any) => pt.tags).filter(Boolean) || [];
            delete (post as any).post_tags;
            formattedPost = { ...post, tags };
        }

        // Return as an array to maintain compatibility with existing frontend expecting an array
        return NextResponse.json(formattedPost ? [formattedPost] : [], { status: 200 });
    } catch (err) {
        console.error('Failed to fetch data from the database: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}

export { POST, PUT, DELETE } from "@/app/api/posts/route";