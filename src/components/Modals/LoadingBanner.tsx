'use client';
import React, { useEffect, useState } from 'react';
import styles from './Modals.module.css';
import NavBarStyles from '@/components/NavBar.module.css';

import { FaCoffee } from 'react-icons/fa';
import { usePostContext } from '../Context/PostDataContext';
import Link from 'next/link';

const LoadingBanner = () => {
    const [isShowed, setIsShowed] = useState<boolean>(true);

    const { posts } = usePostContext();
    const { authors } = usePostContext();
    const { loading } = usePostContext();

    useEffect(() => {
        if (!loading) {
            setIsShowed(false);
        }
    }, [loading]);

    if (isShowed) {
        return (
            <div className={styles.loadingBanner}>
                <div className="container-sm pb-5 d-flex justify-content-center">
                    <h4 className={`${styles.navbar_brand} col-primary`}>
                        Yalovets Blog
                        <FaCoffee className={`${styles.navLogo_icon}`} />
                    </h4>
                </div>
            </div>
        );
    }

    return;
};

export default LoadingBanner;
