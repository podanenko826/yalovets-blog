'use client';
import {useRouter} from 'next/navigation';

import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    codeMirrorPlugin,
    linkDialogPlugin,
    directivesPlugin,
    imagePlugin,
    sandpackPlugin,
    tablePlugin,
    diffSourcePlugin,
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    AdmonitionDirectiveDescriptor,
    ConditionalContents,
    codeBlockPlugin,
    linkPlugin,
    ListsToggle,
} from '@mdxeditor/editor';

/* MDXEditor toolbar components */
import {
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    ChangeAdmonitionType,
    ChangeCodeMirrorLanguage,
    CodeToggle,
    CreateLink,
    InsertAdmonition,
    InsertCodeBlock,
    InsertImage,
    InsertTable,
    Separator,
    InsertThematicBreak,
    DiffSourceToggleWrapper,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import {ChangeEvent, FC, FormEvent, useRef, useState} from 'react';

import {postMDXContent} from '@/lib/articles';
import React from 'react';

interface EditorProps {
    markdown: string;
    slug?: string;
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Editor: FC<EditorProps> = ({markdown, slug, editorRef}) => {
    const [currentMarkdown, setCurrentMarkdown] = useState(markdown); // Track current markdown
    const [content, setContent] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const router = useRouter();

    const handlePostTitleChange = (e: string) => {
        setPostTitle(e);
    };

    const handleSave = async () => {
        let fileName: string;

        if (slug) {
            fileName = `${slug}.mdx`;
        } else {
            fileName = `${postTitle
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .replaceAll(' ', '-')
                .toLowerCase()}.mdx`;
        } // Specify the filename
        const content = currentMarkdown;

        try {
            const response = await fetch('/api/save-mdx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({fileName, content}),
            });

            if (!response.ok) {
                throw new Error('Failed to save file');
            }

            const data = await response.text();
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCancel = () => {
        router.push('/admin');
    };

    return (
        <div>
            <div className="container col-md-9 mt-5">
                <div className="text-center pt-4">
                    <textarea
                        className="heading-xlarge w-100 col-md-11 col-lg-12 text-center align-content-center"
                        id="col-heading-1"
                        placeholder={slug ? slug : 'Enter the post title'}
                        onChange={e => handlePostTitleChange(e.target.value)}
                        value={postTitle}
                    />
                    <p>Ivan Yalovets • 2 Nov 2024</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8 offset-md-2 container">
                    <MDXEditor
                        onChange={e => {
                            setCurrentMarkdown(e); // Update current markdown when the editor content changes
                        }}
                        ref={editorRef}
                        markdown={currentMarkdown}
                        plugins={[
                            // Example Plugin Usage
                            headingsPlugin(),
                            listsPlugin(),
                            quotePlugin(),
                            thematicBreakPlugin(),
                            markdownShortcutPlugin(),
                            codeBlockPlugin({
                                defaultCodeBlockLanguage: 'js',
                            }),
                            codeMirrorPlugin({
                                codeBlockLanguages: {
                                    js: 'JavaScript',
                                    ts: 'TypeScript',
                                    css: 'CSS',
                                },
                            }),
                            linkPlugin(),
                            linkDialogPlugin(),
                            directivesPlugin({
                                directiveDescriptors: [
                                    AdmonitionDirectiveDescriptor,
                                ],
                            }),
                            imagePlugin(),
                            sandpackPlugin({
                                sandpackConfig: {
                                    defaultPreset: '',
                                    presets: [],
                                },
                            }),
                            tablePlugin(),
                            diffSourcePlugin(),
                            toolbarPlugin({
                                toolbarClassName: 'mdxeditor-toolbar',
                                toolbarContents: () => (
                                    <>
                                        {' '}
                                        <ConditionalContents
                                            options={[
                                                {
                                                    when: editor =>
                                                        editor?.editorType ===
                                                        'codeblock',
                                                    contents: () => (
                                                        <ChangeCodeMirrorLanguage />
                                                    ),
                                                },
                                                {
                                                    fallback: () => (
                                                        <>
                                                            <UndoRedo />
                                                            <Separator />
                                                            <BoldItalicUnderlineToggles />
                                                            <CodeToggle />
                                                            <Separator />
                                                            <ListsToggle />
                                                            <Separator />
                                                            <BlockTypeSelect />
                                                            <Separator />
                                                            <CreateLink />
                                                            <InsertImage />
                                                            <Separator />
                                                            <InsertTable />
                                                            <InsertThematicBreak />
                                                            <Separator />
                                                            <InsertCodeBlock />
                                                            <Separator />
                                                            <InsertAdmonition />
                                                        </>
                                                    ),
                                                },
                                            ]}
                                        />
                                        <DiffSourceToggleWrapper children />
                                    </>
                                ),
                            }),
                        ]}
                    />
                </div>
            </div>
            <div className="container d-flex justify-content-center col-md-9 mt-5">
                <div className="row">
                    <div className="col-12 container">
                        <button
                            onClick={handleSave}
                            className="py-2 px-3 m-2 btn-filled"
                            type="submit">
                            Post
                        </button>
                        <button
                            onClick={handleCancel}
                            className="py-2 px-3 m-2 btn-outlined">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
