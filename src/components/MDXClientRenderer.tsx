'use client';
import { MDXProvider } from '@mdx-js/react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import YouTubeEmbed from './mdx/YouTubeEmbed';

const components = {
    YouTubeEmbed
};

export default function MDXClientRenderer({ serialized }: { serialized: MDXRemoteSerializeResult }) {
    return (
        <MDXRemote 
            compiledSource={serialized.compiledSource} 
            scope={serialized.scope} 
            frontmatter={serialized.frontmatter} 
            components={components} 
        />
    );
}
