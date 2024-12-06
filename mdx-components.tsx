import LazyImage from '@/components/LazyImage';
import type { MDXComponents } from 'mdx/types';
import { ImageProps } from 'next/image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
    const ImageWidth: number | undefined = 736;
    return {
        h1: ({ children }) => <h1 className="test">{children}</h1>,
        ...components,
    };
}
