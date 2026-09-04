require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    // First, find an author ID to assign these posts to
    const { data: authors, error: authorError } = await supabase.from('authors').select('id').limit(1);
    
    if (authorError || !authors || authors.length === 0) {
        console.error('No author found or error:', authorError);
        return;
    }
    
    const authorId = authors[0].id;
    
    const posts = [
        {
            slug: 'imprint',
            title: 'Imprint',
            description: 'Imprint details.',
            content: '# Imprint\n\nEdit this page to add your imprint details.',
            author_id: authorId,
            post_type: 'Article',
            read_time: 1,
            views_count: 0,
            image_url: 'https://placeholder.com/150'
        },
        {
            slug: 'privacy-policy',
            title: 'Privacy Policy',
            description: 'Privacy policy details.',
            content: '# Privacy Policy\n\nEdit this page to add your privacy policy.',
            author_id: authorId,
            post_type: 'Article',
            read_time: 1,
            views_count: 0,
            image_url: 'https://placeholder.com/150'
        }
    ];

    const { data, error } = await supabase.from('posts').upsert(posts, { onConflict: 'slug' });
    console.log('Result:', { data, error });
}

run();
