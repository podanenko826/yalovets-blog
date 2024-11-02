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
    frontmatterPlugin,
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    directiveDescriptors$,
    AdmonitionDirectiveDescriptor,
    ConditionalContents,
    ShowSandpackInfo,
    codeBlockPlugin,
    linkPlugin,
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
    InsertSandpack,
    InsertTable,
    Separator,
    InsertThematicBreak,
    DiffSourceToggleWrapper,
    InsertFrontmatter,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import {ChangeEvent, FC, FormEvent, useState} from 'react';

interface EditorProps {
    markdown: string;
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Editor: FC<EditorProps> = ({markdown, editorRef}) => {
    const [content, setContent] = useState('');
    const [postTitle, setPostTitle] = useState('');

    const router = useRouter();

    const handleMDXEditorChange = (e: string) => {
        setContent(e);
        console.log(content);
    };

    const handlePostTitleChange = (e: string) => {
        setPostTitle(e);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const handleCancel = () => {
        router.push('/admin');
    };

    return (
        <div>
            <div className="container col-md-9 mt-5">
                <div className="text-center pt-4">
                    <textarea
                        className="heading-xlarge w-100 h-auto col-md-11 col-lg-12 text-center align-content-center"
                        id="col-heading-1"
                        placeholder="Enter the post title"
                        onChange={e => handlePostTitleChange(e.target.value)}
                        value={postTitle}
                    />
                    <p>Ivan Yalovets • 2 Nov 2024</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8 offset-md-2 container">
                    <MDXEditor
                        onChange={e => handleMDXEditorChange(e)}
                        ref={editorRef}
                        markdown={markdown}
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
                            sandpackPlugin(),
                            tablePlugin(),
                            diffSourcePlugin(),
                            frontmatterPlugin(),
                            toolbarPlugin({
                                toolbarClassName: 'mdxeditor-toolbar',
                                toolbarContents: () => (
                                    <>
                                        {' '}
                                        <UndoRedo />
                                        <Separator />
                                        <BoldItalicUnderlineToggles />
                                        <CodeToggle />
                                        <Separator />
                                        {/* <ChangeAdmonitionType /> */}
                                        {/* <ChangeCodeMirrorLanguage /> */}
                                        <BlockTypeSelect />
                                        <Separator />
                                        <CreateLink />
                                        <InsertImage />
                                        <Separator />
                                        <InsertTable />
                                        <InsertThematicBreak />
                                        <Separator />
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
                                                    when: editor =>
                                                        editor?.editorType ===
                                                        'sandpack',
                                                    contents: () => (
                                                        <ShowSandpackInfo />
                                                    ),
                                                },
                                                {
                                                    fallback: () => (
                                                        <InsertCodeBlock />
                                                    ),
                                                },
                                            ]}
                                        />
                                        {/* <InsertSandpack /> */}
                                        <Separator />
                                        <InsertAdmonition />
                                        <Separator />
                                        <InsertFrontmatter />
                                        <DiffSourceToggleWrapper children />
                                    </>
                                ),
                            }),
                        ]}
                    />
                </div>
            </div>
            <div className="container d-flex justify-content-end col-md-9 mt-5">
                <div className="row">
                    <div className="col-12 container">
                        <button
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
