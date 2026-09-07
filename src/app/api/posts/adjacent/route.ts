import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const createdAt = searchParams.get('created_at');

    if (!createdAt) {
        return NextResponse.json({ error: 'created_at is required' }, { status: 400 });
    }

    try {
        // prevPost is newer
        const { data: prevData } = await supabase
            .from('posts')
            .select('slug, title, created_at')
            .gt('created_at', createdAt)
            .order('created_at', { ascending: true })
            .limit(1);

        // nextPost is older
        const { data: nextData } = await supabase
            .from('posts')
            .select('slug, title, created_at')
            .lt('created_at', createdAt)
            .order('created_at', { ascending: false })
            .limit(1);

        return NextResponse.json({
            prevPost: prevData && prevData.length > 0 ? prevData[0] : null,
            nextPost: nextData && nextData.length > 0 ? nextData[0] : null
        }, { status: 200 });
    } catch (err) {
        console.error('Failed to fetch adjacent posts: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}
