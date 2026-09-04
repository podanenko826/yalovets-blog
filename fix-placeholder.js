require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    await supabase.from('authors').update({ avatar_url: '/ui/placeholder-pfp.png' }).eq('avatar_url', 'https://placeholder.com/150');
    await supabase.from('posts').update({ image_url: '/ui/addpost.png' }).eq('image_url', 'https://placeholder.com/150');
    console.log('Fixed placeholder URLs in DB');
}
run();
