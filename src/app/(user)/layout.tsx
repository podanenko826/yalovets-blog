import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import '@/app/css/custom.css';
import '@/app/globals.css';

import React, { Suspense, lazy } from 'react';
import LoadingBanner from '@/components/Modals/LoadingBanner';

const NavBar = lazy(() => import('@/components/NavBar'));
const Footer = lazy(() => import('@/components/Footer'));

export const metadata: Metadata = {
    title: 'Yalovets Blog',
    description: 'AWS Unveiled: Your Gateway to Cloud Knowledge',
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AppRouterCacheProvider>   
            <NavBar />
            <LoadingBanner />
            {children}
            <Footer />
        </AppRouterCacheProvider>
    );
}
