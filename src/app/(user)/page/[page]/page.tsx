import React from 'react';

import {getSortedPosts} from '@/lib/posts';
import {getUsers} from '@/lib/users';
import {AuthorItem, PostItem} from '@/types';
import dynamic from 'next/dynamic';

const PostCard = dynamic(() => import('@/components/PostCard'), {ssr: false});

const ARTICLES_PER_PAGE = 10;

export async function generateStaticParams() {
    const posts = await getSortedPosts();
    const pageCount = Math.ceil(posts.length / ARTICLES_PER_PAGE);

    return Array.from({length: pageCount}, (_, i) => ({
        page: (i + 1).toString(),
    }));
}

export default async function BlogPage({params}: {params: {page: string}}) {
    const currentPage = parseInt(params.page, 10) || 1;
    const posts: PostItem[] = await getSortedPosts();
    const authorData: AuthorItem[] = await getUsers();

    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    const paginatedArticles = posts.slice(
        startIndex,
        startIndex + ARTICLES_PER_PAGE
    );
    const pageCount = Math.ceil(posts.length / ARTICLES_PER_PAGE);
    return (
        <main>
            <div className="container posts" id="posts">
                <h1 className="heading-large mt-5">Page {currentPage}</h1>
                <div className="row post-list">
                    {paginatedArticles.map((post: PostItem, index) => (
                        <PostCard
                            post={post}
                            style="full"
                            index={index}
                            key={index}
                            authorData={
                                authorData.find(
                                    author => author.email === post.email
                                ) as AuthorItem
                            }
                        />
                    ))}
                </div>
                <div className="row">
                    <div className="d-flex pagination justify-content-center">
                        {Array.from({length: pageCount}, (_, i) => (
                            <a
                                className="mb-5 mx-2"
                                key={i}
                                href={`/page/${i + 1}`}>
                                <button className="px-3 py-2">{i + 1}</button>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
