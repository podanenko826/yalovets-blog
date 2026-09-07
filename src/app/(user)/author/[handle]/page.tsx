import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import postCardStyles from '@/components/PostCard/PostCard.module.css';
import PostList from '@/components/PostCard/PostList';

import { supabase } from '@/lib/supabase';

interface Props {
    params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { handle } = await params;

    const { data: author } = await supabase
        .from('authors')
        .select('*')
        .eq('handle', handle)
        .single();

    if (!author) {
        notFound();
    }

    const authorData = author;

    return {
        title: `${authorData.full_name} / AWS By Denis`,
        description: authorData.bio || `Posts by ${authorData.full_name}`,
    };
}

export default async function AuthorDashboard({ params }: Props) {
    const { handle } = await params;
    const POSTS_PER_PAGE = 28;

    const { data: author, error } = await supabase
        .from('authors')
        .select('*')
        .eq('handle', handle)
        .single();

    if (error || !author) {
        notFound();
    }

    const authorData = author;

    return (
        <main id="body">
            <div className="container">
                <div className="container mb-5">
                    <div className={`${postCardStyles.profile_info} d-flex justify-content-center align-items-center mt-4`}>
                        <Image className={`${postCardStyles.pfp}`} src={authorData.avatar_url || '/ui/placeholder-pfp.png'} alt="pfp" width={42.5} height={42.5} />
                        <h2 className="p-2 m-0" id="col-heading-1">
                            {authorData.full_name} {authorData.role === 'guest' && <span className="badge badge-guest">Guest</span>}
                        </h2>
                    </div>
                    <div className="my-4 d-flex justify-content-center">
                        <h5 className="m-0 p-0 col-9 subheading-small text-center" id="col-text">
                            {authorData.bio}
                        </h5>
                    </div>
                </div>

                <div className="container posts" id="posts">
                    <div className="row post-list mb-5">
                        <div className="d-flex justify-content-center p-0 m-0 mt-5">
                            <h3 id="col-text">
                                {authorData.full_name}
                                {authorData.full_name.at(-1)?.toLowerCase() === 's' ? "'" : "'s"} posts
                            </h3>
                        </div>
                        <PostList displayMode="author" limit={POSTS_PER_PAGE} style="full" infiniteScroll authorEmail={authorData.email} />
                    </div>
                </div>
            </div>
        </main>
    );
}
