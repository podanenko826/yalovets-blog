'use client';
import React from 'react';

import { rebuildPagination } from '@/lib/posts';
import Image from 'next/image';

import postCardStyles from '@/components/PostCard/PostCard.module.css';
import Link from 'next/link';

const AdminPage = () => {
    const managementItems = [
        {
            id: 1,
            title: 'Manage posts',
            description: 'Create, update and remove posts from your blog in one place.',
            imageUrl: '/ui/postmanage.png',
            url: '/admin/posts',
        },
        // {
        //     id: 2,
        //     title: 'Manage tags',
        //     description: 'Create, update and remove tags you assign to each post on your blog in one place.',
        //     imageUrl: '/ui/tagmanage.png',
        //     url: '/admin/tags',
        // },
        {
            id: 2,
            title: 'Manage authors',
            description: 'Create, update and remove authors that can write posts on your blog in one place.',
            imageUrl: '/ui/authormanage.png',
            url: '/admin/authors',
        },
        {
            id: 3,
            title: 'Manage subscribers',
            description: 'View whoever is subscribed to your blog and remove their subscribtions in one place.',
            imageUrl: '/ui/subscribermanage.png',
            url: '/admin/subscribers',
        },
    ];

    const otherItems = [
        {
            id: 1,
            title: 'Browse images',
            description: 'See what images are uploaded to the server and delete unused ones.',
            imageUrl: '/ui/imagemanage.png',
            url: '/admin/images',
        },
    ];

    return (
        <div>
            <div className="container-lg posts my-5" id="posts">
                <div className="container-fluid">
                    <button onClick={() => rebuildPagination()}>Rebuild Pagination</button>
                    <h1 className="heading-large mt-4">Quick actions</h1>
                    <div className="row post-list">
                        <div className="">
                            <div className="col-md-4">
                                <Link href={'/admin/posts/new'}>
                                    <div className={postCardStyles.image}>
                                        <Image
                                            className={`img-fluid full-image admin-image ${postCardStyles.newPostImage}`}
                                            src={'/ui/addpost.png'} // Using the image URL, including the placeholder logic if needed
                                            alt={'Create new post'}
                                            title={'Create new post'}
                                            priority={true} // Ensuring the image is preloaded and prioritized
                                            width={354}
                                            height={180}
                                            sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                        />
                                    </div>

                                    <div className={postCardStyles.postInfo}>
                                        <h2 className={postCardStyles.heading} id="col-heading-1">
                                            Create new post
                                        </h2>
                                        <p className={postCardStyles.description}>Start expressing yourself on latest IT news and insights.</p>
                                    </div>
                                </Link>

                                <div className={`${postCardStyles.profile_info} d-flex mb-5`}>
                                    <div className="align-content-center">
                                        <Image className={`${postCardStyles.pfp} ${postCardStyles.placeholder_pfp} img-fluid`} src={`/ui/placeholder-pfp.png`} alt="pfp" width={42.5} height={42.5} />
                                    </div>

                                    <div
                                        className={`
                                        ${postCardStyles.profile_info__details} gap-2
                                    `}>
                                        <div className={`${postCardStyles.placeholder_profile_info__text} m-0 m-0`}>
                                            <p className={postCardStyles.dot}></p>

                                            <p className={postCardStyles.underscore}></p>
                                            <p className={postCardStyles.underscore}></p>

                                            <p className={postCardStyles.dot}></p>
                                            <p className={postCardStyles.underscore}></p>
                                            <p className={postCardStyles.dot}></p>
                                            <p className={postCardStyles.underscore}></p>
                                        </div>
                                        <div className={postCardStyles.placeholder_profile_info__text}>
                                            <p className={postCardStyles.underscore}></p>
                                            <p className={postCardStyles.dot}></p> <p className={postCardStyles.dot}></p>
                                            <p className={postCardStyles.underscore}></p>
                                            <p className={postCardStyles.underscore}></p>
                                            <p className={postCardStyles.dot}></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <h1 className="heading-large">Management</h1>
                    <div>
                        <div className="row post-list">
                            {managementItems.map(item => (
                                <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                                    <div className="col-12">
                                        <Link href={item.url}>
                                            <div className={postCardStyles.image}>
                                                <Image
                                                    className={`img-fluid full-image admin-image ${postCardStyles.newPostImage}`}
                                                    src={item.imageUrl} // Using the image URL, including the placeholder logic if needed
                                                    alt={item.title}
                                                    title={item.title}
                                                    priority={true} // Ensuring the image is preloaded and prioritized
                                                    width={354}
                                                    height={180}
                                                    sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                                />
                                            </div>

                                            <div className={postCardStyles.postInfo}>
                                                <h2 className={postCardStyles.heading} id="col-heading-1">
                                                    {item.title}
                                                </h2>
                                                <p className={postCardStyles.description}>{item.description}</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container-fluid my-4">
                    <h1 className="heading-large">Other</h1>
                    <div>
                        <div className="row post-list">
                            {otherItems.map(item => (
                                <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                                    <div className="col-12">
                                        <Link href={item.url}>
                                            <div className={postCardStyles.image}>
                                                <Image
                                                    className={`img-fluid full-image admin-image ${postCardStyles.newPostImage}`}
                                                    src={item.imageUrl} // Using the image URL, including the placeholder logic if needed
                                                    alt={item.title}
                                                    title={item.title}
                                                    priority={true} // Ensuring the image is preloaded and prioritized
                                                    width={354}
                                                    height={180}
                                                    sizes="(min-width: 1200px) 1140px, (min-width: 992px) 960px"
                                                />
                                            </div>

                                            <div className={postCardStyles.postInfo}>
                                                <h2 className={postCardStyles.heading} id="col-heading-1">
                                                    {item.title}
                                                </h2>
                                                <p className={postCardStyles.description}>{item.description}</p>
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
