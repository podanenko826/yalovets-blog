import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';

import NavBar from './NavBar';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'Ivan Yalovets',
    description: 'Ivan Yalovets Blog Website',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <NavBar />
                {children}
            </body>
        </html>
    );
}
