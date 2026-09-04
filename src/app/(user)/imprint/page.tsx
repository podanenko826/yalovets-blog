import React from 'react';
import markdownToHtml from '@/services/markdownToHtml';
import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Disable static rendering for this page so it updates when DB changes

export default async function ImprintPage() {
    let content = 'Imprint not found.';

    try {
        const { data, error } = await supabase
            .from('pages')
            .select('content')
            .eq('slug', 'imprint')
            .single();

        if (data && !error) {
            content = data.content;
        }
    } catch (e) {
        console.error("Error fetching imprint:", e);
    }

    const htmlContent = await markdownToHtml(content);

    return (
        <main id="body">
            <div className='container py-5'>
                <article className="article" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        </main>
    );
}
