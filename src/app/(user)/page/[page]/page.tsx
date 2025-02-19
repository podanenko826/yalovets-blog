'use client';
import '@/app/page.css';
import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { getPostsCount, sortPosts } from '@/lib/posts';
import { AuthorItem, PaginationEntry, PaginationState, PostItem } from '@/types';

import PostList from '@/components/PostCard/PostList';
import PaginationPreferences from '@/components/Modals/PaginationPreferences';

const NavBar = lazy(() => import('@/components/NavBar'));
const Footer = lazy(() => import('@/components/Footer'));

const PostPreviewModal = lazy(() => import('@/components/Modals/PostPreviewModal'));
const ArticleModal = lazy(() => import('@/components/Modals/ArticleModal'));

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import { MdSettings } from 'react-icons/md';
import { notFound, usePathname } from 'next/navigation';
import { usePostStore } from '@/components/posts/store';
import { usePaginationStore } from '@/components/pagination/store';
import { useAuthorStore } from '@/components/authors/store';
import { useUserConfigStore } from '@/components/userConfig/store';
import LoadingBanner from '@/components/Modals/LoadingBanner';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function BlogPage({ params }: { params: { page: string } }) {
    const currentPage = parseInt(params.page, 10) || 1;
    const { posts, selectedPost, fetchPostsByPage, loadPostsFromStorage } = usePostStore();
    const { postsPerPage, loadUserConfigFromStorage } = useUserConfigStore();
    const { authors, fetchAuthors } = useAuthorStore();
    const { pagination, setPagination, originalPagination, postCount, setPostCount, fetchPagination } = usePaginationStore();

    const [paginationModalOpen, setPaginationModalOpen] = useState<boolean>(false);

    const [paginationData, setPaginationData] = useState<PaginationState>({ totalPages: 1, paginationData: {} });

    const [loading, setLoading] = useState<boolean>(false);

    const currentPath = usePathname();
    const slug = !currentPath.split('/').includes('page') ? currentPath.split('/').pop() : '';

    useEffect(() => {
        loadPostsFromStorage();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on route change

        loadUserConfigFromStorage();
    }, []);

    useEffect(() => {
        if (!selectedPost && typeof document !== 'undefined') {
            document.title = `Page ${currentPage || 1} / Yalovets Blog`;
        }
    }, [selectedPost]);

    if (Object.keys(pagination.paginationData).length > 0 && parseInt(params.page) > pagination.totalPages) return notFound();

    useEffect(() => {
        const fetchPaginationData = async () => {
            if (Object.keys(pagination.paginationData).length === 0) {
                const paginationData = await fetchPagination();
                setPagination(paginationData);
                
            }
        }
        fetchPaginationData();
    }, [fetchPagination]);

    useEffect(() => {
        if (!originalPagination || !postsPerPage) return;
    
        if (postsPerPage === 14) {
            // Restore original pagination
            setPagination(originalPagination);
            return;
        }
    
        let modifiedPagination: Record<number, PaginationEntry> = {};
        if (originalPagination?.paginationData) {
            Object.entries(originalPagination.paginationData).forEach(([key, value], index) => {
                if (postsPerPage === 28 && index % 2 === 0) {
                    modifiedPagination[parseInt(key) > 1 ? parseInt(key) - 1 : parseInt(key)] = { date: value.date };
                } else if (postsPerPage === 42 && index % 3 === 0) {
                    modifiedPagination[parseInt(key)] = { date: value.date };
                }
            });
        }      

        setPagination({
            totalPages: Object.keys(modifiedPagination).length,
            paginationData: modifiedPagination,
        });

        setPaginationData({
            totalPages: Object.keys(modifiedPagination).length,
            paginationData: modifiedPagination,
        })

    
    }, [postsPerPage, originalPagination]);

    useEffect(() => {
        const getPostsLength = async () => {
            if (postCount > 0) return;

            const count = await getPostsCount();

            if (count) setPostCount(count);
        };

        getPostsLength();
    }, [postCount, setPostCount]);

    useEffect(() => {
        setPaginationData(pagination);
    }, [pagination]);

    // Getting the exact starting key for the particular page
    const startingKey: PaginationEntry | undefined = Object.entries(pagination.paginationData).find(([key, value]) => key.toString() === params.page)?.[1];

    const ARTICLES_PER_PAGE = postsPerPage; // Define the number of posts per page //? (should be 14 by design and adjustable to 30 or 44)
    const pageCount = pagination.totalPages;
    const startIndex = posts.findIndex(article => article.date === startingKey?.date);

    const paginatedArticles = posts.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

    useEffect(() => {
        const fetchPostsData = async () => {
            if (params.page) {
                setLoading(true);

                const postsData = await fetchPostsByPage(Number(params.page), ARTICLES_PER_PAGE, paginationData);

                if (postsData.length > 0) setLoading(false);
            }
        }

        fetchPostsData();
    }, [params.page, paginationData]);

    useEffect(() => {
        if (authors.length === 0) {
            fetchAuthors();

        }
    }, [fetchAuthors]);

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

    const [showModal, setShowModal] = useState(!!slug);

    useEffect(() => {
        if (!slug) {
            setTimeout(() => setShowModal(true), 500);
        }
    }, [slug]);

    if (posts.length === 0) return <LoadingBanner />
    if (!loadUserConfigFromStorage) return <LoadingBanner />

    return (
        <>
            <NavBar />
            {showModal && <PostPreviewModal />}
            <ArticleModal slug={slug || ''} />
            {!loading && paginatedArticles.length > 0 ? (
                <main id="body">
                    <div className="container posts" id="posts">
                        <div className="container p-0">
                            <div className="container d-flex p-0 pt-3 mt-5 justify-content-between">
                                <h1 className="heading m-0 p-0 heading-large">Page {currentPage}</h1>
                                <button onClick={() => setPaginationModalOpen(prev => !prev)} className="btn-pill py-2 px-2">
                                    <MdSettings className="btn-pill-svg" />
                                </button>
                            </div>

                            {paginationModalOpen && <PaginationPreferences postsPerPage={ARTICLES_PER_PAGE} setModalOpen={setPaginationModalOpen} />}
                        </div>

                        <div className="row post-list">
                            <PostList displayMode="linear" limit={ARTICLES_PER_PAGE} style="full" postsData={paginatedArticles} />
                        </div>

                        <div className="container mt-5 mb-2">
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
                                        <Link href={`/page/${page}`} key={page} className="mb-5 mx-2">
                                            <button className={`px-3 px-md-3 py-2 ${page === currentPage ? 'btn-filled' : ''}`}>{page}</button>
                                        </Link>
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
            ) : (
                <>
                    <main id="body">
                        <div className="container">
                            <div className="container d-flex p-0 pt-3 mt-5">
                                <h1 className="heading m-0 p-0 heading-large">Page {currentPage}</h1>
                            </div>

                            <LoadingSkeleton />
                        </div>
                    </main>
                </>
            )}
            <Footer />
        </>
    );
}
