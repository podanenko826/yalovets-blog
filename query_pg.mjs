import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    // There is a built in REST endpoint for RPC. Let's see if we can do an RPC call to get columns.
    // Actually, I can just fetch the REST API root which returns the OpenAPI spec if I hit /rest/v1/?apikey=...
    // Wait, earlier I hit `/rest/v1/` and `swagger.definitions` was undefined.
    // In PostgREST 10+, the OpenAPI spec is at the root. Let's log the whole swagger object keys!
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/?apikey=' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const response = await fetch(url);
    const swagger = await response.json();
    console.log(Object.keys(swagger));
    if (swagger.components && swagger.components.schemas) {
        console.log(Object.keys(swagger.components.schemas.posts.properties));
    }
}

run();
