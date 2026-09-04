import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/?apikey=' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const response = await fetch(url);
const swagger = await response.json();
console.log(swagger.definitions ? Object.keys(swagger.definitions) : 'No definitions');
