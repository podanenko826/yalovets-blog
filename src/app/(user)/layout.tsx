import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

import '@/app/css/custom.css';
import '@/app/globals.css';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

import PostPreviewModal from '@/components/Modals/PostPreviewModal';
import LoadingBanner from '@/components/Modals/LoadingBanner';

export const metadata: Metadata = {
    title: 'Code & Coffee',
    description: 'Ivan Code & Coffee Website',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AppRouterCacheProvider>
            <html lang="en" className='no-theme' suppressHydrationWarning>
                <head>
                    <script dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var config = localStorage.getItem('userConfig');
                                    if (config) {
                                        var parsedConfig = JSON.parse(config);
                                        document.documentElement.classList.remove('no-theme');
                                        document.documentElement.classList.add(parsedConfig.theme === 'dark' ? 'dark' : 'light');
                                    }
                                } catch (e) {}

                                function updateScrollbarWidth() {
                                    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                    document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
                                }
                                window.addEventListener('DOMContentLoaded', updateScrollbarWidth);
                                window.addEventListener('load', updateScrollbarWidth);
                                window.addEventListener('resize', updateScrollbarWidth);
                            })();
                        `
                    }} />
                </head>
                <body>
                    <LoadingBanner />
                    <NavBar />
                    <PostPreviewModal />
                    {children}
                    <Footer />
                </body>
            </html>
        </AppRouterCacheProvider>
    );
}
