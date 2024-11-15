'use client';
import React, {useEffect, useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import {useRouter} from 'next/navigation';

import styles from '@/components/PostCard.module.css';
import bootstrap from 'react-bootstrap';
import {Alert} from 'react-bootstrap';

import type {AuthorItem, PostItem, PostPreviewItem} from '@/types';
import {StaticImport} from 'next/dist/shared/lib/get-img-props';
import {Modal} from 'bootstrap';
import {deletePost, formatPostDate} from '@/lib/posts';

type PostCardProps = {
    post: PostItem;
    previewData?: PostPreviewItem;
    authorData: AuthorItem;
    style: 'massive' | 'full' | 'preview' | 'admin' | 'standard';
    index?: number | 1;
    setValue?: React.Dispatch<React.SetStateAction<string>>;
};

const PostCard = ({
    post,
    previewData,
    authorData,
    style,
    index,
    setValue,
}: PostCardProps) => {
    const router = useRouter();
    const modalRef = useRef<Modal | null>(null);

    const showModal = () => {
        if (modalRef.current) {
            modalRef.current.show();
        }
    };

    useEffect(() => {
        // Check for window and document to confirm we are on the client side
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            const modalElement = document.getElementById('deletionModal');
            if (modalElement) {
                modalRef.current = new Modal(modalElement, {backdrop: true});
            }
        }
    }, []);

    const handlePostDeletion = async (email: string, slug: string) => {
        const deletedPostSlug = await deletePost({email, slug});
        if (deletedPostSlug) {
            router.refresh();
        }
    };

    return style === 'massive' ? (
        <div className={styles.latest_post}>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    {post.imageUrl && (
                        <div className="col-lg-6">
                            <Link href={`${post.slug}`}>
                                <Image
                                    className={`img-fluid ${styles.massive_img}`}
                                    src={
                                        post.imageUrl || '/img/placeholder.png'
                                    } // Using the image URL, including the placeholder logic if needed
                                    alt={post.title}
                                    title={post.title}
                                    priority={true} // Ensuring the image is preloaded and prioritized
                                    width={354}
                                    height={180}
                                    sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                />
                            </Link>
                        </div>
                    )}
                    <div className="col-lg-5 offset-lg-1 py-3" id="latest-post">
                        <div
                            className={`${styles.profile_info} d-flex pb-2 pb-sm-2`}>
                            <div className="align-content-center">
                                <Image
                                    className={`${styles.pfp} img-fluid`}
                                    src={`/${authorData.profileImageUrl}`}
                                    alt="pfp"
                                    width={42.5}
                                    height={42.5}
                                />
                            </div>

                            <div className={styles.profile_info__details}>
                                <p className={styles.profile_info__text}>
                                    {authorData.fullName}
                                </p>
                                <p className={styles.profile_info__text}>
                                    {moment(post.date, 'DD-MM-YYYY').format(
                                        'D MMM'
                                    )}{' '}
                                    • {post.readTime} min read
                                </p>
                            </div>
                        </div>
                        <a href={`/${post.slug}`}>
                            <h1 className={styles.heading}>{post.title}</h1>
                            <p className={`${styles.description} pb-2`}>
                                {post.description}
                            </p>

                            <button className="btn-filled">Read on</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    ) : style === 'full' ? (
        <div className="col-12 col-md-6" key={index}>
            <Link href={`/${post.slug}`}>
                {post.imageUrl && (
                    <div className={styles.image}>
                        <Image
                            className="img-fluid full-image"
                            src={post.imageUrl || '/img/placeholder.png'} // Using the image URL, including the placeholder logic if needed
                            alt={post.title}
                            title={post.title}
                            priority={true} // Ensuring the image is preloaded and prioritized
                            width={354}
                            height={180}
                            sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                        />
                    </div>
                )}

                <div className={styles.postInfo}>
                    <h2 className={styles.heading} id="col-heading-1">
                        {post.title}
                    </h2>
                    <p className={styles.description}>{post.description}</p>
                </div>
            </Link>
            <div className={`${styles.profile_info} d-flex`}>
                <div className="align-content-center">
                    <Image
                        className={`${styles.pfp} img-fluid`}
                        src={`/${authorData.profileImageUrl}`}
                        alt="pfp"
                        width={42.5}
                        height={42.5}
                    />
                </div>

                <div className={styles.profile_info__details}>
                    <p className={styles.profile_info__text}>
                        {authorData.fullName}
                    </p>
                    <p className={styles.profile_info__text}>
                        {moment(post.date, 'DD-MM-YYYY').format('D MMM')} •{' '}
                        {post.readTime?.toString()} min read
                    </p>
                </div>
            </div>
        </div>
    ) : style === 'admin' ? (
        <div className="col-12" key={index}>
            <Link
                href={''}
                data-bs-toggle="modal"
                data-bs-target={`#leavingModal-${post.slug}`}>
                {post.imageUrl && (
                    <div className={styles.image} key={post.imageUrl}>
                        <Image
                            className="img-fluid full-image"
                            src={post.imageUrl || '/img/placeholder.png'} // Using the image URL, including the placeholder logic if needed
                            alt={post.title}
                            title={post.title}
                            priority={true} // Ensuring the image is preloaded and prioritized
                            width={354}
                            height={180}
                            sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                        />
                    </div>
                )}

                <div className={styles.postInfo}>
                    <h2 className={styles.heading} id="col-heading-1">
                        {post.title}
                    </h2>
                    <p className={styles.description}>{post.description}</p>
                </div>
            </Link>

            <div
                className="modal fade"
                id={`leavingModal-${post.slug}`}
                tabIndex={-1}
                aria-labelledby={`leavingModalLabel-${post.slug}`}
                aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id={`leavingModalLabel-${post.slug}`}>
                                You are about to leave the admin page.
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>
                                The post with the following title will be opened
                                in the blog: <br />
                            </p>
                            <h4 id={`leavingModalLabel-${post.slug}`}>
                                {post.title}
                            </h4>
                        </div>
                        <div className="modal-footer">
                            <Link href={`/${post.slug}`}>
                                <button
                                    type="button"
                                    className="btn-filled py-2"
                                    data-bs-dismiss="modal">
                                    Open post
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${styles.profile_info} d-flex`}>
                <div className="align-content-center">
                    <Image
                        className={`${styles.pfp} img-fluid`}
                        src={`/${authorData.profileImageUrl}`}
                        alt="pfp"
                        width={42.5}
                        height={42.5}
                    />
                </div>

                <div className={styles.profile_info__details}>
                    <p className={styles.profile_info__text}>
                        {authorData.fullName}
                    </p>
                    <p className={styles.profile_info__text}>
                        {moment(post.date, 'DD-MM-YYYY').format('D MMM')} •{' '}
                        {post.readTime?.toString()} min read
                    </p>
                </div>
            </div>
            <div className="d-flex justify-content-end mt-3 gap-3">
                <Link href={`/admin/${post.slug}`}>
                    <button className="btn-filled px-5 py-2">Edit</button>
                </Link>

                <button
                    className="btn-filled btn-danger px-3 py-2"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target={`#deletionModal-${post.slug}`}>
                    Delete
                </button>
                <div
                    className="modal fade"
                    id={`deletionModal-${post.slug}`}
                    tabIndex={-1}
                    aria-labelledby={`deletionModalLabel-${post.slug}`}
                    aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    className="modal-title"
                                    id={`deletionModalLabel-${post.slug}`}>
                                    Are you sure you want to delete this post?
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    The post with the following title will be
                                    permanently deleted: <br />
                                </p>
                                <h4 id={`deletionModalLabel-${post.slug}`}>
                                    {post.title}
                                </h4>
                                <p className="pt-4">
                                    (Think twice before making this desicion,
                                    'permanently' is a long period)
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-filled py-2 px-5"
                                    data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn-filled btn-danger py-2 px-3"
                                    data-bs-dismiss="modal"
                                    onClick={() =>
                                        handlePostDeletion(
                                            post.email,
                                            post.slug
                                        )
                                    }>
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
                                <Image
                                    className="img-fluid"
                                    src={
                                        post.imageUrl || '/img/placeholder.png'
                                    } // Using the image URL, including the placeholder logic if needed
                                    alt={post.title}
                                    title={post.title}
                                    priority={true} // Ensuring the image is preloaded and prioritized
                                    width={354}
                                    height={180}
                                    sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                />
                            </div>
                        )}

                        <div className="col-lg-8">
                            <div className={styles.postInfo}>
                                <h2
                                    className={styles.heading}
                                    id="col-heading-1">
                                    {previewData.title ||
                                        'Enter the post title'}
                                </h2>
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
                                    <p className={styles.description}>
                                        {previewData.description}
                                    </p>
                                )}
                            </div>

                            <div className={`${styles.profile_info} d-flex`}>
                                <div className="align-content-center">
                                    <Image
                                        className={`${styles.pfp} img-fluid`}
                                        src={`/${previewData.authorData.profileImageUrl}`}
                                        alt="pfp"
                                        width={42.5}
                                        height={42.5}
                                    />
                                </div>

                                <div className={styles.profile_info__details}>
                                    <p className={styles.profile_info__text}>
                                        {previewData.authorData.fullName}
                                    </p>
                                    <p className={styles.profile_info__text}>
                                        {moment(
                                            previewData.date,
                                            'DD-MM-YYYY'
                                        ).format('D MMM')}{' '}
                                        • {previewData.readTime?.toString()} min
                                        read
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>
                    Preview has failed: please pass the previewData object to
                    this component
                </p>
            )}
        </div>
    ) : (
        <div className="col-12 col-md-4" key={index}>
            <Link href={`/${post.slug}`}>
                {post.imageUrl && (
                    <div className={styles.image}>
                        <picture className="img-fluid">
                            <source
                                type="image/png"
                                srcSet={`${post.imageUrl} 1140w, ${post.imageUrl} 2280w, ${post.imageUrl} 960w, ${post.imageUrl} 1920w`}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                            <source
                                srcSet={`${post.imageUrl} 1140w, ${post.imageUrl} 2280w, ${post.imageUrl} 960w, ${post.imageUrl} 1920w`}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                            <Image
                                className="img-fluid"
                                src={post.imageUrl}
                                alt={post.title}
                                title={post.title}
                                priority
                                width={354}
                                height={180}
                            />
                        </picture>
                    </div>
                )}

                <div className={styles.postInfo}>
                    <h2 className={styles.heading} id="col-heading-1">
                        {post.title}
                    </h2>
                    <p className={styles.description}>{post.description}</p>
                </div>
            </Link>
            <div className={`${styles.profile_info} d-flex`}>
                <div className="align-content-center">
                    <Image
                        className={`${styles.pfp} img-fluid`}
                        src={`/${authorData.profileImageUrl}`}
                        alt="pfp"
                        width={42.5}
                        height={42.5}
                    />
                </div>

                <div className={styles.profile_info__details}>
                    <p className={styles.profile_info__text}>
                        {authorData.fullName}
                    </p>
                    <p className={styles.profile_info__text}>
                        {moment(post.date, 'DD-MM-YYYY').format('D MMM')} •{' '}
                        {post.readTime?.toString()} min read
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
