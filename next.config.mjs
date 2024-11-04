import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure `pageExtensions` to include markdown and MDX files
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    // Optionally, add any other Next.js config below
    compiler: {
        styledComponents: true,
    },
};

const withMDX = createMDX({
    options: {
        remarkPlugins: [remarkGfm],
        // rehypePlugins: [rehypeRaw],
    },
    extension: /.(md|mdx)$/,
    providerImportSource: '@mdx-js/react',
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
