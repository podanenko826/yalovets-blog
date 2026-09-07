const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
    const { data: authors, error } = await supabase.from('authors').select('id, handle');
    if (error) console.error(error);
    if (!authors) return;
    console.log(`Found ${authors.length} authors.`);
    
    for (let author of authors) {
        const { data: posts } = await supabase.from('posts').select('id, author_id').eq('author_id', author.id);
        console.log(`Author ${author.handle} (id: ${author.id}) has ${posts.length} posts explicitly linked.`);
    }

    const { data: allPosts } = await supabase.from('posts').select('id, author_id');
    console.log(`Total posts in DB: ${allPosts.length}`);
    
    // Group by author_id
    const groups = {};
    for (let post of allPosts) {
        groups[post.author_id] = (groups[post.author_id] || 0) + 1;
    }
    console.log("Post count by author_id:");
    console.log(groups);
}
run();
