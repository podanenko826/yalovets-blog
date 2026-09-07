const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
    const createdAt = '2026-09-02T12:30:13.899 00:00'; // + replaced with space
    const { data: prevData, error: prevErr } = await supabase.from('posts').select('slug').gt('created_at', createdAt).limit(1);
    console.log("Prev:", prevData, prevErr);
}
run();
