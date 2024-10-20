import React from 'react';

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
            </a>
            <h2 className="pt-3" id="col-heading-1">
                {post.heading}
            </h2>
            <p>{post.description}</p>
        </div>
    );
};

export default PostCard;
