import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const accountEmail = searchParams.get('email')?.split('/').at(-1);

    if (accountEmail) {
        try {
            const { data: author, error } = await supabaseAdmin
                .from('authors')
                .select('*')
                .eq('email', accountEmail)
                .single();

            if (error || !author) {
                return NextResponse.json([], { status: 404 });
            }

            return NextResponse.json(author, { status: 200 });
        } catch (err) {
            console.error('Failed to fetch author from the database: ', err);
            return NextResponse.json(err, { status: 500 });
        }
    } else {
        try {
            const { data: authors, error } = await supabaseAdmin
                .from('authors')
                .select('*');

            if (error) {
                throw error;
            }

            return NextResponse.json(authors || [], { status: 200 });
        } catch (err) {
            console.error('Failed to fetch authors from the database: ', err);
            return NextResponse.json(err, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    try {
        const { email, bio, full_name, avatar_url, role, social_links } = await request.json();

        if (email && full_name && bio) {
            const handle = `${full_name
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .replaceAll(' ', '')
                .replaceAll('-', '')
                .toLowerCase()}`;

            const { Email = '', GitHub = '', Instagram = '', LinkedIn = '', Twitter = '', Facebook = '', Reddit = '' } = social_links || {};

            const formattedSocialLinks = {
                email: Email,
                github: GitHub,
                instagram: Instagram,
                linkedin: LinkedIn,
                twitter: Twitter,
                facebook: Facebook,
                reddit: Reddit,
            };

            const newAuthor = {
                email,
                handle,
                bio,
                full_name: full_name,
                avatar_url: avatar_url || null,
                role: role || 'guest',
                social_links: formattedSocialLinks,
            };

            const { data, error } = await supabaseAdmin.from('authors').insert([newAuthor]).select();

            if (error) {
                console.error('Failed to create an author', error);
                return new Response('Failed to create an author', { status: 400 });
            }
            
            console.log('Author successfully created:', data);
            return new Response(JSON.stringify(data), { status: 201 });
        } else {
            return new Response('Missing required fields', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to create an author: ', err);
        return new Response('Failed to create an author', { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, email, bio, full_name, avatar_url, role, social_links } = await request.json();

        if (id && full_name && bio) {
            let handle = `${full_name
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .replaceAll(' ', '')
                .replaceAll('-', '')
                .toLowerCase()}`;

            const { Email = '', GitHub = '', Instagram = '', LinkedIn = '', Twitter = '', Facebook = '', Reddit = '' } = social_links || {};

            const formattedSocialLinks = {
                email: Email,
                github: GitHub,
                instagram: Instagram,
                linkedin: LinkedIn,
                twitter: Twitter,
                facebook: Facebook,
                reddit: Reddit,
            };

            const updatedAuthor = {
                email,
                handle,
                bio,
                full_name: full_name,
                avatar_url: avatar_url || null,
                role: role || 'guest',
                social_links: formattedSocialLinks,
            };

            // Remove undefined values
            Object.keys(updatedAuthor).forEach(key => (updatedAuthor as any)[key] === undefined && delete (updatedAuthor as any)[key]);

            const { data, error } = await supabaseAdmin
                .from('authors')
                .update(updatedAuthor)
                .eq('id', id)
                .select();

            if (error) {
                console.error('Failed to update an author', error);
                return new Response('Failed to update an author', { status: 400 });
            }

            console.log('Author successfully updated:', data);
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response('Missing required fields', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to update an author: ', err);
        return new Response('Failed to update an author', { status: 500 });
    }
}
