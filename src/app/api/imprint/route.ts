import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('pages')
            .upsert({ slug: 'imprint', content }, { onConflict: 'slug' })
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Failed to update imprint' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error updating imprint:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
