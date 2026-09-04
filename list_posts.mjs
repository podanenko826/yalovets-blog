import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    try {
        const { data: posts, error } = await supabaseAdmin.from('posts').select('*').limit(1);
        if (error) {
            console.error(JSON.stringify(error, null, 2));
            return;
        }
        console.log(JSON.stringify(posts, null, 2));
    } catch (e) {
        console.error(e);
    }
}

run();
