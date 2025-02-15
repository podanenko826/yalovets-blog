'use client';
import { PostItem, PostPreviewItem, AuthorItem } from '@/types';
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PostCard from './PostCard';

import styles from './PostCard.module.css';

type PostCardProps = {
    post: PostItem;
    previewData?: PostPreviewItem;
    authorData: AuthorItem;
    style: 'massive' | 'full' | 'expanded' | 'preview' | 'admin' | 'standard';
    index?: number | 1;
    isLoading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const LazyPostCard = React.memo(
    ({ post, previewData, authorData, style, index, isLoading, setLoading }: PostCardProps) => {
        const [isVisible, setIsVisible] = useState(false);

        const ref = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (setLoading) setLoading(false);
                };
            }, { 
                rootMargin: "800px", // start loading 200px before entering viewport
                threshold: 0.01 
            });
    
            if (ref.current) observer.observe(ref.current);
    
            return () => observer.disconnect();
        }, []);

        console.log('LazyPostCard re-renders...');


        return (
            <>
                {isVisible ? (
                    <Suspense fallback={<div>Loading...</div>}>
                        <PostCard post={post} authorData={authorData} index={index} key={index} style={style} />
                    </Suspense>
                ) : style === 'massive' ? (
                    <div className={`${styles.latest_post} col-12`} id="latest-post" ref={ref}>
                        <div className="container row p-0">
                            <span className="col-md-6">
                                <div className={styles.image}>
                                    <Image
                                        className={`img-fluid full-image ${styles.placeholder_image_massive}`}
                                        src={'/ui/placeholder.png'} // Using the image URL, including the placeholder logic if needed
                                        alt={''}
                                        title={''}
                                        priority={true} // Ensuring the image is preloaded and prioritized
                                        width={546}
                                        height={307}
                                        sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                    />
                                </div>
                            </span>
                            <div className={`${styles.profile_info} p-3 px-md-5 mb-4 col-md-6`}>
                                <div>
                                    <div className="d-flex align-items-center">
                                        <div className="align-content-center">
                                            <Image className={`${styles.pfp} ${styles.placeholder_pfp} img-fluid`} src={`/ui/placeholder-pfp.png`} alt="pfp" width={42.5} height={42.5} priority={true} />
                                        </div>
                                        <div className="p-2 mb-1">
                                            <div className={`${styles.placeholder_profile_info__text} m-0 p-0`}>
                                                <p className={styles.dot}></p>
                                                <p className={styles.underscore}></p>
                                                <p className={styles.underscore}></p>
                                                <p className={styles.dot}></p>
                                                <p className={styles.underscore}></p>
                                                <p className={styles.dot}></p>
                                                <p className={styles.underscore}></p>
                                            </div>
                                            <div className={`${styles.placeholder_profile_info__text} m-0 p-0`}>
                                                <p className={styles.underscore}></p>
                                                <p className={styles.dot}></p> <p className={styles.dot}></p>
                                                <p className={styles.underscore}></p>
                                                <p className={styles.underscore}></p>
                                                <p className={styles.dot}></p>
                                            </div>
                                        </div>
                                    </div>

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
                            </div>
                        </div>
                    </div>
                ) : style === 'full' ? (
                    <div className="col-12 col-md-6" ref={ref}>
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

                        <div className={`${styles.profile_info} d-flex mb-5 mt-2`}>
                            <div className="align-content-center">
                                <Image className={`${styles.pfp} ${styles.placeholder_pfp} img-fluid`} src={`/ui/placeholder-pfp.png`} alt="pfp" width={42.5} height={42.5} priority={true} />
                            </div>
                            <div className={`${styles.profile_info__details} gap-2`}>
                                <div className={`${styles.placeholder_profile_info__text} my-2 mx-2`}>
                                    <p className={styles.dot}></p>
                                    <p className={styles.underscore}></p>
                                    <p className={styles.underscore}></p>
                                    <p className={styles.dot}></p>
                                    <p className={styles.underscore}></p>
                                    <p className={styles.dot}></p>
                                    <p className={styles.underscore}></p>
                                </div>
                                <div className={`${styles.placeholder_profile_info__text} my-2 mx-2`}>
                                    <p className={styles.underscore}></p>
                                    <p className={styles.dot}></p> <p className={styles.dot}></p>
                                    <p className={styles.underscore}></p>
                                    <p className={styles.underscore}></p>
                                    <p className={styles.dot}></p>
                                </div>
                            </div>
                        </div>
                    </div>
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

                        <div className={`${styles.profile_info} d-flex mb-5 mt-2`}>
                            <div className="align-content-center">
                                <Image className={`${styles.pfp} ${styles.placeholder_pfp} img-fluid`} src={`/ui/placeholder-pfp.png`} alt="pfp" width={42.5} height={42.5} priority={true} />
                            </div>
                            <div className={`${styles.profile_info__details} gap-2`}>
                                <div className={`${styles.placeholder_profile_info__text} my-2 mx-2`}>
                                    <p className={styles.dot}></p>
                                    <p className={styles.underscore}></p>
                                    <p className={styles.underscore}></p>
                                    <p className={styles.dot}></p>
                                    <p className={styles.underscore}></p>
                                    <p className={styles.dot}></p>
                                    <p className={styles.underscore}></p>
                                </div>
                                <div className={`${styles.placeholder_profile_info__text} my-2 mx-2`}>
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
    },
    (prevProps, nextProps) => prevProps.post.imageUrl === nextProps.post.imageUrl
);

export default LazyPostCard;
