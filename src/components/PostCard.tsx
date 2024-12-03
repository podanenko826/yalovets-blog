'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import { usePathname, useRouter } from 'next/navigation';

import styles from '@/components/PostCard.module.css';
import * as bootstrap from 'bootstrap';
import { Popover, Offcanvas, Modal } from 'bootstrap';

import type { AuthorItem, PostItem, PostPreviewItem } from '@/types';
import { deletePost, getMDXContent } from '@/lib/posts';
import LazyImage from './LazyImage';

import { FaCoffee } from 'react-icons/fa';
import { usePostContext } from './PostContext';

type PostCardProps = {
    post: PostItem;
    previewData?: PostPreviewItem;
    authorData: AuthorItem;
    style: 'massive' | 'full' | 'preview' | 'admin' | 'standard';
    index?: number | 1;
    setValue?: React.Dispatch<React.SetStateAction<string>>;
    onVisible?: () => void;
};

const PostCard = ({ post, previewData, authorData, style, index, setValue, onVisible }: PostCardProps) => {
    const { openModal } = usePostContext();

    const handlePostOpen = async () => {
        const mdxContent = await getMDXContent(post.slug);

        const markdown = mdxContent.markdown;
        const previousPath = window.location.href;

        openModal(post, markdown, previousPath);
    };

    useEffect(() => {
        if (onVisible) {
            onVisible(); // Notify parent that the component is visible
        }
    }, [onVisible]);

    const router = useRouter();

    const handlePostDeletion = async (email: string, slug: string) => {
        const deletedPostSlug = await deletePost({ email, slug });
        if (deletedPostSlug) {
            router.refresh();
        }
    };

    const modalRef = useRef<Modal | null>(null);
    const offcanvasRef = useRef<Offcanvas | null>(null);
    const popoverRef = useRef<Popover | null>(null);

    const [currentModal, setCurrentModal] = useState<bootstrap.Modal | null>(null);
    const [currentOffcanvas, setCurrentOffcanvas] = useState<bootstrap.Offcanvas | null>(null);
    const [currentPopover, setCurrentPopover] = useState<bootstrap.Popover | null>(null);

    const [popoverVisible, setPopoverVisible] = useState(false); // Single source of truth for visibility
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for timeout to avoid state re-renders

    useEffect(() => {
        let Modal;
        if (typeof window !== 'undefined') {
            Modal = require('bootstrap/js/dist/modal');
        }

        const modalTrigger = document.querySelector(`.modal`);
        console.log('offcanvasTrigger: ', modalTrigger);

        if (modalTrigger && !currentModal && Modal) {
            const newModal = new Modal(modalTrigger);

            modalRef.current = newModal;
        }
    }, [index]);

    useEffect(() => {
        let Offcanvas;
        if (typeof window !== 'undefined') {
            Offcanvas = require('bootstrap/js/dist/offcanvas');
        }

        const offcanvasTrigger = document.querySelector(`.offcanvas`);
        console.log('offcanvasTrigger: ', offcanvasTrigger);

        if (offcanvasTrigger && !currentOffcanvas && Offcanvas) {
            const newOffcanvas = new Offcanvas(offcanvasTrigger);

            offcanvasRef.current = newOffcanvas;
        }
    }, [index]);

    // Initialize popover on first render
    useEffect(() => {
        let Popover;
        if (typeof window !== 'undefined') {
            Popover = require('bootstrap/js/dist/popover'); // Or the library you use
        }

        const popoverTrigger = document.querySelector(`#popover-trigger-${index}`);
        console.log('popover: ', popoverTrigger);

        if (popoverTrigger && !currentPopover && Popover) {
            const newPopover = new Popover(popoverTrigger, {
                html: true,
                placement: 'top',
                customClass: 'd-none d-md-inline-block',
                content: `
                    <div class="row justify-content-beetween align-content-between">
                        <div class="col-12 col-md-8">
                            <a class="subheading a-link m-0" href="/author/${authorData.authorKey}">${authorData.fullName}</a>
                            <h6 class="subheading-tiny py-2">${authorData.bio}</h6>
                        </div>
    
                        <div class="col-4 mb-2 mb-md-0 col-md-4">
                            <Image class="${styles.popoverPfp}" src="/${authorData.profileImageUrl}" width={50} height={50} />
                        </div>
    
                        <div class="col-md-12 horisontal-line horisontal-line-thin"></div>
    
                        <div class="col-12 d-flex justify-content-between align-content-center">
                            <p class="p-0 m-0">Visit my profile</p>
                            <a href="/author/${authorData.authorKey}" class="a-btn btn-filled px-2 py-0">
                                Visit
                            </a>
                        </div>
                    </div>
                `,
                trigger: 'manual',
            });
            popoverRef.current = newPopover;
        }

        return () => {
            if (popoverRef.current) {
                popoverRef.current.dispose();
            }
        };
    }, [authorData, index]);

    // Effect to attach listeners to the dynamic popover content
    useEffect(() => {
        if (popoverVisible) {
            const popoverContent = document.querySelector('div.popover') as HTMLElement;
            if (popoverContent) {
                popoverContent.addEventListener('mouseenter', handleMouseEnter);
                popoverContent.addEventListener('mouseleave', handleMouseLeave);
            }
        }
    }, [popoverVisible]);

    const handleMouseEnter = () => {
        clearHideTimeout();

        hideTimeoutRef.current = setTimeout(() => {
            if (!popoverVisible) {
                setPopoverVisible(true);
                if (popoverRef.current) {
                    popoverRef.current.show();
                }
            }
        }, 300); // 0.3-second delay
    };

    const handleMouseLeave = () => {
        startHideTimeout();
    };

    const startHideTimeout = () => {
        clearHideTimeout();
        hideTimeoutRef.current = setTimeout(() => {
            if (popoverRef.current) {
                popoverRef.current.hide();
            }
            setPopoverVisible(false);
        }, 1300); // 1.3-second delay
    };

    const clearHideTimeout = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    };

    return style === 'massive' ? (
        <div className={styles.latest_post}>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    {post.imageUrl && (
                        <div className="col-lg-6">
                            <a role="button" onClick={handlePostOpen}>
                                <picture className="img-fluid">
                                    <Image
                                        className={`img-fluid ${styles.massive_img}`}
                                        src={post.imageUrl || '/ui/not-found.png'} // Using the image URL, including the placeholder logic if needed
                                        alt={post.title}
                                        title={post.title}
                                        width={546}
                                        height={307}
                                        sizes="(min-width: 1200px) 960px, (min-width: 992px) 680px"
                                    />
                                </picture>
                            </a>
                        </div>
                    )}
                    <div className="col-lg-5 offset-lg-1 py-3" id="latest-post">
                        <div className={`${styles.profile_info} d-flex pb-2 pb-sm-2`}>
                            <div className={styles.profile_info__details}>
                                <span className="d-inline-block">
                                    <div className={`${styles.profile_info} d-flex`}>
                                        <div className="align-content-center">
                                            <LazyImage className={`${styles.pfp} img-fluid`} src={`/${authorData.profileImageUrl}` || '/ui/placeholder-pfp.png'} placeholderUrl="/ui/placeholder-pfp.png" alt="pfp" width={42.5} height={42.5} />
                                        </div>
                                        <div className={styles.profile_info__details}>
                                            <Link href={`/author/${authorData.authorKey}`} className={`${styles.profile_info__text} m-0`}>
                                                {authorData.fullName}
                                            </Link>
                                            <p className={`${styles.profile_info__text} align-content-center m-0`}>
                                                {moment(post.date, 'DD-MM-YYYY').format('D MMM')} • {post.readTime?.toString()} min read
                                            </p>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                        <a role="button" onClick={handlePostOpen}>
                            <h1 className={`${styles.heading} d-flex align-content-center gap-1`} id="col-heading-1">
                                {post.title.length > 85 ? <>{post.title.slice(0, 85) + '... '}</> : post.title}{' '}
                                {moment(post.modifyDate, 'DD-MM-YYYY').isAfter(moment(post.date, 'DD-MM-YYYY')) && moment(post.modifyDate, 'DD-MM-YYYY').diff(moment(post.date, 'DD-MM-YYYY'), 'days') <= 30 && (
                                    <>
                                        <span className="p-2 rounded-pill text-bg-secondary">Updated</span>
                                    </>
                                )}
                            </h1>
                            <p className={`${styles.description} pb-2`}>
                                {post.description.length > 140 ? (
                                    <>
                                        {post.description.slice(0, 140) + '... '}
                                        <button id="col-secondary">Read more</button>
                                    </>
                                ) : (
                                    post.description
                                )}
                            </p>

                            <button className="btn-filled">Read on</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    ) : style === 'full' ? (
        <div className="col-12 col-md-6" key={index}>
            <a role="button" onClick={handlePostOpen}>
                {post.imageUrl && (
                    <div className={styles.image}>
                        <picture className="img-fluid">
                            <Image
                                className="img-fluid full-image"
                                src={post.imageUrl || '/ui/not-found.png'} // Using the image URL, including the placeholder logic if needed
                                alt={post.title}
                                title={post.title}
                                loading="lazy"
                                width={546}
                                height={182}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                        </picture>
                    </div>
                )}

                <div className={styles.postInfo}>
                    <h2 className={`${styles.heading} d-flex flex-wrap align-items-center gap-1`} id="col-heading-1">
                        {post.title}{' '}
                        {moment(post.modifyDate, 'DD-MM-YYYY').isAfter(moment(post.date, 'DD-MM-YYYY')) && moment(post.modifyDate, 'DD-MM-YYYY').diff(moment(post.date, 'DD-MM-YYYY'), 'days') <= 30 && (
                            <span className="px-2 py-1 mt-1 rounded-pill text-wrap text-bg-secondary">{'Updated ' + moment(post.modifyDate, 'DD-MM-YYYY').fromNow()}</span>
                            // <span className="px-2 py-1 pb-1 mb-3 rounded-pill text-bg-secondary">
                            //     Updated
                            // </span>
                        )}
                    </h2>
                    <p className={styles.description}>
                        {post.description.length > 160 ? (
                            <>
                                {post.description.slice(0, 160) + '... '}
                                <button id="col-secondary">Read more</button>
                            </>
                        ) : (
                            post.description
                        )}
                    </p>
                </div>
            </a>
            <div className={`${styles.profile_info} d-flex`}>
                <div className={styles.profile_info__details}>
                    <span id={`popover-trigger-${index}`} className="d-inline-block" typeof="button" tabIndex={0} data-bs-toggle="popover" data-bs-trigger="manual" data-bs-container="body" data-bs-custom-class="default-author-popover">
                        <div className={`${styles.profile_info} d-flex`}>
                            <div className="align-content-center">
                                <LazyImage onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`${styles.pfp} img-fluid`} src={`/${authorData.profileImageUrl}` || '/ui/placeholder-pfp.png'} placeholderUrl="/ui/placeholder-pfp.png" alt="pfp" width={42.5} height={42.5} />
                            </div>
                            <div className={styles.profile_info__details}>
                                <Link href={`/author/${authorData.authorKey}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`${styles.profile_info__text} m-0`}>
                                    {authorData.fullName}
                                </Link>
                                <p className={`${styles.profile_info__text} align-content-center m-0`}>
                                    {moment(post.date, 'DD-MM-YYYY').format('D MMM')} • {post.readTime?.toString()} min read
                                </p>
                            </div>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    ) : style === 'admin' ? (
        <div className="col-12" key={index}>
            {post.imageUrl && (
                <div className={`${styles.image} position-relative`} key={post.imageUrl}>
                    <button className="btn-filled position-absolute mt-4 px-2 py-1 top-0 end-0 translate-middle" type="button" data-bs-toggle="offcanvas" onClick={e => e.preventDefault()} data-bs-target={`#postDetails-${post.slug}`} aria-controls={`postDetails-${post.slug}`}>
                        ...
                    </button>
                    <a role="button" data-bs-toggle="modal" data-bs-target={`#leavingModal-${post.slug}`}>
                        <Image
                            className="img-fluid full-image"
                            src={post.imageUrl || '/ui/not-found.png'} // Using the image URL, including the placeholder logic if needed
                            alt={post.title}
                            title={post.title}
                            loading="lazy"
                            width={354}
                            height={180}
                            sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                        />
                    </a>
                </div>
            )}
            <a role="button" data-bs-toggle="modal" data-bs-target={`#leavingModal-${post.slug}`}>
                <div className={styles.postInfo}>
                    <h2 className={`${styles.heading} d-flex flex-wrap align-content-center gap-1`} id="col-heading-1">
                        {post.title} {moment(post.modifyDate, 'DD-MM-YYYY').isAfter(moment(post.date, 'DD-MM-YYYY')) && <span className="px-2 py-1 text-wrap rounded-pill text-bg-secondary">{'Updated ' + moment(post.modifyDate, 'DD-MM-YYYY').fromNow()}</span>}
                    </h2>
                    <p className={styles.description}>{post.description}</p>
                </div>
            </a>

            <div className="modal fade" id={`leavingModal-${post.slug}`} tabIndex={-1} aria-labelledby={`leavingModalLabel-${post.slug}`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={`leavingModalLabel-${post.slug}`}>
                                You are about to leave the admin page.
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>
                                The post with the following title will be opened in the blog: <br />
                            </p>
                            <h4 id={`leavingModalLabel-${post.slug}`}>{post.title}</h4>
                        </div>
                        <div className="modal-footer">
                            <Link href={`/${post.slug}`} target="_blank">
                                <button type="button" className="btn-filled py-2" data-bs-dismiss="modal">
                                    Open post
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex={-1} id={`postDetails-${post.slug}`} aria-labelledby={`postDetailsLabel-${post.slug}`}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id={`postDetailsLabel-${post.slug}`}>
                        Post Details
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Attribute</th>
                                <th scope="col">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(post).map(key => {
                                const typedKey = key as keyof PostItem; // Explicitly tell TypeScript this is a key of PostItem

                                // Determine the class name based on the key
                                let rowClass = '';
                                if (key === 'email') {
                                    rowClass = 'table-primary'; // Add table-primary class for email
                                } else if (key === 'slug') {
                                    rowClass = 'table-secondary'; // Add table-secondary class for slug
                                }

                                return (
                                    <tr key={key} className={rowClass}>
                                        <td>{key}</td>
                                        <td>{post[typedKey]}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={`${styles.profile_info} d-flex`}>
                <div className={styles.profile_info__details}>
                    <span id={`popover-trigger-${index}`} className="d-inline-block" typeof="button" tabIndex={0} data-bs-toggle="popover" data-bs-trigger="manual" data-bs-container="body" data-bs-custom-class="default-author-popover">
                        <div className={`${styles.profile_info} d-flex`}>
                            <div className="align-content-center">
                                <LazyImage onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`${styles.pfp} img-fluid`} src={`/${authorData.profileImageUrl}` || '/ui/placeholder-pfp.png'} placeholderUrl="/ui/placeholder-pfp.png" alt="pfp" width={42.5} height={42.5} />
                            </div>
                            <div className={styles.profile_info__details}>
                                <Link href={''} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`${styles.profile_info__text} m-0`}>
                                    {authorData.fullName}
                                </Link>
                                <p className={`${styles.profile_info__text} align-content-center m-0`}>
                                    {moment(post.date, 'DD-MM-YYYY').format('D MMM')} • {post.readTime?.toString()} min read
                                </p>
                            </div>
                        </div>
                    </span>
                </div>
            </div>
            <div className="d-flex justify-content-end mt-3 gap-3 mb-5">
                <Link href={`/admin/posts/${post.slug}`}>
                    <button className="btn-outlined px-5 py-2">Edit</button>
                </Link>

                <button className="btn-outlined btn-danger px-3 py-2" type="button" data-bs-toggle="modal" data-bs-target={`#deletionModal-${post.slug}`}>
                    Delete
                </button>
                <div className="modal fade" id={`deletionModal-${post.slug}`} tabIndex={-1} aria-labelledby={`deletionModalLabel-${post.slug}`} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={`deletionModalLabel-${post.slug}`}>
                                    Are you sure you want to delete this post?
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    The post with the following title will be permanently deleted: <br />
                                </p>
                                <h4 id={`deletionModalLabel-${post.slug}`}>{post.title}</h4>
                                <p className="pt-4">(Think twice before making this desicion, 'permanently' is a long period)</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-filled py-2 px-5" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn-filled btn-danger py-2 px-3" data-bs-dismiss="modal" onClick={() => handlePostDeletion(post.email, post.slug)}>
                                    Delete post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : style === 'preview' ? (
        <div className={styles.latest_post}>
            {previewData ? (
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        {previewData.imageUrl && (
                            <div className="col-lg-8">
                                <picture className="img-fluid">
                                    <Image
                                        className="img-fluid"
                                        src={post.imageUrl || '/ui/not-found.png'} // Using the image URL, including the placeholder logic if needed
                                        alt={post.title}
                                        title={post.title}
                                        loading="lazy"
                                        width={354}
                                        height={180}
                                        sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                    />
                                </picture>
                            </div>
                        )}

                        <div className="col-lg-8">
                            <div className={styles.postInfo}>
                                <div className="d-flex align-content-center m-0">
                                    <h2 className={styles.heading} id="col-heading-1">
                                        {previewData.title || 'Enter the post title'} {moment(post.modifyDate, 'DD-MM-YYYY').isAfter(moment(post.date, 'DD-MM-YYYY')) && <span className="px-2 py-1 mb-2 rounded-pill text-bg-secondary">Updated</span>}
                                    </h2>
                                </div>
                                {setValue ? (
                                    <textarea
                                        name="description"
                                        placeholder="Enter the post description"
                                        onChange={e => setValue(e.target.value)}
                                        className="w-100 subheading-small mb-2 col-heading-2"
                                        value={previewData.description}
                                        // rows={2}
                                    />
                                ) : (
                                    <p className={styles.description}>{previewData.description}</p>
                                )}
                            </div>

                            <span className="d-inline-block">
                                <div className={`${styles.profile_info} d-flex`}>
                                    <div className="align-content-center">
                                        <LazyImage className={`${styles.pfp} img-fluid`} src={`/${authorData.profileImageUrl}` || '/ui/placeholder-pfp.png'} placeholderUrl="/ui/placeholder-pfp.png" alt="pfp" width={42.5} height={42.5} />
                                    </div>
                                    <div className={styles.profile_info__details}>
                                        <p className={`${styles.profile_info__text} m-0 p-0`}>{authorData.fullName}</p>
                                        <p className={`${styles.profile_info__text} align-content-center m-0`}>
                                            {moment(post.date, 'DD-MM-YYYY').format('D MMM')} • {post.readTime?.toString()} min read
                                        </p>
                                    </div>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Preview has failed: please pass the previewData object to this component</p>
            )}
        </div>
    ) : (
        <div className="col-12 col-md-4" key={index}>
            <a role="button" onClick={handlePostOpen}>
                {post.imageUrl && (
                    <div className={styles.image}>
                        <picture className={`img-fluid ${styles.imageWrapper}`}>
                            <Image className="img-fluid" src={post.imageUrl || '/ui/not-found.png'} alt={post.title} title={post.title} width={354} height={180} loading="lazy" sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" />
                            <span className={`d-inline-block ${styles.articleLabel} subheading-smaller`}>
                                <FaCoffee className="m-1 subheading-tiny" id={styles.labelIcon} />
                                Article
                            </span>
                        </picture>
                    </div>
                )}

                <div className={styles.postInfo}>
                    <div className="d-flex align-content-center m-0">
                        <h2 className={styles.heading} id="col-heading-1">
                            {post.title.length > 90 ? <>{post.title.slice(0, 90) + '... '}</> : post.title} {moment(post.modifyDate, 'DD-MM-YYYY').isAfter(moment(post.date, 'DD-MM-YYYY')) && moment(post.modifyDate, 'DD-MM-YYYY').diff(moment(post.date, 'DD-MM-YYYY'), 'days') <= 30 && <span className="px-2 py-1 pb-1 mb-3 rounded-pill text-bg-secondary">Updated</span>}
                        </h2>
                    </div>
                    <p className={styles.description}>
                        {post.description.length > 140 ? (
                            <>
                                {post.description.slice(0, 140) + '... '}
                                <button id="col-secondary">Read more</button>
                            </>
                        ) : (
                            post.description
                        )}
                    </p>
                </div>
            </a>
            <div className={`${styles.profile_info} d-flex`}>
                <div className={styles.profile_info__details}>
                    <span id={`popover-trigger-${index}`} className="d-inline-block" typeof="button" tabIndex={0} data-bs-toggle="popover" data-bs-trigger="manual" data-bs-container="body" data-bs-custom-class="default-author-popover">
                        <div className={`${styles.profile_info} d-flex`}>
                            <div className="align-content-center">
                                <LazyImage onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`${styles.pfp} img-fluid`} src={`/${authorData.profileImageUrl}` || '/ui/placeholder-pfp.png'} placeholderUrl="/ui/placeholder-pfp.png" alt="pfp" width={42.5} height={42.5} />
                            </div>
                            <div className={styles.profile_info__details}>
                                <Link href={`/author/${authorData.authorKey}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`${styles.profile_info__text} m-0`}>
                                    {authorData.fullName}
                                </Link>
                                <p className={`${styles.profile_info__text} align-content-center m-0`}>
                                    {moment(post.date, 'DD-MM-YYYY').format('D MMM')} • {post.readTime?.toString()} min read
                                </p>
                            </div>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
