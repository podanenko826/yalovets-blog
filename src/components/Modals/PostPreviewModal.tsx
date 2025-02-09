'use client';
import React, { useEffect, useState } from 'react';
import styles from './Modals.module.css';
import LazyPostCard from '../PostCard/LazyPostCard';
import { IoMdClose } from 'react-icons/io';

import { usePostContext } from '../Context/PostDataContext';
import { useModalContext } from '../Context/ModalContext';

const useWindowSize = () => {
    if (typeof window === 'undefined') return { width: 0, height: 0 };

    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
};

const PostPreviewModal = () => {
    const { expandedPost, setExpandedPost } = useModalContext();
    const { authors } = usePostContext();

    const { width } = useWindowSize();
    const [expanded, setExpanded] = useState<boolean>(false);
    const [startY, setStartY] = useState<number | null>(null);

    const authorData = authors.find(author => author.email === expandedPost?.post.email);

    const handleClose = () => {
        if (!window) return;

        const card = document.querySelector(`.${styles.postDataContainer}`) as HTMLElement | null;
        const modal = document.querySelector(`.${styles.previewModal}`) as HTMLElement | null;

        if (card) {
            document.body.classList.remove('overflow-hidden'); // Only remove when appropriate
        }

        if (expandedPost && card && modal) {
            const { top, left, width, height } = expandedPost.boundingBox;

            setExpanded(false); // Start collapsing the modal

            setTimeout(() => {
                card.style.position = 'absolute';
                card.style.top = `${top}px`;
                card.style.left = `${left}px`;
                card.style.width = `${width}px`;
                card.style.height = `${height}px`;
                card.style.padding = '0.3rem';
                card.style.transform = 'translate(0, 0)';
            }, 0);
            setTimeout(() => {
                card.style.opacity = '5%';
            }, 150);

            modal.classList.add(`${styles.previewModalClose}`);

            const onTransitionEnd = (e: TransitionEvent) => {
                if (['transform', 'width', 'padding', 'height', 'opacity'].includes(e.propertyName)) {
                    setExpandedPost(null); // Reset expandedPost after animation is complete

                    card.removeEventListener('transitionend', onTransitionEnd);
                }
            };

            card.addEventListener('transitionend', onTransitionEnd);

            return () => {
                if (card) {
                    card.removeEventListener('transitionend', onTransitionEnd);
                }
            };
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startY !== null) {
            const currentY = e.touches[0].clientY;
            const diffY = currentY - startY;

            if (diffY > 135) {
                handleClose();
            }
        }
    };

    const handleTouchEnd = () => {
        setStartY(null);
    };

    const handleScroll = (e: React.UIEvent) => {
        setStartY(e.currentTarget.scrollTop);
    };

    const handleScrollCapture = (e: React.UIEvent) => {
        if (startY !== null) {
            const currentY = e.currentTarget.scrollTop;

            const diffY = currentY - startY;

            if (diffY > 125) {
                handleClose();
            }
        }
    };

    useEffect(() => {
        if (!window) return;

        const isMobile = window.innerWidth <= 768;

        const card = document.querySelector(`.${styles.postDataContainer}`) as HTMLElement | null;
        const modal = document.querySelector(`.${styles.previewModal}`) as HTMLElement | null;

        if (expandedPost && card && modal && expandedPost.boundingBox) {
            document.body.classList.add('overflow-hidden');

            const { top, left, width, height } = expandedPost.boundingBox;

            card.style.position = 'absolute';
            card.style.top = isMobile ? '25vh' : `${top}px`;
            card.style.left = `${left}px`;
            card.style.width = `${width}px`;
            card.style.height = `${height}px`;
            card.style.padding = '';
            card.style.transform = 'translate(0, 0)';

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const targetWidth = Math.min(viewportWidth, width * 1.5);
            const targetHeight = Math.min(viewportHeight, height * 1.5);

            const targetX = (viewportWidth - targetWidth) / 2 - left;
            const targetY = (viewportHeight - targetHeight) / 2 - top;

            modal.classList.remove(`${styles.previewModalClose}`);

            setExpanded(true);

            setTimeout(() => {
                card.style.transform = !isMobile ? `translate(${targetX}px, ${targetY}px)` : '';
                card.style.width = `${targetWidth}px`;
            }, 0);
            setTimeout(() => {
                card.style.height = ``;
                card.style.padding = '0 1.2rem';
                card.style.paddingTop = '4.5rem';
                card.style.paddingBottom = '1.3rem';
            }, 0);
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [expandedPost]);

    useEffect(() => {
        handleClose();
    }, [width]);

    if (!authorData) return null;

    return (
        <div className={`${styles.articlePage} ${styles.previewModal}`} onClick={() => handleClose()} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {expandedPost && authorData ? (
                <div className="container" onScrollCapture={handleScrollCapture} onScroll={handleScroll} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                    <div className={`${styles.postDataContainer}`} onClick={e => e.stopPropagation()}>
                        {expanded && (
                            <button className={`${styles.expandedPostCloseBtn} btn-pill`} onClick={() => handleClose()}>
                                <IoMdClose className={styles.icon} />
                            </button>
                        )}
                        <LazyPostCard post={expandedPost.post} authorData={authorData} style="expanded" index={1000} />
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default PostPreviewModal;
