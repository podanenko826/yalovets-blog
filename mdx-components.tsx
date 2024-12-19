import LazyImage from '@/components/LazyImage';
import type { MDXComponents } from 'mdx/types';
import { ImageProps } from 'next/image';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import hljsDefineTerraform from '@/lib/terraform';

hljs.registerLanguage('terraform', hljsDefineTerraform);

import React, { HTMLAttributes, JSXElementConstructor, ReactElement, useRef } from 'react';

import { MdContentCopy, MdOutlineDoneAll, MdClear } from 'react-icons/md';

export function useMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        table: (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableElement> & React.TableHTMLAttributes<HTMLTableElement>) => (
            <div className="container">
                <div className="row overflow-scroll">
                    <div className="col-12 p-0">
                        <table className="table" {...props} />
                    </div>
                </div>
            </div>
        ),
        td: (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableDataCellElement> & React.TdHTMLAttributes<HTMLTableDataCellElement>) => <td className="col-1" {...props} />,
        li: (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLLIElement> & React.LiHTMLAttributes<HTMLLIElement>) => {
            const isEmpty = !props.children || (typeof props.children === 'string' && props.children.trim() === '');
            return <li className={isEmpty ? 'd-none' : ''} {...props} />;
        },
        a: (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLAnchorElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
            const href = props.href;

            if (!href) {
                return <p>{props.children}</p>; // Return paragraph if no href is provided
            }

            // Ensure the URL starts with `http` or `https`
            const splitUrl = href.split('/');
            let url = href;
            if (!href.startsWith('http://') && !href.startsWith('https://')) {
                url = `https://${href}`;
            }

            // Detect "example" or "localhost" in the URL
            if (splitUrl.some(part => part.includes('example') || part.includes('local') || part.includes('127.0') || part.includes('0.0.0.0') || part.includes('192.168') || part.includes('10.0'))) {
                return <p>{props.children}</p>;
            }

            // Return the anchor with processed URL
            return <a className="a-btn a-link" target="_blank" {...props} href={url} />;
        },
        pre: (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLPreElement> & React.HTMLAttributes<HTMLPreElement>) => {
            const childrenArray = React.Children.toArray(props.children);
            const codeElement = useRef<ReactElement<HTMLAttributes<HTMLElement>, string | JSXElementConstructor<any>> | undefined>();
            const uniqueId = `copyButton-${Math.random().toString(36).substr(2, 9)}`;

            codeElement.current = childrenArray.find(child => React.isValidElement(child) && child.type === 'code') as React.ReactElement<HTMLAttributes<HTMLElement>> | undefined;
            let language: string = '';

            // Determine the language from the `code` element's className

            if (codeElement?.current!.props?.className) {
                const match = codeElement.current!.props.className.match(/language-(\w+)/);
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

            function copyCode(id: string) {
                const textToCopy = codeElement?.current!.props.children?.toString();
                const copyButtonElement = document.getElementById(id);

                if (!textToCopy || !copyButtonElement) {
                    return;
                }

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard
                        .writeText(textToCopy)
                        .then(() => {
                            injectHTML(copyButtonElement, 'Copied', 'success');
                        })
                        .catch(() => {
                            injectHTML(copyButtonElement, 'Failed', 'error');
                        });
                } else {
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    textarea.setAttribute('readonly', ''); // Make it readonly to prevent keyboard popping up
                    textarea.style.position = 'absolute';
                    textarea.style.left = '-9999px'; // Move it off-screen
                    textarea.style.top = '0'; // Ensure it's within the viewport but off-screen
                    document.body.appendChild(textarea);

                    const selection = document.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(textarea);
                    selection?.removeAllRanges();
                    selection?.addRange(range);

                    try {
                        document.execCommand('copy'); // Perform the copy operation
                        injectHTML(copyButtonElement, 'Copied', 'success');
                    } catch (err) {
                        injectHTML(copyButtonElement, 'Failed', 'error');
                    }

                    selection?.removeAllRanges(); // Cleanup selection
                    document.body.removeChild(textarea);
                }
            }

            function injectHTML(element: HTMLElement, text: string, status: 'success' | 'error') {
                if (status === 'success') {
                    const previousInnerHTML = element.innerHTML;
                    element.innerHTML = `
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" id="copyIcon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" d="M0 0h24v24H0V0z"></path>
                                <path d="m18 7-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z"></path>
                            </svg>
                            Copied
                    `;
                    setTimeout(() => {
                        element.innerHTML = previousInnerHTML;
                    }, 2000);
                } else if (status === 'error') {
                    const previousInnerHTML = element.innerHTML;
                    element.innerHTML = `
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" id="copyIcon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                            </svg>
                            Failed
                    `;
                    setTimeout(() => {
                        element.innerHTML = previousInnerHTML;
                    }, 2000);
                }
            }

            let highlightedCode: string;
            if (language !== '') {
                highlightedCode = hljs.highlight(codeElement?.current!.props.children?.toString() || '', { language: language }).value;
            } else {
                highlightedCode = codeElement.current?.props.children?.toString() || '';
            }

            return (
                <div className="codeblock">
                    <div className="row m-0">
                        <div className="codeblock__head">
                            <div>{language !== '' && <p style={{ userSelect: 'none' }}>{language}</p>}</div>
                            <div className="copyCode">
                                <a
                                    role="button"
                                    className="a-button subheading-xxsmall copyCodeButton"
                                    id={uniqueId}
                                    onClick={() => {
                                        copyCode(uniqueId);
                                    }}>
                                    <MdContentCopy id="copyIcon" /> Copy code
                                </a>
                            </div>
                        </div>
                    </div>

                    <pre {...props}>
                        <code className={codeElement?.current!.props.className} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                    </pre>
                </div>
            );
        },
        blockquote: (props: React.DetailedHTMLProps<React.BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>) => {
            const isEmpty = !props.children || (typeof props.children === 'string' && props.children.trim() === '');

            return (
                <blockquote className={`${isEmpty ? 'd-none' : ''} quote`}>
                    <div className="quote-separator"></div>
                    {props.children}
                </blockquote>
            );
        },
        ...components,
    };
}
