import React from 'react';

import {getSortedPosts} from '@/lib/posts';
import {getUsers} from '@/lib/users';
import {AuthorItem, PostItem} from '@/types';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import postCardStyles from '@/components/PostCard.module.css';
import moment from 'moment';
import Link from 'next/link';

const PostCard = dynamic(() => import('@/components/PostCard'), {ssr: false});

const AdminPage = async () => {
    const postData: PostItem[] = await getSortedPosts();

    const authorData: AuthorItem[] = await getUsers();

    const managementItems = [
        {
            id: 0,
            title: 'Menage posts',
            description:
                'Create, update and remove posts from your blog in one place.',
            imageUrl: '/img/addpost.png',
            url: '/admin/posts',
        },
        {
            id: 1,
            title: 'Menage authors',
            description:
                'Create, update and remove authors that can write posts on your blog in one place.',
            imageUrl: '/img/addpost.png',
            url: '/admin/authors',
        },
        {
            id: 3,
            title: 'Menage categories',
            description:
                'Create, update and remove categories you assign to each post on your blog in one place.',
            imageUrl: '/img/addpost.png',
            url: '/admin/categories',
        },
        {
            id: 4,
            title: 'Menage subscriptors',
            description:
                'View whoever is subscribed to your blog and remove their subscribtions in one place.',
            imageUrl: '/img/addpost.png',
            url: '/admin/subscriptors',
        },
    ];

    return (
        <div>
            <div className="container-lg posts my-5" id="posts">
                <div className="container-fluid">
                    <h1 className="heading-large mt-4">Quick actions</h1>
                    <div className="row post-list">
                        <div className="">
                            <div className="col-md-4">
                                <Link href={'/admin/posts/new'}>
                                    <div className={postCardStyles.image}>
                                        <Image
                                            className={`img-fluid full-image ${postCardStyles.newPostImage}`}
                                            src={'/img/addpost.png'} // Using the image URL, including the placeholder logic if needed
                                            alt={'Create new post'}
                                            title={'Create new post'}
                                            priority={true} // Ensuring the image is preloaded and prioritized
                                            width={354}
                                            height={180}
                                            sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                        />
                                    </div>

                                    <div className={postCardStyles.postInfo}>
                                        <h2
                                            className={postCardStyles.heading}
                                            id="col-heading-1">
                                            Create new post
                                        </h2>
                                        <p
                                            className={
                                                postCardStyles.description
                                            }>
                                            Start expressing yourself on latest
                                            IT news and insights.
                                        </p>
                                    </div>
                                </Link>

                                <div
                                    className={`${postCardStyles.profile_info} d-flex`}>
                                    <div className="align-content-center">
                                        <Image
                                            className={`${postCardStyles.pfp} ${postCardStyles.placeholder_pfp} img-fluid`}
                                            src={`/img/placeholder-pfp.png`}
                                            alt="pfp"
                                            width={42.5}
                                            height={42.5}
                                        />
                                    </div>

                                    <div
                                        className={`
                                        ${postCardStyles.profile_info__details} gap-2
                                    `}>
                                        <div
                                            className={
                                                postCardStyles.profile_info__text
                                            }>
                                            <p
                                                className={
                                                    postCardStyles.dot
                                                }></p>

                                            <p
                                                className={
                                                    postCardStyles.underscore
                                                }></p>
                                            <p
                                                className={
                                                    postCardStyles.underscore
                                                }></p>

                                            <p
                                                className={
                                                    postCardStyles.dot
                                                }></p>
                                            <p
                                                className={
                                                    postCardStyles.underscore
                                                }></p>
                                            <p
                                                className={
                                                    postCardStyles.dot
                                                }></p>
                                            <p
                                                className={
                                                    postCardStyles.underscore
                                                }></p>
                                        </div>
                                        <div
                                            className={
                                                postCardStyles.profile_info__text
                                            }>
                                            <p
                                                className={
                                                    postCardStyles.underscore
                                                }></p>
                                            <p
                                                className={
                                                    postCardStyles.dot
                                                }></p>{' '}
                                            <p
                                                className={
                                                    postCardStyles.dot
                                                }></p>
                                            <p
                                                className={
                                                    postCardStyles.underscore
                                                }></p>
                                            <p
                                                className={
                                                    postCardStyles.underscore
                                                }></p>
                                            <p
                                                className={
                                                    postCardStyles.dot
                                                }></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <h1 className="heading-large mt-5">Management</h1>
                    <div>
                        <div className="row post-list">
                            {managementItems.map(item => (
                                <div
                                    className="col-12 col-md-6 col-lg-3"
                                    key={item.id}>
                                    <div className="col-12">
                                        <Link href={item.url}>
                                            <div
                                                className={
                                                    postCardStyles.image
                                                }>
                                                <Image
                                                    className={`img-fluid full-image ${postCardStyles.newPostImage}`}
                                                    src={'/img/addpost.png'} // Using the image URL, including the placeholder logic if needed
                                                    alt={item.title}
                                                    title={item.title}
                                                    priority={true} // Ensuring the image is preloaded and prioritized
                                                    width={354}
                                                    height={180}
                                                    sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                                />
                                            </div>

                                            <div
                                                className={
                                                    postCardStyles.postInfo
                                                }>
                                                <h2
                                                    className={
                                                        postCardStyles.heading
                                                    }
                                                    id="col-heading-1">
                                                    {item.title}
                                                </h2>
                                                <p
                                                    className={
                                                        postCardStyles.description
                                                    }>
                                                    {item.description}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
