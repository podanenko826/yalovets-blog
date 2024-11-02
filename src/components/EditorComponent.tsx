'use client';

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
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
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
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import {FC, FormEvent, useState} from 'react';

interface EditorProps {
    markdown: string;
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Editor: FC<EditorProps> = ({markdown, editorRef}) => {
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('');
    const handleMDXEditorChange = (e: string) => {
        setContent(e);
        console.log(content);
    };

    const handleFileNameChange = (e: string) => {
        setFileName(e);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
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
                        codeMirrorPlugin(),
                        linkDialogPlugin(),
                        directivesPlugin(),
                        imagePlugin(),
                        sandpackPlugin(),
                        tablePlugin(),
                        toolbarPlugin({
                            toolbarClassName: 'mdxeditor-toolbar',
                            toolbarContents: () => (
                                <>
                                    {' '}
                                    <UndoRedo />
                                    <BoldItalicUnderlineToggles />
                                    <BlockTypeSelect />
                                    {/* <ChangeAdmonitionType  /> */}
                                    {/* <ChangeCodeMirrorLanguage /> */}
                                    <CodeToggle />
                                    <CreateLink />
                                    {/* <InsertAdmonition /> */}
                                    <InsertCodeBlock />
                                    <InsertImage />
                                    {/* <InsertSandpack /> */}
                                    <InsertTable />
                                </>
                            ),
                        }),
                    ]}
                />
                <div className="d-flex align-items-center">
                    <div>
                        <button className="p-2 m-2" type="submit">
                            Save
                        </button>
                        <button className="p-2 m-2">Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Editor;
