'use client';
import React, { useEffect, useState } from 'react';
import styles from './Modals.module.css';

import { FaCoffee } from 'react-icons/fa';
import { usePostContext } from '../Context/PostDataContext';

const LoadingBanner = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100); // Simulate loading time

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

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
};

export default LoadingBanner;
