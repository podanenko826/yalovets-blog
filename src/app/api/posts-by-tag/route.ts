import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tag: string | undefined = searchParams.get('tag') || undefined;
    const limit: number | undefined = Number(searchParams.get('limit')) || undefined;
    const offset: number = Number(searchParams.get('offset')) || 0;

    if (!tag) {
        return NextResponse.json({
            posts: []
        }, { status: 400 });
    }

    try {
        // Find the tag ID first
        const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .select('id')
            .eq('tag', tag)
            .single();

        if (tagError || !tagData) {
            return NextResponse.json({ posts: [] }, { status: 404 });
        }

        // Get post IDs for this tag
        const { data: postTags, error: postTagsError } = await supabase
            .from('post_tags')
            .select('post_id')
            .eq('tag_id', tagData.id);

        if (postTagsError || !postTags || postTags.length === 0) {
            return NextResponse.json({ posts: [] }, { status: 200 });
        }

        const postIds = postTags.map(pt => pt.post_id);

        // Fetch the posts along with their full tags
        let query = supabase
            .from('posts')
            .select(`
                *,
                post_tags (
                    tags (*)
                )
            `)
            .in('id', postIds)
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.range(offset, offset + limit - 1);
        }

        const { data: postsData, error: postsError } = await query;

        if (postsError) {
            throw postsError;
        }

        // Flatten tags exactly like the main posts endpoint
        const formattedPosts = (postsData || []).map((post: any) => {
            const tags = post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || [];
            delete post.post_tags;
            return { ...post, tags };
        });

        return NextResponse.json({
            posts: formattedPosts,
        }, { status: 200 });

    } catch (err) {
        console.error('Failed to fetch data from the database: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}
