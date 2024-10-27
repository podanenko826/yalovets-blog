import React from 'react';
import moment from 'moment';

import styles from './PostCard.module.css';

import type {ArticleItem} from '@/types';

type PostCardProps = {
    post: ArticleItem;
    index?: number | 1;
    style: 'massive' | 'full' | 'standard';
};

const PostCard = ({post, index, style}: PostCardProps) => {
    return style === 'massive' ? (
        <div className={styles.latest_post}>
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    {post.imageUrl && (
                        <div className="col-lg-6">
                            <a href={`${post.id}`}>
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
                                    src="/img/ivan-pfp.png"
                                    alt="pfp"
                                />
                            </div>

                            <div className={styles.profile_info__details}>
                                <p className={styles.profile_info__text}>
                                    {post.authorName}
                                </p>
                                <p className={styles.profile_info__text}>
                                    {moment(post.date, 'DD-MM-YYYY').format(
                                        'D MMM'
                                    )}{' '}
                                    • {post.readTime} min read
                                </p>
                            </div>
                        </div>
                        <a href={`/${post.id}`}>
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
            <a href={`/${post.id}`}>
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
                        src="/img/ivan-pfp.png"
                        alt="pfp"
                    />
                </div>

                <div className={styles.profile_info__details}>
                    <p className={styles.profile_info__text}>
                        {post.authorName}
                    </p>
                    <p className={styles.profile_info__text}>
                        {moment(post.date, 'DD-MM-YYYY').format('D MMM')} •{' '}
                        {post.readTime} min read
                    </p>
                </div>
            </div>
        </div>
    ) : (
        <div className="col-12 col-md-4" key={index}>
            <a href={`/${post.id}`}>
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
                        src="/img/ivan-pfp.png"
                        alt="pfp"
                    />
                </div>

                <div className={styles.profile_info__details}>
                    <p className={styles.profile_info__text}>
                        {post.authorName}
                    </p>
                    <p className={styles.profile_info__text}>
                        {moment(post.date, 'DD-MM-YYYY').format('D MMM')} •{' '}
                        {post.readTime} min read
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
