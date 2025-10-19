'use client';
import { AuthorItem } from '@/types';
import React, { FC, lazy, use, useEffect, useState } from 'react';

import Image from 'next/image';

import postCardStyles from '@/components/PostCard/PostCard.module.css';

import { usePathname } from 'next/navigation';
import { usePostStore } from '@/components/posts/store';
import { useAuthorStore } from '@/components/authors/store';

import LoadingSkeleton from '@/components/LoadingSkeleton';
import PostList from '@/components/PostCard/PostList';

const PostPreviewModal = lazy(() => import('@/components/Modals/PostPreviewModal'));
const ArticleModal = lazy(() => import('@/components/Modals/ArticleModal'));
interface AuthorPageProps {
    params: Promise<{ authorKey: string }>;
}

const AuthorPage: FC<AuthorPageProps> = ({ params }: AuthorPageProps) => {
    const { authorKey } = use(params);

    const { selectedPost } = usePostStore();
    const { fetchAuthors } = useAuthorStore();

    const [authorData, setAuthorData] = useState<AuthorItem | null>(null);

    const pathParts = usePathname().split('/').filter(Boolean);
    // If there's only one part (e.g., /some-slug), assume it's a modal
    const slug = pathParts.length === 1 ? pathParts[0] : '';

    const POSTS_PER_PAGE = 28;

    const [showModal, setShowModal] = useState(!!slug);

    useEffect(() => {
        if (!slug) {
            setTimeout(() => setShowModal(true), 500);
        }
    }, [slug]);

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on route change

        // loadPostsFromStorage();
    }, []);

    useEffect(() => {
        const fetchAuthorsData = async () => {
            const authors = await fetchAuthors();
            
            const author = authors.find(author => author.authorKey === authorKey);
            if (author) setAuthorData(author);
        };

        fetchAuthorsData();
    }, [fetchAuthors, authorKey]);


    useEffect(() => {
        if (!selectedPost && typeof document !== 'undefined') {
            document.title = `${authorData?.fullName || 'Author'} / Yalovets Blog`;
        }
    }, [authorData, selectedPost]);

    return (
        <>
            {showModal && <PostPreviewModal />}
            <ArticleModal slug={slug || ''} />
            {authorData ? (
                <div className="container">
                    <div className="container mb-5">
                        <div className={`${postCardStyles.profile_info} d-flex justify-content-center mt-4`}>
                            <Image className={`${postCardStyles.pfp}`} src={authorData.profileImageUrl} alt="pfp" width={42.5} height={42.5} />
                            <h2 className="p-2 m-0" id="col-heading-1">
                                {authorData.fullName} {authorData.isGuest && <span className="badge badge-guest">Guest</span>}
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
                                    {authorData.fullName}
                                    {authorData.fullName.at(-1)?.toLowerCase() === 's' ? "'" : "'s"} posts
                                </h3>
                            </div>
                            <PostList displayMode="author" limit={POSTS_PER_PAGE} style="full" infiniteScroll authorEmail={authorData.email} />
                        </div>
                    </div>
                </div>
            ) : (
                <LoadingSkeleton />
            )}
        </>
    );
};

export default AuthorPage;
