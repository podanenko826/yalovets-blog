import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    let dummy = {};
    const columnsToTry = ['post_title', 'name', 'heading'];
    
    for (const col of columnsToTry) {
        const payload = {};
        payload[col] = null; // if it complains about type, we know it exists!
        const { error } = await supabaseAdmin.from('posts').insert([payload]);
        if (error && error.code === 'PGRST204') {
             console.log(`Column ${col} DOES NOT EXIST`);
        } else {
             console.log(`Column ${col} EXISTS`);
        }
    }
}

run();
