import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    const { data: posts, error } = await supabaseAdmin.from('posts').select('*');
    if (error) throw error;

    const idsToDelete = posts
        .filter(p => typeof p.title === 'string' && (p.title.trim().startsWith('{') || p.title.trim().startsWith('[')))
        .map(p => p.id);

    if (idsToDelete.length > 0) {
        console.log(`Deleting ${idsToDelete.length} dummy DynamoDB posts...`);
        const { error: deleteError } = await supabaseAdmin.from('posts').delete().in('id', idsToDelete);
        if (deleteError) throw deleteError;
        console.log("Deleted successfully!");
    } else {
        console.log("No dummy DynamoDB posts found.");
    }
}

run();
