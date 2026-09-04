import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit: number | undefined = Number(searchParams.get('limit')) || undefined;

    try {
        let query = supabase
            .from('posts')
            .select('*')
            .order('views_count', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data: postsData, error } = await query;

        if (error) {
            throw error;
        }

        const posts = (postsData || []);
        
        return NextResponse.json(posts, { status: 200 });
    } catch (err) {
        console.error('Failed to fetch data from the database: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}

export { POST, PUT, DELETE } from "@/app/api/posts/route";