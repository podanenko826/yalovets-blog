import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { lazy } from 'react';
import '@/app/css/custom.css';
import '@/app/globals.css';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const PostPreviewModal = lazy(() => import('@/components/Modals/PostPreviewModal'));

export const metadata: Metadata = {
    title: 'Yalovets Blog Admin',
    description: 'Ivan Yalovets Blog Website',
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
                            })();
                        `
                    }} />
                </head>
                <body>
                    {children}
                </body>
            </html>
        </AppRouterCacheProvider>
    );
}
