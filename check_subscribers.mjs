import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    const { data: subscribers, error } = await supabaseAdmin.from('subscribers').select('*');
    if (error) throw error;
    console.log(`Found ${subscribers.length} subscribers`);
}

run();
