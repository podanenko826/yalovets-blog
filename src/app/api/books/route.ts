import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { data: books, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json(books || [], { status: 200 });
    } catch (err) {
        console.error('Failed to fetch books from the database: ', err);
        return NextResponse.json(err, { status: 500 });
    }
}

export async function POST(request: Request) {
    const postData = await request.json();
    const { author_id, description, image_url, purchase_links } = postData;
    let { title, created_at } = postData;

    if (!author_id || !title || !description) {
        return NextResponse.json({ error: 'Received invalid or incomplete book data' }, { status: 400 });
    }

    const MAX_FILENAME_LENGTH = 150;
    if (title.length > MAX_FILENAME_LENGTH) {
        title = title.slice(0, MAX_FILENAME_LENGTH);
    }

    const newBook = {
        author_id,
        title,
        description,
        image_url: image_url || null,
        purchase_links: purchase_links || null,
        created_at: created_at || new Date().toISOString()
    };
    
    try {
        const { error } = await supabase.from('books').insert([newBook]);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Successfully uploaded book' }, { status: 201 });
    } catch (err) {
        console.error('Failed to upload book:', err);
        return NextResponse.json({ error: 'Failed to upload book' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const postData = await request.json();
    const { id, title, description, image_url, purchase_links } = postData;

    if (!id) {
        return NextResponse.json({ error: 'Missing required identifier: id.' }, { status: 400 });
    }

    const updatedBook = {
        title,
        description,
        image_url: image_url || null,
        purchase_links: purchase_links || null
    };

    // Remove undefined values
    Object.keys(updatedBook).forEach(key => (updatedBook as any)[key] === undefined && delete (updatedBook as any)[key]);

    try {
        const { error } = await supabase
            .from('books')
            .update(updatedBook)
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Successfully updated book' }, { status: 200 });
    } catch (err) {
        console.error('Failed to update book:', err);
        return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing required identifier: id.' }, { status: 400 })
        }
        
        const { error } = await supabase
            .from('books')
            .delete()
            .eq('id', id);
            
        if (error) {
            throw error;
        }
        
        return NextResponse.json({ message: 'Successfully deleted book' }, { status: 200 });
    } catch (err) {
        console.error('Failed to delete book:', err);
        return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
    }
}