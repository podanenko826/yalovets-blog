'use client';
import React, {useEffect, useState} from 'react';

import styles from './Footer.module.css';

import {navigation} from './NavBar';

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
            <div
                className={`${styles.footer} container-fluid justify-content-center`}>
                <div className="container d-flex pb-5">
                    <div className="col-7 pt-3">
                        <h1 className="heading-large" id={styles.subscribeText}>
                            Stay informed, <br />
                            subscribe to Yalovets Blog!
                        </h1>
                        <p className={`${styles.navText} pt-2`}>
                            Keep in touch with latest information in tech
                            industry
                        </p>
                    </div>
                    <div className="d-flex">
                        <form className="row p-3">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={subscribeData?.firstName}
                                onChange={e =>
                                    handleSubscribeDataChange(
                                        e.target.value,
                                        e.target.name
                                    )
                                }
                                id={styles.inputBox}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={subscribeData?.email}
                                onChange={e =>
                                    handleSubscribeDataChange(
                                        e.target.value,
                                        e.target.name
                                    )
                                }
                                id={styles.inputBox}
                            />
                            <div className="d-flex align-content-start">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e: any) =>
                                        handleCheckboxChange(e)
                                    }
                                    id={styles.agreementCheckbox}
                                />
                                <p className={styles.navText}>
                                    I want to subscribe to the newsletter and
                                    recieve annoucements regarding new products
                                    and services. I agree with the{' '}
                                    <a href="#" className={styles.navLink}>
                                        Privacy Policy.
                                    </a>
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={
                                    !agreedToTerms ||
                                    subscribeData.firstName === '' ||
                                    subscribeData.email === ''
                                }
                                className={styles.btn_subscribe}>
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                <div className="container justify-content-between py-3">
                    <div className="row justify-content-between">
                        <div className="col-md-3">
                            <h4 className={styles.navText}>Links</h4>
                            <div className="horisontal-line horisontal-line-thin" />
                            <ul className="row gap-3">
                                {navButtons.map(item => (
                                    <li key={item.id}>
                                        <a
                                            href={item.href}
                                            key={item.id}
                                            className={styles.navLink}>
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-md-3">
                            <h4 className={styles.navText}>Legal</h4>
                            <div className="horisontal-line horisontal-line-thin" />
                            <ul className="row justify-content-end gap-3">
                                {footerLinks.map(item => (
                                    <li key={item.id}>
                                        <a
                                            href={item.href}
                                            key={item.id}
                                            className={styles.navLink}>
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="container pt-5">
                    <p className={styles.navText}>@2024 Yalovets Blog</p>
                </div>
            </div>
        </>
    );
};

export default Footer;
