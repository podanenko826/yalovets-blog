'use client';
import React, { useEffect, useState } from 'react';
import styles from '@/components/ArticleModal.module.css';
import { usePostContext } from './PostContext';
import moment from 'moment';
import LazyPostCard from './LazyPostCard';
import { MDXProvider } from '@mdx-js/react';
import { useMDXComponents } from '../../mdx-components';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { mdSerialize } from '../../mdSerializer';
import LazyImage from './LazyImage';

const PostPreviewModal = () => {
    const { expandedPost, setExpandedPost } = usePostContext();
    const { authors } = usePostContext();

    const components = useMDXComponents();

    const authorData = authors.find(author => author.email === expandedPost?.email);

    useEffect(() => {
        if (expandedPost) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [expandedPost]);

    if (!expandedPost || !authorData) return;

    return (
        <div className={`${styles.articlePage} ${styles.previewModal}`} onClick={() => setExpandedPost(null)}>
            {expandedPost && authorData ? (
                <div className="container">
                    <div className="d-flex row align-items-center">
                        <div className={`col-5 ${styles.postDataContainer}`}>
                            <LazyPostCard post={expandedPost} authorData={authorData} style="expanded" index={1000} />
                            {/* <div className={`${styles.authorDataContainer}`}>
                                <LazyImage title="pfp" alt="" src={`/${authorData.profileImageUrl}`} width={75} height={75} />
                                <h2 className="text-center subheading">{authorData.fullName}</h2>
                                <p className="text-center">{authorData.bio}</p>
                            </div> */}
                        </div>
                        {/* <div className={`${styles.expendedArticle} col-7`}>
                            {selectedMarkdown && (
                                <article className="article">
                                    <h1 id="col-heading-1" className="py-4 heading heading-xlarge text-center">
                                        {expandedPost.title}
                                    </h1>
                                    <MDXProvider components={components}>
                                        <MDXRemote compiledSource={serializedMarkdown?.compiledSource as string} frontmatter={serializedMarkdown?.frontmatter} scope={serializedMarkdown?.scope} />
                                    </MDXProvider>
                                </article>
                            )}
                        </div> */}
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Hello World</h1>
                </div>
            )}
        </div>
    );
};

export default PostPreviewModal;
