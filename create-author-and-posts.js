require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    let { data: authors, error: authorError } = await supabase.from('authors').select('id');
    
    let authorId;
    
    if (!authors || authors.length === 0) {
        console.log("No authors found, creating one...");
        const newAuthor = {
            handle: "denis-podanenko",
            full_name: "Denis Podanenko",
            email: "podanenko826@gmail.com",
            bio: "Blog Admin",
            avatar_url: "https://placeholder.com/150",
            role: "admin",
            social_links: {}
        };
        const { data, error } = await supabase.from('authors').insert(newAuthor).select();
        if (error) {
            console.error('Failed to create author:', error);
            return;
        }
        authorId = data[0].id;
    } else {
        authorId = authors[0].id;
    }
    
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

    const { data, error } = await supabase.from('posts').upsert(posts, { onConflict: 'slug' }).select();
    console.log('Posts created:', { error });
}

run();
