import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ error: 'Invalid post ID format' }, { status: 400 });
    }

    try {
        // First, fetch the current views_count
        const { data: post, error: fetchError } = await supabase
            .from('posts')
            .select('views_count')
            .eq('id', id)
            .single();

        if (fetchError || !post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Increment the count
        const newCount = (post.views_count || 0) + 1;

        // Update the database
        const { data: updatedPost, error: updateError } = await supabase
            .from('posts')
            .update({ views_count: newCount })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json(updatedPost, { status: 200 });
    } catch (err) {
        console.error('Failed to increment view count: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}
