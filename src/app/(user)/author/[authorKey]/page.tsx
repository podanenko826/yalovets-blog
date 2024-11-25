import {getAuthorByKey} from '@/lib/authors';
import {AuthorItem, PostItem} from '@/types';
import {notFound} from 'next/navigation';
import React, {FC} from 'react';

import Image from 'next/image';

import postCardStyles from '@/components/PostCard.module.css';
import {getSortedPosts} from '@/lib/posts';
import LazyPostCard from '@/components/LazyPostCard';

interface AuthorPageProps {
    params: {authorKey: string};
    // mdxSource: MDXRemoteProps | MDXRemoteSerializeResult | null;
}

const AuthorPage: FC<AuthorPageProps> = async ({params}: AuthorPageProps) => {
    const {authorKey} = params;

    const authorData = await getAuthorByKey(authorKey);
    if (!authorData.email) return notFound();

    const sortedPosts = await getSortedPosts();
    const postsData = sortedPosts
        .map(post => {
            if (post.email === authorData.email) return post;
        })
        .filter(Boolean);

    if (!postsData) return notFound();

    return (
        <div className="container">
            <div className="container mb-5">
                <div
                    className={`${postCardStyles.profile_info} d-flex justify-content-center mt-4`}>
                    <Image
                        className={`${postCardStyles.pfp}`}
                        src={`/${authorData.profileImageUrl}`}
                        alt="pfp"
                        width={42.5}
                        height={42.5}
                    />
                    <h2 className="p-2 m-0">{authorData.fullName}</h2>
                </div>
                <div className="my-4 d-flex justify-content-center">
                    <h5 className="m-0 p-0 col-9 subheading-tiny text-center">
                        {authorData.bio}
                    </h5>
                </div>
            </div>

            <div className="container posts" id="posts">
                <div className="row post-list">
                    <div className="d-flex justify-content-center p-0 m-0 mt-5">
                        <h3>
                            {authorData.fullName}
                            {authorData.fullName.at(-1)?.toLowerCase() === 's'
                                ? "'"
                                : "'s"}{' '}
                            posts
                        </h3>
                    </div>
                    {postsData.map((post, index) => (
                        <LazyPostCard
                            post={post as PostItem}
                            authorData={authorData}
                            style="standard"
                            index={index}
                            key={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuthorPage;
