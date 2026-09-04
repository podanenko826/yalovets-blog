import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { data: authors, error } = await supabase
            .from('authors')
            .select('email');

        if (error) {
            throw error;
        }

        const emailAddresses: string[] = authors ? authors.map(author => author.email) : [];

        return NextResponse.json(emailAddresses, { status: 200 });
    } catch (err) {
        console.error('Failed to fetch author list:', err);
        return NextResponse.json(err, { status: 500 });
    }
}
