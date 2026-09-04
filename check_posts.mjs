import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    const { data: posts, error } = await supabaseAdmin.from('posts').select('*');
    if (error) throw error;
    console.log(`Found ${posts.length} posts`);
    if (posts.length > 0) {
        console.log(posts.map(p => p.slug));
    }
}

run();
