'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { getPostsCount } from '@/lib/posts';
import { AuthorItem } from '@/types';
import { usePostContext } from '@/components/PostContext';

import PostList from '@/components/PostList';

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';

export default function BlogPage({ params }: { params: { page: string } }) {
    const currentPage = parseInt(params.page, 10) || 1;
    const { posts } = usePostContext();
    const { lastKey } = usePostContext();
    const { fetchPosts } = usePostContext();

    const [authorData] = useState<AuthorItem[]>([]);

    const [postsCount, setPostsCount] = useState<number>(0);

    useEffect(() => {
        document.title = `Page ${currentPage || 1} / Yalovets Blog`;
    }, [document.URL]);

    useEffect(() => {
        const getPostsLength = async () => {
            const count = await getPostsCount();

            if (count) setPostsCount(count);
        }

        getPostsLength();
    }, [])

    const ARTICLES_PER_PAGE = 14; // Define the number of posts per page //? (should be 14 by design and adjustable to 29)
    
    const startIndex = posts.length > ((currentPage - 1) * ARTICLES_PER_PAGE) 
        ? ((currentPage - 1) * ARTICLES_PER_PAGE) 
        : 0;
    const pageCount = Math.ceil(postsCount / ARTICLES_PER_PAGE);

    const paginatedArticles = posts.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

    useEffect(() => {
        if (ARTICLES_PER_PAGE && params.page) {
            fetchPosts(ARTICLES_PER_PAGE, Number(params.page)); 
        }
    }, [ARTICLES_PER_PAGE, params.page])

    // Pagination logic
    const rangeStart = Math.max(currentPage - 2, 1); // At least 2 pages to the left
    const rangeEnd = Math.min(currentPage + 2, pageCount); // At least 2 pages to the right

    const mobileRangeStart = Math.max(currentPage - 1, 1); // At least 1 pages to the left
    const mobileRangeEnd = Math.min(currentPage + 1, pageCount); // At least 1 pages to the left

    const pageNumbers = [];
    for (let i = rangeStart; i <= rangeEnd; i++) {
        pageNumbers.push(i);
    }

    const mobilePageNumbers = [];
    for (let i = mobileRangeStart; i <= mobileRangeEnd; i++) {
        mobilePageNumbers.push(i);
    }

    return (
        <>
            {posts.length > 0 && paginatedArticles.length > 0 && authorData ? (
                <main id="body">
                    <div className="container posts" id="posts">
                        <h1 className="heading heading-large mt-5">Page {currentPage}</h1>
                        <button onClick={() => console.log(postsCount)}>
                            Print Count
                        </button>
                        <button onClick={() => console.log(posts)}>
                            Print Posts
                        </button>
                        <button onClick={() => console.log(lastKey)}>
                            Print Last Key
                        </button>
                        <div className="row post-list">
                            <PostList displayMode='linear' limit={ARTICLES_PER_PAGE} style='full' postsData={paginatedArticles} />
                        </div>

                        <div className="container">
                            <div className="d-flex justify-content-center">
                                {/* First and last page buttons */}
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
                                    {mobilePageNumbers.map(page => (
                                        <a href={`/page/${page}`} key={page} className="mb-5 mx-2">
                                            <button className={`px-3 px-md-3 py-2 ${page === currentPage ? 'btn-filled' : ''}`}>{page}</button>
                                        </a>
                                    ))}
                                </div>
                                {/* Page numbers */}
                                <div className="d-none d-md-flex">
                                    {pageNumbers.map(page => (
                                        <Link href={`/page/${page}`} key={page} className="mb-5 mx-2">
                                            <button className={`px-3 px-md-3 py-2 ${page === currentPage ? 'btn-filled' : ''}`}>{page}</button>
                                        </Link>
                                    ))}
                                </div>

                                {/* Next page button */}
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
                    </div>
                </main>
            ): (
                <>
                    <main id='body'>        
                        <div className='container'>
                            <h1 className="heading heading-large mt-5">Page {currentPage}</h1>

                            <div className='loading-spinning my-5'></div>
                        </div>
                    </main>
                </>
            )}
        </>
    );
}
