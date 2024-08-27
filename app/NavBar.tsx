'use client';

import React from 'react';
import {usePathname} from 'next/navigation';

const NavBar = () => {
    const currentPath = usePathname();
    console.log(currentPath);

    const navigation = [
        {
            label: 'Home',
            href: '/',
            id: 0,
        },
        {
            label: 'Blog',
            href: '/blog',
            id: 1,
        },
        {
            label: 'Skills',
            href: '/skills',
            id: 2,
        },
    ];

    return (
        <nav className="flex justify-between min-w-screen px-[330px] py-8 bg-white">
            <div className="flex items-center">
                <a href="/">
                    <h1 className="text-red-600 font-bold text-xl">
                        Yalovets Blog
                    </h1>
                </a>
            </div>

            <div className="space-x-8 text-gray-700">
                {navigation.map(item => (
                    <a
                        key={item.id}
                        href={item.href}
                        className={`${
                            currentPath === item.href
                                ? 'text-red-600'
                                : 'hover:text-red-600'
                        } font-sans hover:underline transition-colors duration-100`}>
                        {item.label}
                    </a>
                ))}
                <button className="outline outline-1 hover:bg-zinc-500 hover:text-white px-4 py-2.5 rounded-[5px] duration-75">
                    Subscribe
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
