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
        if (!navButtons) {
            setNavButtons([...navigation]);
        }
    }, [navButtons]);

    const footerLinks = [
        {
            label: 'About Yalovets Blog',
            href: '#',
            id: 0,
        },
        {
            label: 'Privacy Policy',
            href: '#',
            id: 1,
        },
        {
            label: 'Terms of Service',
            href: '#',
            id: 2,
        },
    ];

    return (
        <>
            <div className={`${styles.footer} container-fluid justify-content-center`}>
                <div className="container d-flex">
                    <div className="row">
                        <div className="col-md-7 pt-3">
                            <h1 className="heading heading-large" id={styles.subscribeText}>
                                Stay informed, <br />
                                subscribe to Yalovets Blog!
                            </h1>
                            <p className={`${styles.navText} pt-2`}>Keep in touch with latest information in tech industry</p>
                        </div>
                        <div className="d-flex col-md-5">
                            <form className="row" id={styles.subscribeForm}>
                                <input type="text" name="firstName" placeholder="First name" value={subscribeData?.firstName} onChange={e => handleSubscribeDataChange(e.target.value, e.target.name)} id={styles.inputBox} />
                                <input type="email" name="email" placeholder="Email address" value={subscribeData?.email} onChange={e => handleSubscribeDataChange(e.target.value, e.target.name)} id={styles.inputBox} />
                                <div className="d-flex align-content-start">
                                    <input type="checkbox" checked={agreedToTerms} onChange={(e: any) => handleCheckboxChange(e)} id={styles.agreementCheckbox} />
                                    <p className={styles.navText}>
                                        I want to subscribe to the newsletter with new content and recieve annoucements regarding new products and services. I agree with the{' '}
                                        <Link href="#" className={styles.navLink}>
                                            Privacy Policy.
                                        </Link>
                                    </p>
                                </div>
                                <button type="submit" disabled={!agreedToTerms || subscribeData.firstName === '' || subscribeData.email === ''} className={styles.btn_subscribe}>
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="container justify-content-between py-4">
                    <div className="row justify-content-between">
                        <div className="col-md-3 pt-">
                            <h4 className={styles.navText}>Links</h4>
                            <div className="horisontal-line horisontal-line-thin" />
                            <ul className={`${styles.linkContainer} row gap-3`}>
                                {navButtons.map(item => (
                                    <li key={item.id}>
                                        <Link href={item.href} key={item.id} className={styles.navLink}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-md-3 pt-4">
                            <h4 className={styles.navText}>Legal</h4>
                            <div className="horisontal-line horisontal-line-thin" />
                            <ul className={`${styles.linkContainer} row justify-content-end gap-3`}>
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

                <div className="container pt-4">
                    <p className={styles.navText}>@2024 Yalovets Blog</p>
                </div>
            </div>
        </>
    );
};

export default Footer;
