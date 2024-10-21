import React from 'react';

import styles from './PostCard.module.css';

type Post = {
    imageSrc: string;
    heading: string;
    description: string;
    link: string;
};

type PostCardProps = {
    post: Post;
    index: number;
};

const PostCard = ({post, index}: PostCardProps) => {
    return (
        <div className="col-12 col-md-4" key={index}>
            <a href={post.link}>
                {post.imageSrc && (
                    <div className={styles.image}>
                        <picture className="img-fluid">
                            <source
                                type="image/png"
                                srcSet={`${post.imageSrc} 1140w, ${post.imageSrc} 2280w, ${post.imageSrc} 960w, ${post.imageSrc} 1920w`}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                            <source
                                srcSet={`${post.imageSrc} 1140w, ${post.imageSrc} 2280w, ${post.imageSrc} 960w, ${post.imageSrc} 1920w`}
                                sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                            />
                            <img
                                className="img-fluid"
                                src={post.imageSrc}
                                alt={post.heading}
                                title={post.heading}
                            />
                        </picture>
                    </div>
                )}

                <div className={styles.postInfo}>
                    <h2 className={styles.heading} id="col-heading-1">
                        {post.heading}
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
                    <p className={styles.profile_info__text}>Ivan Yalovets</p>
                    <p className={styles.profile_info__text}>
                        20 Oct • 5 min read
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
