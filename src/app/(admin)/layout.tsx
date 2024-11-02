import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import theme from '@/app/theme';
import '@/app/css/custom.css';
import '@/app/globals.css';

import {ThemeProvider} from '@mui/material';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'Yalovets Blog',
    description: 'Ivan Yalovets Blog Website',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className}`}>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>{children}</ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}