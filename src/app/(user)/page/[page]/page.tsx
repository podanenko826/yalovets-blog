import '@/app/page.css';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { supabase } from '@/lib/supabase';
import PostList from '@/components/PostCard/PostList';
import PostCardSkeleton from '@/components/PostCard/PostCardSkeleton';
import PaginationSettings from '@/components/PaginationSettings';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';

async function PaginatedPostList({ offset, limit }: { offset: number, limit: number }) {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error || !posts) {
        return <p>Error loading posts.</p>;
    }

    return (
        <PostList displayMode="linear" limit={limit} style="full" postsData={posts} />
    );
}

export default async function BlogPage({ params }: { params: Promise<{ page: string }> }) {
    const { page } = await params;
    const currentPage = parseInt(page) || 1;

    // Read the user's preferred page size from cookies, default to 14
    const cookieStore = await cookies();
    const postsPerPage = parseInt(cookieStore.get('postsPerPage')?.value || '14');

    const offset = (currentPage - 1) * postsPerPage;

    // Get total count of posts for pagination
    const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

    const totalPosts = count || 0;
    const pageCount = Math.ceil(totalPosts / postsPerPage);

    if (currentPage < 1 || (pageCount > 0 && currentPage > pageCount)) {
        notFound();
    }

    // Pagination logic
    const rangeStart = Math.max(currentPage - 2, 1);
    const rangeEnd = Math.min(currentPage + 2, pageCount);
    const pageNumbers = [];
    for (let i = rangeStart; i <= rangeEnd; i++) {
        pageNumbers.push(i);
    }

    const mobileRangeStart = Math.max(currentPage - 1, 1);
    const mobileRangeEnd = Math.min(currentPage + 1, pageCount);
    const mobilePageNumbers = [];
    for (let i = mobileRangeStart; i <= mobileRangeEnd; i++) {
        mobilePageNumbers.push(i);
    }

    return (
        <main id="body">
            <div className="container posts" id="posts">
                <div className="container p-0">
                    <div className="container d-flex p-0 pt-3 mt-5 justify-content-between">
                        <h1 className="heading m-0 p-0 heading-large">Page {currentPage}</h1>

                        <PaginationSettings currentPostsPerPage={postsPerPage} />
                    </div>
                </div>

                <div className="row post-list">
                    <Suspense fallback={Array.from({ length: postsPerPage }).map((_, index) => (
                        <PostCardSkeleton key={index} style="full" />
                    ))}>
                        <PaginatedPostList offset={offset} limit={postsPerPage} />
                    </Suspense>
                </div>

                {pageCount > 1 && (
                    <div className="container mt-5 mb-2">
                        <div className="d-flex justify-content-center">
                            {/* First and previous page buttons */}
                            {currentPage > 1 && (
                                <>
                                    <Link href={`/page/1`} className="mb-5 mx-2">
                                        <button className="px-2 px-md-3 py-2">
                                            <MdOutlineKeyboardDoubleArrowLeft style={{ fontSize: '1.35rem' }} />
                                        </button>
                                    </Link>

                                    <Link href={`/page/${currentPage - 1}`} className="mb-5 mx-2">
                                        <button className="px-2 px-md-3 py-2">
                                            <MdOutlineArrowBackIos />
                                        </button>
                                    </Link>
                                </>
                            )}

                            {/* Mobile Page numbers */}
                            <div className="d-flex d-md-none">
                                {mobilePageNumbers.map(p => (
                                    <Link href={`/page/${p}`} key={p} className="mb-5 mx-2">
                                        <button className={`px-3 px-md-3 py-2 ${p === currentPage ? 'btn-filled' : ''}`}>{p}</button>
                                    </Link>
                                ))}
                            </div>

                            {/* Desktop Page numbers */}
                            <div className="d-none d-md-flex">
                                {pageNumbers.map(p => (
                                    <Link href={`/page/${p}`} key={p} className="mb-5 mx-2">
                                        <button className={`px-3 px-md-3 py-2 ${p === currentPage ? 'btn-filled' : ''}`}>{p}</button>
                                    </Link>
                                ))}
                            </div>

                            {/* Next and last page buttons */}
                            {currentPage < pageCount && (
                                <>
                                    <Link href={`/page/${currentPage + 1}`} className="mb-5 mx-2">
                                        <button className="px-2 px-md-3 py-2">
                                            <MdOutlineArrowForwardIos />
                                        </button>
                                    </Link>

                                    <Link href={`/page/${pageCount}`} className="mb-5 mx-2">
                                        <button className="px-1 px-md-3 py-2">
                                            <MdOutlineKeyboardDoubleArrowRight style={{ fontSize: '1.35rem' }} />
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
