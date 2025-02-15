import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import '@/app/css/custom.css';
import '@/app/globals.css';
import { lazy } from 'react';

export const metadata: Metadata = {
    title: 'Yalovets Blog',
    description: 'Ivan Yalovets Blog Website',
};

// const PostProvider = lazy(() => import('@/components/Context/PostProvider'));

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AppRouterCacheProvider>
            <html lang="en">
                <body>
                    {/* <PostProvider> */}
                        {children}
                    {/* </PostProvider> */}
                </body>
            </html>
        </AppRouterCacheProvider>
    );
}
