import { serialize } from 'next-mdx-remote/serialize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

const mdSerialize = async (source: string) => {
    return await serialize(source, {
        mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeStringify] },
    });
};

export { mdSerialize };
