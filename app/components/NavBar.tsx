'use client';
import React, {useState} from 'react';

import styles from './NavBar.module.css';

import {usePathname} from 'next/navigation';

import {FaCoffee} from 'react-icons/fa';
import {IoMdMenu} from 'react-icons/io';
import {IoMdClose} from 'react-icons/io';

const NavBar = () => {
    const currentPath = usePathname();
    const [mobileMenuOpened, setMobileMenuOpened] = useState<boolean>(false);

    const navigation = [
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
    ];

    const handleMobileNavigation = (
        event: React.MouseEvent<HTMLAnchorElement>
    ) => {
        event.preventDefault();
        setMobileMenuOpened(!mobileMenuOpened);
    };

    return (
        <>
            <header className="container">
                <div className="navbar navbar-expand-lg md-nav row d-none d-lg-flex py-0">
                    {/* <a
                            className={styles.navMenu_btn}
                            onClick={e => handleMobileNavigation(e)}>
                            {mobileMenuOpened ? <IoMdClose /> : <IoMdMenu />}
                        </a> */}

                    <div className="container-sm col-3 py-0">
                        <a href="/" className="navbar-brand">
                            <h4 className="text-primary">
                                Yalovets Blog
                                <FaCoffee className={styles.navLogo_icon} />
                            </h4>
                        </a>
                    </div>
                    <div
                        className={`navbar-nav navbar navbar-collapse container-lg col-9 py-0`}>
                        {navigation.map(item => (
                            <a
                                key={item.id}
                                href={item.href}
                                className="nav-link"
                                id={`${
                                    item.href === currentPath ? 'active' : ''
                                }`}>
                                {item.label}
                            </a>
                        ))}
                        <button className="btn-outlined">Subscribe</button>
                    </div>
                </div>
            </header>
            {/* <div
                    className={styles.navMenu_mobile}
                    id={mobileMenuOpened ? 'flex' : 'hidden'}>
                    <div className={styles.navContainer_mobile}>
                        {navigation.map(item => (
                            <a
                                key={item.id}
                                href={item.href}
                                className={`${styles.navLink_mobile}`}
                                id={currentPath === item.href ? 'col-primary' : ''}>
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div> */}
        </>
    );
};

export default NavBar;
