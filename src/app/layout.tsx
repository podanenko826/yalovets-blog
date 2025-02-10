import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import '@/app/css/custom.css';
import '@/app/globals.css';
import { lazy } from 'react';

export const metadata: Metadata = {
    title: 'Yalovets Blog',
    description: 'Ivan Yalovets Blog Website',
};

const PostProvider = lazy(() => import('@/components/Context/PostProvider'));

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <PostProvider>
                        {children}
                    </PostProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
