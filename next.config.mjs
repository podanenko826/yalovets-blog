import { compile } from '@mdx-js/mdx';
import rehypeKatex from 'rehype-katex'; // Render math with KaTeX.
import remarkFrontmatter from 'remark-frontmatter'; // YAML and such.
import remarkGfm from 'remark-gfm'; // Tables, footnotes, strikethrough, task lists, literal URLs.
import remarkMath from 'remark-math'; // Support math like `$so$`.
import createMDX from '@next/mdx';

console.log(compiled);
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure `pageExtensions` to include markdown and MDX files
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    // Optionally, add any other Next.js config below
    compiler: {
        styledComponents: true,
    },
    reactStrictMode: false,
};

const withMDX = createMDX({
    extension: /.(md|mdx)$/,
    providerImportSource: '@mdx-js/react',
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
