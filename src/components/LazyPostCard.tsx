'use client';
import { PostItem, PostPreviewItem, AuthorItem } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import PostCard from './PostCard';
import ArticlePage from '@/components/ArticleModal';

import styles from '@/components/PostCard.module.css';

type PostCardProps = {
    post: PostItem;
    previewData?: PostPreviewItem;
    authorData: AuthorItem;
    style: 'massive' | 'full' | 'expanded' | 'preview' | 'admin' | 'standard';
    index?: number | 1;
    setValue?: React.Dispatch<React.SetStateAction<string>>;
};

const LazyPostCard = ({ post, previewData, authorData, style, index, setValue }: PostCardProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const [articleOpened, setArticleOpened] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <>
            {isVisible ? (
                <PostCard post={post} authorData={authorData} index={index} key={index} style={style} />
            ) : (
                <div className="col-12 col-md-4" ref={ref}>
                    <span>
                        <div className={styles.image}>
                            <Image
                                className={`img-fluid full-image ${styles.placeholder_image}`}
                                src={'/ui/placeholder.png'} // Using the image URL, including the placeholder logic if needed
                                alt={''}
                                title={''}
                                priority={true} // Ensuring the image is preloaded and prioritized
                                width={354}
                                height={180}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                        </div>

                        <div className={`${styles.postInfo}`}>
                            <span className={`${styles.heading} d-flex gap-1`} id="col-heading-1">
                                <p className={`${styles.dot} ${styles.placeholder_heading__dot}`}></p>
                                <p className={`${styles.underscore} ${styles.placeholder_heading__underscore}`}></p>
                                <p className={`${styles.underscore} ${styles.placeholder_heading__underscore}`}></p>
                                <p className={`${styles.dot} ${styles.placeholder_heading__dot}`}></p>
                                <p className={`${styles.underscore} ${styles.placeholder_heading__underscore}`}></p>
                                <p className={`${styles.dot} ${styles.placeholder_heading__dot}`}></p>
                                <p className={`${styles.underscore} ${styles.placeholder_heading__underscore}`}></p>
                                <p className={`${styles.dot} ${styles.placeholder_heading__dot}`}></p>
                                <p className={`${styles.underscore} ${styles.placeholder_heading__underscore}`}></p>
                                <p className={`${styles.underscore} ${styles.placeholder_heading__underscore}`}></p>
                                <p className={`${styles.dot} ${styles.placeholder_heading__dot}`}></p>
                                <p className={`${styles.underscore} ${styles.placeholder_heading__underscore}`}></p>
                                <p className={`${styles.dot} ${styles.placeholder_heading__dot}`}></p>
                                <p className={`${styles.underscore} ${styles.placeholder_heading__underscore}`}></p>
                                <p className={`${styles.dot} ${styles.placeholder_heading__dot}`}></p>
                            </span>

                            {/* Placeholder description */}

                            <span className={`${styles.description} d-flex gap-1 pt-3 pb-2`}>
                                <p className={`${styles.underscore} ${styles.placeholder_desc__underscore}`}></p>
                                <p className={`${styles.dot} ${styles.placeholder_desc__dot}`}></p>
                                <p className={`${styles.underscore} ${styles.placeholder_desc__underscore}`}></p>
                                <p className={`${styles.underscore} ${styles.placeholder_desc__underscore}`}></p>
                                <p className={`${styles.dot} ${styles.placeholder_desc__dot}`}></p>
                                <p className={`${styles.dot} ${styles.placeholder_desc__dot}`}></p>
                                <p className={`${styles.underscore} ${styles.placeholder_desc__underscore}`}></p>
                                <p className={`${styles.dot} ${styles.placeholder_desc__dot}`}></p>
                            </span>
                        </div>
                    </span>

                    <div className={`${styles.profile_info} d-flex mb-5`}>
                        <div className="align-content-center">
                            <Image className={`${styles.pfp} ${styles.placeholder_pfp} img-fluid`} src={`/ui/placeholder-pfp.png`} alt="pfp" width={42.5} height={42.5} priority={true} />
                        </div>
                        <div className={`${styles.profile_info__details} gap-2`}>
                            <div className={styles.placeholder_profile_info__text}>
                                <p className={styles.dot}></p>
                                <p className={styles.underscore}></p>
                                <p className={styles.underscore}></p>
                                <p className={styles.dot}></p>
                                <p className={styles.underscore}></p>
                                <p className={styles.dot}></p>
                                <p className={styles.underscore}></p>
                            </div>
                            <div className={styles.placeholder_profile_info__text}>
                                <p className={styles.underscore}></p>
                                <p className={styles.dot}></p> <p className={styles.dot}></p>
                                <p className={styles.underscore}></p>
                                <p className={styles.underscore}></p>
                                <p className={styles.dot}></p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LazyPostCard;
