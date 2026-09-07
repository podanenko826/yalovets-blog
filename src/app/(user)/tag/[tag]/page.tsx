import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostList from '@/components/PostCard/PostList';
import postCardStyles from '@/components/PostCard/postCard.module.css';

import { supabase } from '@/lib/supabase';

interface Props {
    params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { tag } = await params;

    const { data: tagData } = await supabase
        .from('tags')
        .select('*')
        .eq('tag', tag)
        .single();

    if (!tagData) {
        notFound();
    }

    return {
        title: `${tagData.title} / AWS By Denis`,
        description: tagData.description || `Posts about ${tagData.title}`,
    };
}

export default async function TagDashboard({ params }: Props) {
    const { tag } = await params;
    const POSTS_PER_PAGE = 28;

    const { data: tagData, error } = await supabase
        .from('tags')
        .select('*')
        .eq('tag', tag)
        .single();

    if (error || !tagData) {
        notFound();
    }

    return (
        <main id="body">
            <div className="container">
                <div className="container mb-5">
                    <div className={`${postCardStyles.profile_info} d-flex mt-5`}>
                        <h1 className="py-3 m-0 heading-xlarge" id="col-heading-1">
                            #{tagData.tag} | {tagData.title}
                        </h1>
                    </div>
                    <div className="my-5 d-flex">
                        <h3 className="m-0 p-0 col-9 subheading-smaller" id="col-text">
                            {tagData.description}
                        </h3>
                    </div>
                </div>

                <div className="container posts" id="posts">
                    <div className="row post-list mb-5">
                        <PostList displayMode="tag" limit={POSTS_PER_PAGE} style="full" infiniteScroll tag={tagData.tag} />
                    </div>
                </div>
            </div>
        </main>
    );
}
