import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import theme from './theme';
import './css/custom.css';
import './globals.css';

import NavBar from './components/NavBar';
import Footer from './components/Footer';

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
                    <ThemeProvider theme={theme}>
                        <NavBar />
                        {children}
                        <Footer />
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
