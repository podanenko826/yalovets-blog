import { Suspense } from 'react';
import React from 'react';

import { getAuthors } from '@/lib/authors';
import { supabase } from '@/lib/supabase';
import PostEditor from '@/components/DynamicEditor';

export const dynamic = "force-dynamic"; // disables prerender

const EditImprintPage = async () => {
    const authorData = await getAuthors();

    let content = '';
    
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

    return (
        <div className="container-fluid mt-3">
            <div className="container">
                <Suspense fallback={<p>Loading...</p>}>
                    <PostEditor markdown={content} slug={''} authorData={authorData} legalMdx='imprint' />
                </Suspense>
            </div>
        </div>
    );
};

export default EditImprintPage;
