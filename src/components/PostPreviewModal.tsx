'use client';
import React, { useEffect, useState } from 'react';
import styles from '@/components/ArticleModal.module.css';
import { usePostContext } from './PostContext';
import LazyPostCard from './LazyPostCard';
import { IoMdClose } from 'react-icons/io';

const useWindowSize = () => {
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
    const { expandedPost, setExpandedPost } = usePostContext();
    const { authors } = usePostContext();

    const { width, height } = useWindowSize();
    const [expanded, setExpanded] = useState<boolean>(false);

    const authorData = authors.find(author => author.email === expandedPost?.post.email);

    const handleClose = () => {
        const modal = document.querySelector(`.${styles.postDataContainer}`) as HTMLElement | null;

        if (modal) {
            document.body.classList.remove('overflow-hidden'); // Only remove when appropriate
        }

        if (expandedPost && modal) {
            const { top, left, width, height } = expandedPost.boundingBox;

            setExpanded(false); // Start collapsing the modal

            setTimeout(() => {
                modal.style.position = 'absolute';
                modal.style.top = `${top}px`;
                modal.style.left = `${left}px`;
                modal.style.width = `${width}px`;
                modal.style.height = `${height}px`;
                modal.style.padding = '0.3rem';
                modal.style.transform = 'translate(0, 0)';
                modal.style.transition = 'transform 0.3s ease, width 0.3s ease, height 0.3s ease, padding 0.3s ease';
            }, 0);
            setTimeout(() => {
                modal.style.opacity = '5%';
            }, 150);
            setTimeout(() => {
                const viewportHeight = window.innerHeight; // Viewport height
                const viewportWidth = window.innerWidth; // Viewport width

                // Calculate the target height and Y position for centering
                const targetHeight = Math.min(viewportHeight, height * 1.5); // Adjust size as necessary
                const targetY = top - (viewportHeight / 2 - targetHeight / 2);

                // Calculate the target X position for horizontal centering (optional)
                const targetX = left - (viewportWidth / 2 - width / 2);

                // Scroll to the calculated position
                scrollBy({
                    top: targetY,
                    left: targetX,
                    behavior: 'smooth', // Smooth scrolling animation
                });
            }, 50);

            const onTransitionEnd = (e: TransitionEvent) => {
                if (['transform', 'width', 'padding', 'height', 'opacity'].includes(e.propertyName)) {
                    setExpandedPost(null); // Reset expandedPost after animation is complete

                    modal.removeEventListener('transitionend', onTransitionEnd);
                }
            };

            modal.addEventListener('transitionend', onTransitionEnd);

            return () => {
                if (modal) {
                    modal.removeEventListener('transitionend', onTransitionEnd);
                }
            };
        }
    };

    useEffect(() => {
        const modal = document.querySelector(`.${styles.postDataContainer}`) as HTMLElement | null;

        if (expandedPost && modal && expandedPost.boundingBox) {
            document.body.classList.add('overflow-hidden');
            setExpanded(false);

            const { top, left, width, height } = expandedPost.boundingBox;

            modal.style.position = 'absolute';
            modal.style.top = `${top}px`;
            modal.style.left = `${left}px`;
            modal.style.width = `${width}px`;
            modal.style.height = `${height}px`;
            modal.style.padding = '0.3rem';
            modal.style.transform = 'translate(0, 0)';
            modal.style.transition = 'transform 0.3s ease, width 0.3s ease, height 0.3s ease';

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const targetWidth = Math.min(viewportWidth, width * 1.5);
            const targetHeight = Math.min(viewportHeight, height * 1.5);

            const targetX = (viewportWidth - targetWidth) / 2 - left;
            const targetY = (viewportHeight - targetHeight) / 2 - top;

            setTimeout(() => {
                modal.style.transform = `translate(${targetX}px, ${targetY}px)`;
                modal.style.width = `${targetWidth}px`;
                modal.style.height = ``;
            }, 0);
            setTimeout(() => {
                modal.style.padding = '1.5rem';
            }, 200);

            // Ensure expanded state is only set after transition ends
            const onTransitionEnd = (e: TransitionEvent) => {
                if (['transform', 'width', 'padding'].includes(e.propertyName)) {
                    setExpanded(true);
                    modal.removeEventListener('transitionend', onTransitionEnd);
                }
            };
            modal.addEventListener('transitionend', onTransitionEnd);
        } else {
            // document.body.classList.remove('overflow-hidden');
        }

        return () => {
            if (modal) {
                modal.removeEventListener('transitionend', () => {});
            }
        };
    }, [expandedPost]);

    useEffect(() => {
        handleClose();
    }, [width, height]);

    if (!expandedPost || !authorData) return null;

    return (
        <div className={`${styles.articlePage} ${styles.previewModal}`} onClick={() => handleClose()}>
            {expandedPost && authorData ? (
                <div className="container">
                    <div className={`col-12 ${styles.postDataContainer}`}>
                        {expanded && (
                            <button className={`${styles.expandedPostCloseBtn} btn-pill`} onClick={() => handleClose()}>
                                <IoMdClose className={styles.icon} />
                            </button>
                        )}
                        <LazyPostCard post={expandedPost.post} authorData={authorData} style="expanded" index={1000} />
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Hello World</h1>
                </div>
            )}
        </div>
    );
};

export default PostPreviewModal;
