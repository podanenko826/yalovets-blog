'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import { useRouter } from 'next/navigation';

import styles from './PostCard.module.css';
import { Popover, Offcanvas, Modal } from 'bootstrap';

import type { AuthorItem, PostItem, PostPreviewItem } from '@/types';
import { deletePost, getMDXContent } from '@/lib/posts';
import LazyImage from '../LazyImage';

import { FaCoffee } from 'react-icons/fa';
import { usePostStore } from '../posts/store';

type PostCardProps = {
    post: PostItem;
    previewData?: PostPreviewItem;
    authorData: AuthorItem;
    style: 'massive' | 'full' | 'expanded' | 'preview' | 'admin' | 'standard';
    index?: number | 1;
    setValue?: React.Dispatch<React.SetStateAction<string>>;
    setImageFile?: React.Dispatch<React.SetStateAction<File | null>>;
    onVisible?: () => void;
};

const PostCard = ({ post, previewData, authorData, style, index, setValue, setImageFile, onVisible }: PostCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(null); // Store the image preview
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for the file input

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]; // Get the first selected file
            if (file) {
                const newName = file.name.replace(/\s+/g, '');
                // Create a new File object with the modified name
                const newFile = new File([file], newName, { type: file.type, lastModified: file.lastModified });

                // Pass the uploaded image file back to EditorComponent
                if (setImageFile) setImageFile(newFile);

                const reader = new FileReader(); // Create a new FileReader

                // Once the file is loaded, set the image preview
                reader.onloadend = () => {
                    if (reader.result) {
                    setImagePreview(reader.result as string); // Store the image data URL in state
                    }
                };

                reader.readAsDataURL(file); // Read the file as a data URL (image)
            }
    };

  // Trigger file input click when the image div is clicked
  const handleImageClick = () => {
    fileInputRef.current?.click(); // Trigger the file input click
  };

    const { setExpandedPost } = usePostStore();

    const PostInfoSection = React.memo(
        (props: { descLength: number; noLimit?: boolean }) => {
            return (
                <div className={styles.postInfo}>
                    <div className="d-flex align-content-center m-0">
                        <a role="button" onClick={handlePostOpen}>
                            {props.noLimit ? (
                                <h2 className={`${styles.heading} subheading d-flex flex-wrap align-items-center gap-1`} id="col-heading-1">
                                    {post.title} {moment.utc(post.modifyDate).isAfter(moment.utc(post.date)) && moment.utc(post.modifyDate).diff(moment.utc(post.date), 'days') <= 30 && !post.sponsoredBy && <span className="badge text-wrap">{'Updated ' + moment.utc(post.modifyDate).fromNow()}</span>}
                                    {post.sponsoredBy && <span className="badge badge-sponsored">Sponsored</span>}
                                </h2>
                            ) : (
                                <h2 className={`${styles.heading} subheading`} id="col-heading-1">
                                    {post.title && post.title.length > 90 ? <>{post.title.slice(0, 90) + '... '}</> : post.title} {moment.utc(post.modifyDate).isAfter(moment.utc(post.date)) && moment.utc(post.modifyDate).diff(Date.now(), 'days') >= -30 && !post.sponsoredBy && <span className="badge">Updated</span>} {/* Add a badge if the post was updated within the last 30 days */}
                                    {post.sponsoredBy && <span className="badge badge-sponsored">Sponsored</span>}
                                </h2>
                            )}
                        </a>
                    </div>
                    {props.noLimit ? (
                        <p className={styles.description}>{post.description.length > 160 ? <>{post.description}</> : post.description}</p>
                    ) : (
                        <p className={styles.description}>
                            {post.description && post.description.length > props.descLength ? (
                                <>
                                    <a role="button" onClick={handlePostOpen}>
                                        {post.description.slice(0, props.descLength) + '... '}
                                    </a>
                                    <a role="button" onClick={handlePostExpansion} className="a-link a-button" id="col-secondary">
                                        Read more
                                    </a>
                                </>
                            ) : (
                                <a role="button" onClick={handlePostOpen}>
                                    {post.description}
                                </a>
                            )}
                        </p>
                    )}
                </div>
            );
        },
        (prevProps, nextProps) => prevProps.descLength === nextProps.descLength && prevProps.noLimit === nextProps.noLimit
    );

    const handlePostOpen = () => {
        window.history.pushState(null, "", `/${post.slug}`);
    };

    const handlePostDeletion = async (email: string, slug: string, date: string) => {
        const deletedPostSlug = await deletePost({ email, slug, date });
        if (deletedPostSlug) {
            router.refresh();
        }
    };

    const handlePostExpansion = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (cardRef.current) {
            // Get the bounding rectangle of the card
            const rect = cardRef.current!.getBoundingClientRect();
            setExpandedPost({ post: post, boundingBox: rect });
        }
    };

    useEffect(() => {
        if (onVisible) {
            onVisible(); // Notify parent that the component is visible
        }
    }, [onVisible]);

    const router = useRouter();

    const modalRef = useRef<Modal | null>(null);
    const offcanvasRef = useRef<Offcanvas | null>(null);
    const popoverRef = useRef<Popover | null>(null);

    const [popoverVisible, setPopoverVisible] = useState(false); // Single source of truth for visibility
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for timeout to avoid state re-renders

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const Modal = require('bootstrap/js/dist/modal');
        const modalTrigger = document.querySelector('.modal');

        if (modalTrigger) {
            const newModal = new Modal(modalTrigger);
            modalRef.current = newModal;
        }

        return () => {
            if (modalRef.current) {
                modalRef.current.dispose();
                modalRef.current = null;
            }
        };
    }, [index]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const Offcanvas = require('bootstrap/js/dist/offcanvas');
        const offcanvasTrigger = document.querySelector(`.offcanvas`);

        if (offcanvasTrigger && Offcanvas) {
            const newOffcanvas = new Offcanvas(offcanvasTrigger);

            offcanvasRef.current = newOffcanvas;
        }
    }, [index]);

    // Initialize popover on first render
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const Popover = require('bootstrap/js/dist/popover');
        const popoverTrigger = document.querySelector(`#popover-trigger-${index}`);

        if (popoverTrigger && Popover && authorData) {
            if (!popoverRef.current) {
                popoverRef.current = new Popover(popoverTrigger, {
                    html: true,
                    placement: 'top',
                    customClass: 'd-none d-md-inline-block',
                    content: `
                        <div class="row mx-3 mt-2">
                            <div class="col-12 col-md-9 p-0">
                                <a role="button" class="subheading-smaller a-link m-0" id="author-link-${index}">${authorData.fullName}</a>
                                <h6 class="subheading-xsmall text-thinner py-2" id="col-heading-1">${authorData.bio}</h6>
                            </div>
            
                            <div class="col-md-3 p-0 mr-2">
                                <Image class="${styles.popoverPfp}" src="/${authorData.profileImageUrl}" width={50} height={50} />
                            </div>
            
                            <div class="col-md-12 horisontal-line horisontal-line-thin"></div>
            
                            <div class="col-12 d-flex justify-content-between p-0 align-content-center">
                                <p class="p-0 m-0">Visit my profile</p>
                                <a role="button" class="a-btn btn-outlined px-2 py-0" id="visit-button-${index}">
                                    Visit
                                </a>
                            </div>
                        </div>
                    `,
                    trigger: 'manual',
                });
            }
        }

        return () => {
            if (popoverRef.current) {
                popoverRef.current.dispose();
                popoverRef.current = null;
            }
        };
    }, [index, authorData]);

    const handleMouseEnter = () => {
        clearHideTimeout();

        hideTimeoutRef.current = setTimeout(() => {
            if (!popoverVisible) {
                setPopoverVisible(true);
                if (popoverRef && popoverRef.current) {
                    popoverRef.current.show();
                }
            }
        }, 400); // 0.4-second delay
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
        }, 1100); // 1.1-second delay
    };

    const clearHideTimeout = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    };

    // Effect to attach listeners to the dynamic popover content
    useEffect(() => {
        if (popoverVisible) {
            const popoverContent = document.querySelector('div.popover') as HTMLElement;
            if (popoverContent) {
                popoverContent.addEventListener('mouseenter', handleMouseEnter);
                popoverContent.addEventListener('mouseleave', handleMouseLeave);
            }
        }
    }, [popoverVisible, handleMouseEnter, handleMouseLeave]);

    return style === 'massive' ? (
        <div className={styles.latest_post}>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    {post.imageUrl && (
                        <a role="button" className="col-lg-6" onClick={handlePostOpen}>
                            <div className={styles.image}>
                                <picture className={`img-fluid ${styles.imageWrapper}`}>
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
                            </div>
                        </a>
                    )}
                    <div ref={cardRef} className="col-lg-5 offset-lg-1 py-3" id="latest-post">
                        <a role="button" onClick={handlePostOpen}>
                            <h1 className={`${styles.heading} heading`} id="col-heading-1">
                                {post.title && post.title.length > 85 ? <>{post.title.slice(0, 85) + '... '}</> : post.title} {moment.utc(post.modifyDate).isAfter(moment.utc(post.date)) && moment.utc(post.modifyDate).diff(Date.now(), 'days') >= -30 && !post.sponsoredBy && <span className="badge">Updated</span>} {/* Add a badge if the post was updated within the last 30 days */}
                                {post.sponsoredBy && <span className="badge badge-sponsored">Sponsored</span>}
                            </h1>
                        </a>
                        <p className={`${styles.description} pb-2`}>
                            {post.description && post.description.length > 140 ? (
                                <>
                                    <a role="button" onClick={handlePostOpen}>
                                        {post.description.slice(0, 140) + '... '}
                                    </a>
                                    <a role="button" onClick={handlePostExpansion} className="a-link a-button" id="col-secondary">
                                        Read more
                                    </a>
                                </>
                            ) : (
                                <a role="button" onClick={handlePostOpen}>
                                    {post.description}
                                </a>
                            )}
                        </p>
                        <a role="button" onClick={handlePostOpen}>
                            <button className="btn-filled">Read on</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    ) : style === 'full' ? (
        <div ref={cardRef} className="col-12 col-md-6" key={index}>
            {post.imageUrl && (
                <a role="button" onClick={handlePostOpen}>
                    <div className={styles.image}>
                        <picture className={`img-fluid ${styles.imageWrapper}`}>
                            <Image className="img-fluid" src={post.imageUrl || '/ui/not-found.png'} alt={post.title} title={post.title} width={546} height={182} loading="lazy" sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" />
                            {post.postType && (
                                <span className={`d-inline-block ${styles.articleLabel} ${post.postType === 'Guide' ? styles.articleLabel_Guide : post.postType === 'Review' ? styles.articleLabel_Review : post.postType === 'Article' ? '' : styles.articleLabel_News} subheading-xxsmall`}>
                                    <FaCoffee className="m-1 subheading-xxsmall" id={styles.labelIcon} />
                                    {post.postType} {/* Display the post type */}
                                </span>
                            )}
                        </picture>
                    </div>
                </a>
            )}

            <PostInfoSection descLength={160} />

            <div className={`${styles.profile_info} d-flex`}>
                {authorData && (
                    <div className={styles.profile_info__details}>
                        <span id={`popover-trigger-${index}`} className="d-inline-block" typeof="button" tabIndex={0} data-bs-toggle="popover" data-bs-trigger="manual" data-bs-container="body" data-bs-custom-class="default-author-popover">
                            <div className={`${styles.profile_info} d-flex`}>
                                <div className="align-content-center">
                                    <Link href={`/author/${authorData.authorKey}`} role="button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`m-0 p-0`}>
                                        <LazyImage className={`${styles.pfp} img-fluid`} src={`/${authorData.profileImageUrl}` || '/ui/placeholder-pfp.png'} placeholderUrl="/ui/placeholder-pfp.png" alt="pfp" width={42.5} height={42.5} />
                                    </Link>
                                </div>
                                <div className={styles.profile_info__details}>
                                    <Link href={`/author/${authorData.authorKey}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`${styles.profile_info__text} m-0`}>
                                        {authorData.fullName}
                                    </Link>

                                    <p className={`${styles.profile_info__text} align-content-center m-0`} id="col-heading-1">
                                        {moment(post.date).format('D MMM')} • {post.readTime?.toString()} min read
                                    </p>
                                </div>
                            </div>
                        </span>
                    </div>
                )}
            </div>
        </div>
    ) : style === 'expanded' ? (
        <div className={`col-12 ${styles.expandedContainer}`} key={index}>
            {post.imageUrl && (
                <a role="button" onClick={handlePostOpen}>
                    <div className={styles.image}>
                        <picture className={`img-fluid ${styles.imageWrapper}`}>
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
                            {post.postType && (
                                <span className={`d-inline-block ${styles.articleLabel} ${post.postType === 'Guide' ? styles.articleLabel_Guide : post.postType === 'Review' ? styles.articleLabel_Review : post.postType === 'Article' ? '' : styles.articleLabel_News} subheading-xxsmall`}>
                                    <FaCoffee className="m-1 subheading-xxsmall" id={styles.labelIcon} />
                                    {post.postType} {/* Display the post type */}
                                </span>
                            )}
                        </picture>
                    </div>
                </a>
            )}

            <PostInfoSection descLength={300} noLimit />

            <div className={`${styles.profile_info} d-flex`}>
                {authorData && (
                    <div className={styles.profile_info__details}>
                        <span id={`popover-trigger-${index}`} className="d-inline-block" typeof="button" tabIndex={0} data-bs-toggle="popover" data-bs-trigger="manual" data-bs-container="body" data-bs-custom-class="default-author-popover">
                            <div className={`${styles.profile_info} d-flex`}>
                                <div className="align-content-center">
                                    <Link href={`/author/${authorData.authorKey}`} role="button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`m-0 p-0`}>
                                        <LazyImage className={`${styles.pfp} img-fluid`} src={`/${authorData.profileImageUrl}` || '/ui/placeholder-pfp.png'} placeholderUrl="/ui/placeholder-pfp.png" alt="pfp" width={42.5} height={42.5} />
                                    </Link>
                                </div>
                                <div className={styles.profile_info__details}>
                                    <Link href={`/author/${authorData.authorKey}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`${styles.profile_info__text} m-0`}>
                                        {authorData.fullName}
                                    </Link>

                                    <p className={`${styles.profile_info__text} align-content-center m-0`} id="col-heading-1">
                                        {moment(post.date).format('D MMM')} • {post.readTime?.toString()} min read
                                    </p>
                                </div>
                            </div>
                        </span>
                    </div>
                )}
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
                            className="img-fluid full-image admin-image"
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
                    <h2 className={`${styles.heading} subheading d-flex flex-wrap align-content-center gap-1`} id="col-heading-1">
                        {post.title} {moment.utc(post.modifyDate).isAfter(moment.utc(post.date)) && <span className="px-2 py-1 text-wrap badge">{'Updated ' + moment.utc(post.modifyDate).fromNow()}</span>}
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
                {authorData && (
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
                                    <p className={`${styles.profile_info__text} align-content-center m-0`} id="col-heading-1">
                                        {moment.utc(post.date).format('D MMM')} • {post.readTime?.toString()} min read
                                    </p>
                                </div>
                            </div>
                        </span>
                    </div>
                )}
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
                                <p className="pt-4">(Think twice before making this desicion, &apos;permanently&apos; is a long period)</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-filled py-2 px-5" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn-filled btn-danger py-2 px-3" data-bs-dismiss="modal" onClick={() => handlePostDeletion(post.email, post.slug, post.date as string)}>
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
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    ref={fileInputRef} // Assigning ref to file input
                                />

                                {/* Image used as the button (it will also act as the preview once uploaded) */}
                                <div
                                    style={{
                                        cursor: 'pointer',
                                        border: '2px dashed #ccc',
                                        minWidth: '354px',
                                        minHeight: '180px',
                                        maxHeight: '180px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#f4f4f4',
                                    }}
                                    onClick={handleImageClick}
                                    className='admin-image img-fluid'
                                >
                                    <Image
                                        className="img-fluid admin-image"
                                        src={imagePreview || '/ui/addpost.png'} // Using the image URL, including the placeholder logic if needed
                                        alt={post.title}
                                        title={post.title}
                                        loading="lazy"
                                        width={354}
                                        height={180}
                                        sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="col-lg-8">
                            <div className={styles.postInfo}>
                                <div className="d-flex align-content-center m-0">
                                    <h2 className={`${styles.heading} subheading`} id="col-heading-1">
                                        {previewData.title || 'Enter the post title'} {moment.utc(post.modifyDate).isAfter(moment.utc(post.date)) && <span className="badge">Updated</span>}
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
                                        <p className={`${styles.profile_info__text} align-content-center m-0`} id="col-heading-1">
                                            {moment.utc(post.date).format('D MMM')} • {post.readTime?.toString()} min read
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
        <div ref={cardRef} className={`${styles.card} col-12 col-md-4`} key={index}>
            {post.imageUrl && (
                <a role="button" onClick={handlePostOpen}>
                    <div className={styles.image}>
                        <picture className={`img-fluid ${styles.imageWrapper}`}>
                            <Image className="img-fluid" src={post.imageUrl || '/ui/not-found.png'} alt={post.title} title={post.title} width={354} height={180} loading="lazy" sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px" />
                            {post.postType && (
                                <span className={`d-inline-block ${styles.articleLabel} ${post.postType === 'Guide' ? styles.articleLabel_Guide : post.postType === 'Review' ? styles.articleLabel_Review : post.postType === 'Article' ? '' : styles.articleLabel_News} subheading-xxsmall`}>
                                    <FaCoffee className="m-1 subheading-xxsmall" id={styles.labelIcon} />
                                    {post.postType} {/* Display the post type */}
                                </span>
                            )}
                        </picture>
                    </div>
                </a>
            )}

            <PostInfoSection descLength={140} />

            <div className={`${styles.profile_info} d-flex`}>
                {authorData && (
                    <div className={styles.profile_info__details}>
                        <span id={`popover-trigger-${index}`} className="d-inline-block" typeof="button" tabIndex={0} data-bs-toggle="popover" data-bs-trigger="manual" data-bs-container="body" data-bs-custom-class="default-author-popover">
                            <div className={`${styles.profile_info} d-flex`}>
                                <div className="align-content-center">
                                    <Link href={`/author/${authorData.authorKey}`} role="button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`m-0 p-0`}>
                                        <LazyImage className={`${styles.pfp} img-fluid`} src={authorData.profileImageUrl && `/${authorData.profileImageUrl}`} placeholderUrl="/ui/placeholder-pfp.png" alt="pfp" width={42.5} height={42.5} />
                                    </Link>
                                </div>
                                <div className={styles.profile_info__details}>
                                    <Link href={`/author/${authorData.authorKey}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-bs-toggle="popover" className={`${styles.profile_info__text} m-0`}>
                                        {authorData.fullName}
                                    </Link>

                                    <p className={`${styles.profile_info__text} align-content-center m-0`} id="col-heading-1">
                                        {moment(post.date).format('D MMM')} • {post.readTime?.toString()} min read
                                    </p>
                                </div>
                            </div>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
