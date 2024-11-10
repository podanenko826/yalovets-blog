import React from 'react';
import moment from 'moment';

import styles from './PostCard.module.css';

import type {PostItem} from '@/types';
import {getUsers} from '@/lib/users';

type PostCardProps = {
    post: PostItem;
    style: 'massive' | 'full' | 'preview' | 'admin' | 'standard';
    index?: number | 1;
    setValue?: React.Dispatch<React.SetStateAction<string>>;
};

const PostCard = async ({post, style, index, setValue}: PostCardProps) => {
    const authorData = await getUsers(post.email);

    if (!authorData) {
        return [];
    }

    return style === 'massive' ? (
        <div className={styles.latest_post}>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    {post.imageUrl && (
                        <div className="col-lg-6">
                            <a href={`${post.slug}`}>
                                <picture
                                    className={`img-fluid ${styles.massive_img}`}>
                                    <source
                                        type="image/png"
                                        srcSet={`${post.imageUrl} 1140w, ${post.imageUrl} 2280w, ${post.imageUrl} 960w, ${post.imageUrl} 1920w`}
                                        sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                    />
                                    <source
                                        srcSet={`${post.imageUrl} 1140w, ${post.imageUrl} 2280w, ${post.imageUrl} 960w, ${post.imageUrl} 1920w`}
                                        sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                    />
                                    <img
                                        className={`img-fluid ${styles.massive_img}`}
                                        src={post.imageUrl}
                                        alt="Recent post teaser"
                                        title="Recent Post"
                                    />
                                </picture>
                            </a>
                        </div>
                    )}
                    <div className="col-lg-5 offset-lg-1 py-3" id="latest-post">
                        <div
                            className={`${styles.profile_info} d-flex pb-2 pb-sm-2`}>
                            <div className="align-content-center">
                                <img
                                    className={`${styles.pfp} img-fluid`}
                                    src={authorData.profileImageUrl}
                                    alt="pfp"
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
            <a href={`/${post.slug}`}>
                {post.imageUrl && (
                    <div className={styles.image}>
                        <picture className="img-fluid full-image">
                            <source
                                type="image/png"
                                srcSet={`${post.imageUrl} 1140w, ${post.imageUrl} 2280w, ${post.imageUrl} 960w, ${post.imageUrl} 1920w`}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                            <source
                                srcSet={`${post.imageUrl} 1140w, ${post.imageUrl} 2280w, ${post.imageUrl} 960w, ${post.imageUrl} 1920w`}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                            <img
                                className="img-fluid full-image"
                                src={post.imageUrl}
                                alt={post.title}
                                title={post.title}
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
            </a>
            <div className={`${styles.profile_info} d-flex`}>
                <div className="align-content-center">
                    <img
                        className={`${styles.pfp} img-fluid`}
                        src={authorData.profileImageUrl}
                        alt="pfp"
                    />
                </div>

                <div className={styles.profile_info__details}>
                    <p className={styles.profile_info__text}>
                        {authorData.fullName}
                    </p>
                    <p className={styles.profile_info__text}>
                        {moment(post.date, 'DD-MM-YYYY').format('D MMM')}•{' '}
                        {post.readTime} min read
                    </p>
                </div>
            </div>
        </div>
    ) : style === 'admin' ? (
        <div className="col-12 col-md-6" key={index}>
            <a href={`/${post.slug}`}>
                {post.imageUrl && (
                    <div className={styles.image}>
                        <picture className="img-fluid full-image">
                            <source
                                type="image/png"
                                srcSet={`${post.imageUrl} 1140w, ${post.imageUrl} 2280w, ${post.imageUrl} 960w, ${post.imageUrl} 1920w`}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                            <source
                                srcSet={`${post.imageUrl} 1140w, ${post.imageUrl} 2280w, ${post.imageUrl} 960w, ${post.imageUrl} 1920w`}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                            <img
                                className="img-fluid full-image"
                                src={post.imageUrl}
                                alt={post.title}
                                title={post.title}
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
            </a>
            <div className={`${styles.profile_info} d-flex`}>
                <div className="align-content-center">
                    <img
                        className={`${styles.pfp} img-fluid`}
                        src={authorData.profileImageUrl}
                        alt="pfp"
                    />
                </div>

                <div className={styles.profile_info__details}>
                    <p className={styles.profile_info__text}>
                        {authorData.fullName}
                    </p>
                    <p className={styles.profile_info__text}>
                        {moment(post.date, 'DD-MM-YYYY').format('D MMM')}•{' '}
                        {post.readTime} min read
                    </p>
                </div>
            </div>
        </div>
    ) : style === 'preview' ? (
        <div className={styles.latest_post}>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    {post.imageUrl && (
                        <div className="col-lg-8">
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
                                <img
                                    className="img-fluid"
                                    src={post.imageUrl}
                                    alt={post.title}
                                    title={post.title}
                                />
                            </picture>
                        </div>
                    )}

                    <div className="col-lg-8">
                        <div className={styles.postInfo}>
                            <h2 className={styles.heading} id="col-heading-1">
                                {post.title}
                            </h2>
                            {setValue ? (
                                <textarea
                                    name="description"
                                    placeholder="Enter a post description"
                                    onChange={e => setValue(e.target.value)}
                                    className="w-100 subheading-small mb-2 col-heading-2"
                                    // rows={2}
                                />
                            ) : (
                                <p className={styles.description}>
                                    {post.description}
                                </p>
                            )}
                        </div>
                        <div className={`${styles.profile_info} d-flex`}>
                            <div className="align-content-center">
                                <img
                                    className={`${styles.pfp} img-fluid`}
                                    src={authorData.profileImageUrl}
                                    alt="pfp"
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
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="col-12 col-md-4" key={index}>
            <a href={`/${post.slug}`}>
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
                            <img
                                className="img-fluid"
                                src={post.imageUrl}
                                alt={post.title}
                                title={post.title}
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
            </a>
            <div className={`${styles.profile_info} d-flex`}>
                <div className="align-content-center">
                    <img
                        className={`${styles.pfp} img-fluid`}
                        src={authorData.profileImageUrl}
                        alt="pfp"
                    />
                </div>

                <div className={styles.profile_info__details}>
                    <p className={styles.profile_info__text}>
                        {authorData.fullName}
                    </p>
                    <p className={styles.profile_info__text}>
                        {moment(post.date, 'DD-MM-YYYY').format('D MMM')}•{' '}
                        {post.readTime} min read
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
