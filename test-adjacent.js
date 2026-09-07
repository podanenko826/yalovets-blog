const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
    const { data: posts } = await supabase.from('posts').select('created_at').limit(3);
    console.log("Posts:", posts);
    if (!posts || posts.length === 0) return;
    const createdAt = posts[0].created_at;
    console.log("Using created_at:", createdAt);
    const { data: prevData, error: prevErr } = await supabase.from('posts').select('slug').gt('created_at', createdAt).limit(1);
    console.log("Prev:", prevData, prevErr);
    const { data: nextData, error: nextErr } = await supabase.from('posts').select('slug').lt('created_at', createdAt).limit(1);
    console.log("Next:", nextData, nextErr);
}
run();
