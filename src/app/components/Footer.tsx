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
            <div className={`${styles.footer} container-fluid`}>
                <div className="container d-flex">
                    <div className="col-7 pt-4">
                        <h1 id={styles.subscribeText}>
                            Stay informed, <br />
                            subscribe to Yalovets Blog!
                        </h1>
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
                                <p id={styles.text_white}>
                                    I want to subscribe to the newsletter and
                                    recieve annoucements regarding new products
                                    and services. I agree with the Privacy
                                    Policy.
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
                <div className="container d-flex justify-content-between mt-5">
                    <div>
                        <h4 id={styles.text_white}>Links</h4>
                        <div className="d-flex gap-4" id={styles.text_white}>
                            {navButtons.map(item => (
                                <a
                                    href={item.href}
                                    key={item.id}
                                    id={styles.text_white}>
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 id={styles.text_white}>Legal</h4>
                        <div
                            className="d-flex justify-content-end gap-4"
                            id={styles.text_white}>
                            {footerLinks.map(item => (
                                <a
                                    href={item.href}
                                    key={item.id}
                                    id={styles.text_white}>
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container mt-5">
                    <p id={styles.text_white}>@2024 Yalovets Blog</p>
                </div>
            </div>
        </>
    );
};

export default Footer;