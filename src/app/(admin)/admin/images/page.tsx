'use client';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import postCardStyles from '@/components/PostCard/PostCard.module.css';
import Link from 'next/link';
import { IoMdRefresh } from 'react-icons/io';
import path from 'path';

const PostsPage = () => {
    const IMAGES_PER_PAGE = 30;

    const [imagesPaths, setImagesPaths] = useState<string[]>([]);
    const [imagesDisplayed, setImagesDisplayed] = useState<number>(IMAGES_PER_PAGE);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/image', { method: 'GET' });
                const data = await response.json();

                if (Array.isArray(data)) {
                    setImagesPaths(data);
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);
    

    const refreshImages = async () => {
        try {
            const response = await fetch('/api/image', { method: 'GET' });
            const data = await response.json();

            if (Array.isArray(data)) {
                setImagesPaths(data);
            }
        } catch (err) {
            console.error("Error fetching images:", err);
        }
    };

    const deleteImage = async (path: string) => {
        try {
            const response = await fetch(`/api/image?imagePath=${path}`, { method: 'DELETE' });

            if (response.ok) {
                refreshImages();
            }
        } catch (err) {
            console.error("Error deleting image:", err);
        }
    }

    return (
        <div>
            <div className="container-fluid posts" id="posts">
                <div className='d-flex gap-4'>
                    <Link href={'/admin'}>
                        <button className="btn-filled px-3 py-3 mt-4">←Back to console</button>
                    </Link>
                    <button className="btn-outlined px-3 py-2 mt-4" onClick={() => refreshImages()}>
                            <IoMdRefresh /> Refresh
                    </button>
                </div>
                <div className="container-lg mt-5">
                    <div className="row post-list">

                        {imagesPaths.slice(0, imagesDisplayed).map(pathName => {
                            if (!pathName.includes('.webp')) return;

                            return (
                                <div className='col-12 col-md-6 col-lg-4 my-3 px-3 mx-' style={{ border: '2px solid var(--col-secondary)'}}>
                                    <Image src={`/images/` + pathName as string} width={354} height={354} alt={''} />
                                    <h3>{pathName.split('/').at(-1)}</h3>
                                    <h4>Date: {pathName.split('/').at(-3)}.{pathName.split('/').at(-2)}</h4>
                                    <h5>Path: public/images/{pathName}</h5>
                                    <button onClick={() => deleteImage(path.join('public/images', pathName))} className='btn-filled btn-danger my-3'>Delete</button>
                                </div>
                            );
                        })}

                        <button onClick={() => {
                            setImagesDisplayed(prev => prev + IMAGES_PER_PAGE)
                        }} className='btn-outlined my-5 py-3'>
                            Display another {IMAGES_PER_PAGE} images
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostsPage;
