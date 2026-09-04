import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const subscriberEmail = searchParams.get('email')?.split('/').at(-1);

    if (subscriberEmail) {
        try {
            const { data: subscriber, error } = await supabase
                .from('subscribers')
                .select('*')
                .eq('email', subscriberEmail)
                .single();

            if (error || !subscriber) {
                return NextResponse.json([], { status: 404 });
            }

            return NextResponse.json(subscriber, { status: 200 });
        } catch (err) {
            console.error('Failed to fetch data from the database: ', err);
            return NextResponse.json(err, { status: 500 });
        }
    } else {
        try {
            const { data: subscribers, error } = await supabase
                .from('subscribers')
                .select('*');

            if (error) {
                throw error;
            }

            return NextResponse.json(subscribers, { status: 200 });
        } catch (err) {
            console.error('Failed to fetch data from the database: ', err);
            return NextResponse.json(err, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    try {
        const { email, name, subscribed_at, is_active, is_article_updates_on, is_product_updates_on, is_service_updates_on } = await request.json();

        if (email) {
            const newDate = subscribed_at || new Date().toISOString();
            const newStatus = is_active || true;

            const newSubscriber = {
                email,
                name,
                subscribed_at: newDate,
                is_active: newStatus,
                is_article_updates_on: is_article_updates_on ?? true,
                is_product_updates_on: is_product_updates_on ?? true,
                is_service_updates_on: is_service_updates_on ?? true,
            };

            const { data, error } = await supabase.from('subscribers').insert([newSubscriber]).select();

            if (error) {
                console.error('Failed to create a subscriber', error);
                return new Response('Failed to create a subscriber', { status: 400 });
            }
            
            console.log('Subscriber successfully created:', data);
            return new Response(JSON.stringify(data), { status: 201 });
        } else {
            return new Response('Missing required fields', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to create a subscriber: ', err);
        return new Response('Failed to create a subscriber', { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, email, name, subscribed_at, is_active, is_article_updates_on, is_product_updates_on, is_service_updates_on } = await request.json();

        if (id && email && subscribed_at && is_active !== undefined) {
            const updatedSubscriber = {
                email,
                name,
                subscribed_at: subscribed_at,
                is_active,
                is_article_updates_on,
                is_product_updates_on,
                is_service_updates_on
            };

            const { data, error } = await supabase
                .from('subscribers')
                .update(updatedSubscriber)
                .eq('id', id)
                .select();

            if (error) {
                console.error('Failed to update a subscriber', error);
                return new Response('Failed to update a subscriber', { status: 400 });
            }

            console.log('Subscriber successfully updated:', data);
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response('Missing required fields', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to update a subscriber: ', err);
        return new Response('Failed to update a subscriber', { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Missing required identifier: email.' }, { status: 400 })
        }

        const { error } = await supabase
            .from('subscribers')
            .delete()
            .eq('email', email);
            
        if (error) {
            throw error;
        }
        
        return NextResponse.json({ message: 'Successfully deleted subscriber' }, { status: 200 });
    } catch (err) {
        console.error('Failed to delete subscriber:', err);
        return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
    }
}