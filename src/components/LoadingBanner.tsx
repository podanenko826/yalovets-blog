'use client';
import React, { useEffect, useState } from 'react';
import styles from '@/components/ArticleModal.module.css';
import NavBarStyles from '@/components/NavBar.module.css';

import { FaCoffee } from 'react-icons/fa';
import { usePostContext } from './PostContext';

const LoadingBanner = () => {
    const [isShowed, setIsShowed] = useState<boolean>(true);

    const { posts } = usePostContext();
    const { authors } = usePostContext();

    useEffect(() => {
        if (posts.length > 0 && authors.length > 0) {
            setIsShowed(false);
        }
    }, [posts, authors]);

    if (isShowed) {
        return (
            <div className={styles.loadingBanner}>
                <div className="container-sm pb-5 d-flex justify-content-center">
                    <h4 className={`${NavBarStyles.navbar_brand} col-primary heading-large`}>
                        Yalovets Blog
                        <FaCoffee className={`${NavBarStyles.navLogo_icon} heading-large`} />
                    </h4>
                </div>
            </div>
        );
    }

    return;
};

export default LoadingBanner;
