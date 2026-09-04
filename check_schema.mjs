import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    // try to insert an empty object to get the null constraint error, which will give me all the columns
    const { error: insertError } = await supabaseAdmin.from('posts').insert([{}]).select();
    console.log(insertError);
}

run();
