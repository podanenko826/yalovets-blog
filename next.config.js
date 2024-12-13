const remarkGfm = import('remark-gfm');
const remarkParse = import('remark-parse');
const remarkRehype = import('remark-rehype');
const reactAdmonitions = import('remark-admonitions');
const rehypeStringify = import('rehype-stringify');

const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [remarkParse, remarkGfm],
        rehypePlugins: [remarkRehype, rehypeStringify],
    },
});

module.exports = withMDX({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
});
