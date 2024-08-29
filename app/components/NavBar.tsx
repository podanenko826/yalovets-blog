'use client';

import * as React from 'react';

import styles from './NavBar.module.css';

import {usePathname} from 'next/navigation';

import {FaCoffee} from 'react-icons/fa';

const NavBar = () => {
    const currentPath = usePathname();

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

    return (
        <nav className={styles.navbar}>
            <div className={styles.navLogo_container}>
                <a href="/">
                    <h1 className={styles.navLogo} id="col-primary">
                        Yalovets Blog
                    </h1>
                    <FaCoffee
                        className={styles.navLogo_icon}
                        id="col-primary"
                    />
                </a>
            </div>

            <div className={styles.navContainer}>
                {navigation.map(item => (
                    <a
                        key={item.id}
                        href={item.href}
                        className={`${styles.navLink}`}
                        id={currentPath === item.href ? 'col-primary' : ''}>
                        {item.label}
                    </a>
                ))}
                <button className="btn-outlined outline outline-1 hover:bg-zinc-500 hover:text-white px-4 py-2.5 rounded-[5px] duration-75">
                    Subscribe
                </button>
                {/* <Button variant="outlined" color="primary">
                    Subscribe
                </Button> */}
            </div>
        </nav>
    );
};

export default NavBar;
