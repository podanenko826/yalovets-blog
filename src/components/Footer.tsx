'use client';
import React, { useEffect, useState } from 'react';

import styles from './Footer.module.css';

import { navigation } from './NavBar';
import Link from 'next/link';

const Footer = () => {
    const [navButtons, setNavButtons] = useState(navigation);

    const [subscribeData, setSubscribeData] = useState({
        firstName: '',
        email: '',
    });

    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSubscribeDataChange = (e: string, field: string) => {
        setSubscribeData(prevData => ({
            ...prevData,
            [field]: e,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgreedToTerms(e.target.checked);
    };

    useEffect(() => {
        if (!navButtons && navigation) {
            setNavButtons([...navigation]);
        }
    }, [navigation]);

    const footerLinks = [
        {
            label: 'Privacy Policy',
            href: '/privacy-policy',
            id: 1,
        },
        {
            label: 'Imprint',
            href: '/imprint',
            id: 2,
        },
    ];

    return (
        <>
            <div className={`${styles.footer} container-fluid justify-content-center`}>
                <div className="container py-1">
                    <div className="row justify-content-between">
                        <div className="col-auto">
                            <div>
                                <h4 className={styles.navText}>Links</h4>
                                <div className="horisontal-line horisontal-line-thin" />
                            </div>
                            <ul className={`${styles.linkContainer} d-flex gap-4`}>
                                {navButtons.map(item => (
                                    <li key={item.id}>
                                        <Link href={item.href !== '/page' ? item.href : '/page/1'} key={item.id} className={styles.navLink}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-auto">
                            <h4 className={styles.navText}>Legal</h4>
                            <div className="horisontal-line horisontal-line-thin" />
                            <ul className={`${styles.linkContainer} d-flex justify-content-end gap-4`}>
                                {footerLinks.map(item => (
                                    <li key={item.id}>
                                        <Link href={item.href} key={item.id} className={styles.navLink}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="container pt-3">
                    <p className={styles.navText}>@2025 Yalovets Blog</p>
                </div>
            </div>
        </>
    );
};

export default Footer;
