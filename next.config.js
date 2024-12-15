const remarkGfm = import('remark-gfm');
const remarkParse = import('remark-parse');
const remarkRehype = import('remark-rehype');
const rehypeStringify = import('rehype-stringify');
const remarkAdmonitions = import('remark-admonitions');

const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [remarkParse, remarkGfm, remarkAdmonitions],
        rehypePlugins: [remarkRehype, rehypeStringify],
    },
});

module.exports = withMDX({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    images: {
        domains: ['cloudonaut.io'], // Add your image hostnames here
    },
});
