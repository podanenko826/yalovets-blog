import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import theme from '@/app/theme';
import '@/app/css/custom.css';
import '@/app/globals.css';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Home from './page';
const ArticleModal = dynamic(() => import('@/components/ArticleModal'), {
    ssr: false,
});

import { PostProvider } from '@/components/PostContext';
import React from 'react';
import dynamic from 'next/dynamic';
import LoadingBanner from '@/components/LoadingBanner';
import PostPreviewModal from '@/components/PostPreviewModal';

const inter = Inter({ subsets: ['latin'] });

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
            <PostProvider>
                <NavBar />
                <LoadingBanner />
                {children}
                <PostPreviewModal />
                <ArticleModal />
                <Footer />
            </PostProvider>
        </AppRouterCacheProvider>
    );
}
