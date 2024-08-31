import createMDX from '@next/mdx';
import pkg from 'nextra';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure `pageExtensions` to include markdown and MDX files
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    // Optionally, add any other Next.js config below
    compiler: {
        styledComponents: true,
    },
};

const withNextra = pkg({
    theme: 'nextra-theme-blog',
    themeConfig: './theme.config.jsx',
});

// Merge MDX config with Next.js config
export default withNextra(nextConfig);
