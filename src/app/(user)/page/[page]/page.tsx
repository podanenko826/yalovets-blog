'use client';
import React, { useEffect, useState } from 'react';

import { getSortedPosts } from '@/lib/posts';
import { getAuthors } from '@/lib/authors';
import { AuthorItem, PostItem } from '@/types';
import dynamic from 'next/dynamic';

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import Link from 'next/link';
import { usePostContext } from '@/components/PostContext';
import moment from 'moment';

const LazyPostCard = dynamic(() => import('@/components/LazyPostCard'), { ssr: false });

export default function BlogPage({ params }: { params: { page: string } }) {
    const currentPage = parseInt(params.page, 10) || 1;
    const { posts, setPosts } = usePostContext();
    const { authors, setAuthors } = usePostContext();

    const [postsData, setPostsData] = useState<PostItem[]>([]);
    const [authorData, setAuthorData] = useState<AuthorItem[]>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                console.log('Fetching sorted posts...');
                let sorted: PostItem[] | null = null;
                if (posts.length > 0) {
                    const postContextData = [...posts];

                    //? Sort posts gotten from usePostContext
                    sorted = postContextData.sort((a, b) => {
                        const format = 'DD-MM-YYYY';
                        const dateOne = moment(a.date, format);
                        const dateTwo = moment(b.date, format);

                        return dateTwo.diff(dateOne); // Descending order
                    });
                    console.log('Got posts from PostContext:', sorted);
                } else {
                    sorted = await getSortedPosts();
                    console.log('Fetched sorted posts:', sorted);
                }

                if (!Array.isArray(sorted)) {
                    console.error('Error: Sorted posts is not an array:', sorted);
                    return;
                }

                // Ensure all posts have the expected structure
                sorted.forEach((post, index) => {
                    if (typeof post !== 'object' || post === null) {
                        console.error(`Post at index ${index} is invalid:`, post);
                    }
                });

                if (posts.length === 0) {
                    setPosts(sorted);
                }

                setPostsData(sorted);
            } catch (error) {
                console.error('Error in getData:', error);
            }
        };

        getData();
    }, []);

    useEffect(() => {
        const getAuthorsData = async () => {
            if (authors.length > 0 && authorData.length === 0) {
                const authorData = [...authors];
                setAuthorData(authorData);
            } else if (authors.length === 0 && authorData.length === 0) {
                const authorData = await getAuthors();
                setAuthorData(authorData);
                setAuthors(authorData);
            }
        };

        getAuthorsData();
    }, [authorData]);

    const ARTICLES_PER_PAGE = 15; // Define the number of posts per page //? (should be 15 by design and adjustable to 30)
    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    const paginatedArticles = postsData.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
    const pageCount = Math.ceil(posts.length / ARTICLES_PER_PAGE);

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
            {postsData && authorData && (
                <main>
                    <div className="container posts" id="posts">
                        <h1 className="heading heading-large mt-5">Page {currentPage}</h1>
                        <div className="row post-list">
                            {paginatedArticles.map((post: PostItem, index) => (
                                <LazyPostCard post={post} style="full" index={index} key={index} authorData={authorData.find(author => author.email === post.email) as AuthorItem} />
                            ))}
                        </div>
                        <div className="container">
                            <div className="d-flex justify-content-center">
                                {/* First page button */}
                                {currentPage > 1 && (
                                    <Link href={`/page/1`} className="mb-5 mx-2">
                                        <button className="px-2 px-md-3 py-2">
                                            <MdOutlineKeyboardDoubleArrowLeft style={{ fontSize: '1.35rem' }} />
                                        </button>
                                    </Link>
                                )}

                                {/* Previous page button */}
                                {currentPage > 1 && (
                                    <Link href={`/page/${currentPage - 1}`} className="mb-5 mx-2">
                                        <button className="px-2 px-md-3 py-2">
                                            <MdOutlineArrowBackIos />
                                        </button>
                                    </Link>
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
                                    <Link href={`/page/${currentPage + 1}`} className="mb-5 mx-2">
                                        <button className="px-2 px-md-3 py-2">
                                            <MdOutlineArrowForwardIos />
                                        </button>
                                    </Link>
                                )}

                                {/* Last page button */}
                                {currentPage < pageCount && (
                                    <Link href={`/page/${pageCount}`} className="mb-5 mx-2">
                                        <button className="px-1 px-md-3 py-2">
                                            <MdOutlineKeyboardDoubleArrowRight style={{ fontSize: '1.35rem' }} />
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}
