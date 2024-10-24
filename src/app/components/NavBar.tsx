'use client';
import React, {useState} from 'react';

import styles from './NavBar.module.css';

import {usePathname} from 'next/navigation';

import {FaCoffee} from 'react-icons/fa';
import {IoMdMenu} from 'react-icons/io';
import {IoMdClose} from 'react-icons/io';

export const navigation = [
    {
        label: 'Home',
        href: '/',
        id: 0,
    },
    {
        label: 'Blog',
        href: '/page/1',
        id: 1,
    },
    {
        label: 'Skills',
        href: '/skills',
        id: 2,
    },
    {
        label: 'Books',
        href: '/books-and-courses',
        id: 3,
    },
];

const NavBar = () => {
    const currentPath = usePathname();
    const [mobileMenuOpened, setMobileMenuOpened] = useState<boolean>(false);

    const handleMobileNavigation = () => {
        setMobileMenuOpened(!mobileMenuOpened);

        window.scrollTo(0, 0);

        // To make sure user cannot scroll the page when nav menu is opened
        if (mobileMenuOpened) {
            document.body.classList.remove('overflow-hidden');
        } else {
            document.body.classList.add('overflow-hidden');
        }
    };

    return (
        <>
            <header className="container">
                <div className="navbar navbar-expand-lg md-nav row d-none d-lg-flex py-0">
                    <div className="container-sm col-3 py-0">
                        <a href="/">
                            <h4
                                className={`${styles.navbar_brand} col-primary`}>
                                Yalovets Blog
                                <FaCoffee className={styles.navLogo_icon} />
                            </h4>
                        </a>
                    </div>
                    <div
                        className={`${styles.navbar_nav} navbar navbar-collapse container-lg col-9 py-0`}>
                        {navigation.map(item => (
                            <a
                                key={item.id}
                                href={item.href}
                                className={styles.nav_link}
                                id={`${
                                    item.href === currentPath
                                        ? styles.active
                                        : ''
                                }`}>
                                {item.label}
                            </a>
                        ))}
                        <button className="btn-outlined">Subscribe</button>
                    </div>
                </div>
                <div className="navbar navbar-expand-lg xs-nav row d-flex d-lg-none container">
                    <div className="col-3 d-flex">
                        <button
                            id={styles.mobileNavigation}
                            type="button"
                            aria-controls="mobileNavigation"
                            aria-expanded={mobileMenuOpened}
                            aria-label="Toggle navigation"
                            onClick={handleMobileNavigation}>
                            {mobileMenuOpened ? (
                                <IoMdClose
                                    className={styles.mobileNavIcon}
                                    id={styles.menu_opened}
                                />
                            ) : (
                                <IoMdMenu className={styles.mobileNavIcon} />
                            )}
                        </button>
                    </div>
                    <div className="d-flex col-9 justify-content-end">
                        <a className={styles.btn_subscribe} href="#">
                            Subscribe
                        </a>
                    </div>
                </div>
                <div
                    className={`${mobileMenuOpened ? 'd-flex' : 'd-none'} ${
                        styles.nav_menu_mobile
                    }`}>
                    <div className="pt-3 d-flex flex-column">
                        {navigation.map(item => (
                            <a
                                key={item.id}
                                href={item.href}
                                className={`${styles.nav_link_mobile}`}
                                id={
                                    currentPath === item.href
                                        ? 'col-secondary'
                                        : 'col-primary'
                                }>
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            </header>
        </>
    );
};

export default NavBar;
