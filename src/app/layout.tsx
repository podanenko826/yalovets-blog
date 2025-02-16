import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import '@/app/css/custom.css';
import '@/app/globals.css';

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
