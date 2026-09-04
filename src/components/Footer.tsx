'use client';
import React, { useEffect, useState } from 'react';
import styles from './Footer.module.css';
import { navigation } from './NavBar';
import Link from 'next/link';
import { FaCoffee } from 'react-icons/fa';
import navBarStyles from './NavBar.module.css';

const Footer = () => {
    const [navButtons, setNavButtons] = useState(navigation);

    useEffect(() => {
        if (!navButtons && navigation) {
            setNavButtons([...navigation]);
        }
    }, [navButtons]);

    const footerLinks = [
        { label: 'Privacy Policy', href: '/privacy-policy', id: 1 },
        { label: 'Imprint', href: '/imprint', id: 2 },
    ];

    return (
        <footer className={`${styles.footer} mt-5`}>
            <div className="container py-5">
                <div className="row gy-4 justify-content-between">
                    <div className="col-12 col-md-5">
                        <h4 className={`${navBarStyles.navbar_brand} text-white`}>
                            Yalovets Blog
                            <FaCoffee className={navBarStyles.navLogo_icon} />
                        </h4>
                        <p className={styles.descriptionText}>
                            Sharing the latest tools and insights on web services. <br />
                            Built for web professionals and enthusiasts alike.
                        </p>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="row m-0">
                            <div className="col-6">
                                <h5 className={`${styles.navHeading} mb-3`}>Navigation</h5>
                                <ul className={`${styles.linkContainer} d-flex flex-column gap-2`}>
                                    {navButtons.map(item => (
                                        <li key={item.id}>
                                            <Link href={item.href !== '/page' ? item.href : '/page/1'} className={styles.navLink}>
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-6">
                                <h5 className={`${styles.navHeading} mb-3`}>Legal</h5>
                                <ul className={`${styles.linkContainer} d-flex flex-column gap-2`}>
                                    {footerLinks.map(item => (
                                        <li key={item.id}>
                                            <Link href={item.href} className={styles.navLink}>
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${styles.copyrightContainer} mt-5 pt-4`}>
                    <p className={`${styles.copyrightText} text-center mb-0`}>
                        &copy; {new Date().getFullYear()} Yalovets Blog. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
