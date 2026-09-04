import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    // Insert a valid row just to get the schema, then delete it.
    const dummyPost = {
        slug: 'dummy-schema-check',
        title: 'Dummy',
        author_id: 'a8b7c6d5-e4f3-a2b1-c0d9-e8f7a6b5c4d3', // just a random UUID in case it's a FK, though maybe not checked if disabled
    };
    const { data, error } = await supabaseAdmin.from('posts').insert([dummyPost]).select();
    if (error) {
        console.log("Insert failed:", error);
    } else {
        console.log("Columns:", Object.keys(data[0]));
        await supabaseAdmin.from('posts').delete().eq('slug', 'dummy-schema-check');
    }
}

run();
