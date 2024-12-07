import LazyImage from '@/components/LazyImage';
import type { MDXComponents } from 'mdx/types';
import { ImageProps } from 'next/image';
import Prism from 'prismjs';
import React, { HTMLAttributes } from 'react';

import { MdContentCopy, MdOutlineDoneAll, MdClear } from 'react-icons/md';

require('prismjs/components/prism-javascript');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-typescript'); // Load TypeScript grammar
require('prismjs/components/prism-tsx');
require('prismjs/components/prism-markup');
require('prismjs/components/prism-css');
require('prismjs/components/prism-python');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-sql');
require('prismjs/components/prism-json');
require('prismjs/components/prism-yaml');

export function useMDXComponents(components?: MDXComponents): MDXComponents {
    const ImageWidth: number | undefined = 736;
    return {
        table: (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableElement> & React.TableHTMLAttributes<HTMLTableElement>) => (
            <div className="container">
                <div className="row p-md-1 p-lg-3 overflow-scroll">
                    <table className="table" {...props} />
                </div>
            </div>
        ),
        td: (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableDataCellElement> & React.TdHTMLAttributes<HTMLTableDataCellElement>) => <td className="col-1" {...props} />,
        li: (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLLIElement> & React.LiHTMLAttributes<HTMLLIElement>) => {
            const isEmpty = !props.children || (typeof props.children === 'string' && props.children.trim() === '');
            return <li className={isEmpty ? 'd-none' : ''} {...props} />;
        },
        a: (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLAnchorElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
            const splitUrl: string[] | undefined = props.href?.split('/');
            let url: string | undefined = props.href;
            if (splitUrl && splitUrl[0] !== 'https:' && splitUrl[0] !== 'http:') {
                url = 'https://' + splitUrl.join('/');
            }
            if (url) {
                return <a className="a-btn a-link" target="_blank" {...props} href={`${url}`} />;
            }
            return <p>{props.children}</p>;
        },
        pre: (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLPreElement> & React.HTMLAttributes<HTMLPreElement>) => {
            const childrenArray = React.Children.toArray(props.children);
            const codeElement = childrenArray.find(child => React.isValidElement(child) && child.type === 'code') as React.ReactElement<HTMLAttributes<HTMLElement>> | undefined;
            let language: string = 'unknown';

            // Determine the language from the `code` element's className

            if (codeElement?.props?.className) {
                const match = codeElement.props.className.match(/language-(\w+)/);
                if (match && match[1]) {
                    switch (match[1]) {
                        case 'js':
                            language = 'javascript';
                            break;
                        case 'ts':
                            language = 'typescript';
                            break;
                        case 'py':
                            language = 'python';
                            break;
                        default:
                            language = match[1];
                            break;
                    }
                }
            }

            function copyCode() {
                const textToCopy = codeElement?.props.children?.toString();
                const copyButtonElement = document.querySelector('#copyButton');
                if (textToCopy) {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        // Modern API
                        return navigator.clipboard
                            .writeText(textToCopy)
                            .then(() => {
                                if (copyButtonElement) {
                                    const previousInnerHTML = copyButtonElement.innerHTML;

                                    copyButtonElement.innerHTML = `
                                        <a role="button"
                                            className="a-button subheading-tiny"
                                            id="copyButton"
                                        >
                                            <svg class="mb-1" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" id="copyIcon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                <path fill="none" d="M0 0h24v24H0V0z"></path>
                                                <path d="m18 7-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z"></path>
                                            </svg>
                                            Copied
                                        </a>
                                    `;
                                    setTimeout(() => {
                                        copyButtonElement.innerHTML = previousInnerHTML;
                                    }, 2000);
                                }
                            })
                            .catch(() => {
                                if (copyButtonElement) {
                                    const previousInnerHTML = copyButtonElement.innerHTML;

                                    copyButtonElement.innerHTML = `
                                        <a role="button"
                                            className="a-button subheading-tiny"
                                            id="copyButton"
                                        >
                                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" id="copyIcon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                <path fill="none" d="M0 0h24v24H0z"></path>
                                                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                                            </svg>
                                            Failed
                                        </a>
                                    `;
                                    setTimeout(() => {
                                        copyButtonElement.innerHTML = previousInnerHTML;
                                    }, 2000);
                                }
                            });
                    }
                }
            }

            const highlightedCode = Prism.highlight(codeElement?.props.children?.toString() || '', Prism.languages[language] || Prism.languages.markup, language);
            return (
                <div className="codeblock">
                    <div className="codeblock__head">
                        <div>{language !== 'unknown' && <p style={{ userSelect: 'none' }}>{language}</p>}</div>
                        <a
                            role="button"
                            className="a-button subheading-tiny"
                            id="copyButton"
                            onClick={() => {
                                copyCode();
                            }}>
                            <MdContentCopy id="copyIcon" /> Copy code
                        </a>
                    </div>

                    <pre {...props}>
                        <code className={codeElement?.props.className} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                    </pre>
                </div>
            );
        },
        ...components,
    };
}
