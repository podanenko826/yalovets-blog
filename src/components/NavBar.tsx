'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from './NavBar.module.css';

import { usePathname } from 'next/navigation';

import { FaCoffee } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';
import { IoMoonOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { useUserConfigStore } from './userConfig/store';

export const navigation = [
    {
        label: 'Home',
        href: '/',
        id: 0,
    },
    {
        label: 'Blog',
        href: '/page',
        id: 1,
    },
    {
        label: 'Books',
        href: '/books-recomendation',
        id: 2,
    },
    // {
    //     label: 'Podcasts',
    //     href: '/podcasts',
    //     id: 2,
    // },
    // {
    //     label: 'YouTube',
    //     href: '/youtube',
    //     id: 3,
    // },
    // {
    //     label: 'Books',
    //     href: '/books-recomendation',
    //     id: 4,
    // },
];

const NavBar = () => {
    const currentPath = usePathname();
    const [mobileMenuOpened, setMobileMenuOpened] = useState<boolean>(false);

    const { theme, setTheme } = useUserConfigStore();
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

    useEffect(() => {
        setIsDarkTheme(theme === 'dark');
    }, [theme]);

    const handleMobileNavigation = () => {
        setMobileMenuOpened(!mobileMenuOpened);

        const navbarElement = document.getElementById('mobileNavBar');
        
        if (navbarElement) {
            navbarElement.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'start' });
        }

        // To make sure user cannot scroll the page when nav menu is opened
        if (mobileMenuOpened) {
            document.body.classList.remove('overflow-hidden');
            document.getElementById('modal')?.classList.remove('overflow-hidden');
        } else {
            document.body.classList.add('overflow-hidden');
            document.getElementById('modal')?.classList.add('overflow-hidden');
            document.getElementById('modal')?.scrollTo(0, 0);
        }
    };

    const handleThemeChange = () => {
        setTheme(isDarkTheme ? 'light' : 'dark');
    }
    
    return (
        <>
            <header className="container navbar-container">
                <div className="navbar navbar-expand-lg md-nav row d-none d-lg-flex py-0">
                    <div className="container-sm col-3 py-0">
                        <Link href="/">
                            <h4 className={`${styles.navbar_brand} col-primary`}>
                                Yalovets Blog
                                <FaCoffee className={styles.navLogo_icon} />
                            </h4>
                        </Link>
                    </div>
                    <div className={`${styles.navbar_nav} navbar navbar-collapse container-lg col-9 py-0`}>
                        {navigation.map(item => {
                            const isActive = 
                                item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href + '/');
                    
                            return (
                                <Link key={item.id} href={item.href !== '/page' ? item.href : '/page/1'} className={styles.nav_link} id={`${isActive ? styles.active : ''}`}>
                                    {item.label}
                                </Link>
                            );
                        })}
                        <button className="btn-outlined">Subscribe</button>
                        <button className='btn-pill' onClick={() => handleThemeChange()}>
                            {isDarkTheme ? (
                                <IoSunnyOutline className='btn-pill-svg px-1' />
                            ) : (
                                <IoMoonOutline className='btn-pill-svg px-1' />
                            )}
                        </button>
                    </div>
                </div>
                <div className="navbar navbar-expand-lg xs-nav p-0 row d-flex justify-content-center d-lg-none container" id='mobileNavBar'>
                    <div className="col-3 d-flex">
                        <button id={styles.mobileNavigation} type="button" aria-controls="mobileNavigation" aria-expanded={mobileMenuOpened} aria-label="Toggle navigation" onClick={handleMobileNavigation}>
                            {mobileMenuOpened ? <IoMdClose className={styles.mobileNavIcon} id={styles.menu_opened} /> : <IoMdMenu className={styles.mobileNavIcon} />}
                        </button>
                        {mobileMenuOpened && (
                            <button className='btn-outlined h-min mx-3 px-2 p-0' onClick={() => handleThemeChange()}>
                                {isDarkTheme ? (
                                    <IoSunnyOutline />
                                ) : (
                                    <IoMoonOutline />
                                )}
                            </button>
                        )}
                    </div>
                    <div className="d-flex col-9 justify-content-end p-0 m-0">
                        <Link className={styles.btn_subscribe} href="#">
                            Subscribe
                        </Link>
                    </div>
                </div>
                <div className={`${mobileMenuOpened ? 'd-flex d-lg-none' : 'd-none'} ${styles.nav_menu_mobile}`}>
                    <div className="pt-3 d-flex flex-column">
                        {navigation.map(item => {
                            const isActive = 
                            item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href + '/');

                            return (
                                <Link key={item.id} href={item.href !== '/page' ? item.href : '/page/1'} onClick={() => handleMobileNavigation()} className={`${styles.nav_link_mobile}`} id={isActive ? 'col-secondary' : 'col-primary'}>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </header>
        </>
    );
};

export default NavBar;
