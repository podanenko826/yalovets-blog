'use client';
import {redirect, useRouter} from 'next/navigation';

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

import {ChangeEvent, FC, FormEvent, Suspense, useRef, useState} from 'react';

import PostCard from '@/components/PostCard';
import {AuthorItem, PostItem} from '@/types';

import {createPost} from '@/lib/posts';
import React from 'react';
import moment from 'moment';
import {getUsers} from '@/lib/users';

interface EditorProps {
    markdown: string;
    slug?: string;
    postData?: PostItem;
    authorData: AuthorItem[];
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Editor: FC<EditorProps> = ({
    markdown,
    slug,
    postData,
    authorData,
    editorRef,
}) => {
    const [selectedAuthor, setSelectedAuthor] = useState<AuthorItem>(
        authorData.find(
            author => author.email === postData?.email
        ) as AuthorItem
    );
    const [currentMarkdown, setCurrentMarkdown] = useState(markdown); // Track current markdown
    const [postTitle, setPostTitle] = useState(postData ? postData.title : '');
    const [description, setDescription] = useState(
        postData ? postData.description : 'A Test Description'
    );
    const [imageUrl, setImageUrl] = useState(
        postData ? postData.imageUrl : '/img/AWS-beginning.png'
    );

    const Post: PostItem = {
        email: selectedAuthor?.email || '',
        slug: slug ? slug : '',
        title: postTitle,
        description: description,
        imageUrl: imageUrl,
    };

    const router = useRouter();

    const handlePostTitleChange = (e: string) => {
        setPostTitle(e);
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAuthorEmail = event.target.value;
        const author = authorData.find(
            a => a.email === selectedAuthorEmail
        ) as AuthorItem;
        setSelectedAuthor(author); // Update the state with the selected author
    };

    const handleSave = async () => {
        if (slug) {
            const redirectSlug = await createPost(Post, currentMarkdown);
            return router.push(`/${redirectSlug}`);
        } else {
            const redirectSlug = await createPost(Post, currentMarkdown);
            return router.push(`/${redirectSlug}`);
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
                        disabled={slug ? true : false}
                        placeholder={
                            postData ? postData.title : 'Enter the post title'
                        }
                        onChange={e => handlePostTitleChange(e.target.value)}
                        value={postTitle}
                    />
                    <div className="d-flex justify-content-center align-items-center gap-2 mr-5">
                        <select
                            className="form-select preview-author-select"
                            aria-label="Default select example"
                            onChange={handleChange}>
                            {authorData.map(author => (
                                <option
                                    key={author.email}
                                    value={author.email}
                                    selected={
                                        author.email === selectedAuthor.email
                                    }>
                                    {author.fullName}
                                </option>
                            ))}
                        </select>
                        <p className="m-0">
                            {postData
                                ? moment(postData.date, 'DD-MM-YYYY').format(
                                      'DD MMM YYYY'
                                  )
                                : moment(Date.now()).format('DD MMM YYYY')}
                        </p>
                    </div>
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
                                    jsx: 'JSX',
                                    tsx: 'TSX',
                                    html: 'HTML',
                                    css: 'CSS',
                                    py: 'Python',
                                    bash: 'Bash',
                                    sql: 'SQL',
                                    json: 'JSON',
                                    yaml: 'YAML',
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
                                                            <DiffSourceToggleWrapper>
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
                                                                <Separator />
                                                            </DiffSourceToggleWrapper>
                                                        </>
                                                    ),
                                                },
                                            ]}
                                        />
                                    </>
                                ),
                            }),
                        ]}
                    />
                </div>
            </div>
            <div
                className="container d-flex justify-content-center col-md-9"
                style={{marginTop: '40rem'}}>
                <div className="row">
                    <div className="container">
                        <h1 className="text-center py-3">Preview</h1>
                        <Suspense fallback={<p>Loading preview...</p>}>
                            <PostCard
                                post={Post}
                                authorData={selectedAuthor}
                                style="preview"
                                description={description}
                                onDescriptionChange={setDescription}
                            />
                        </Suspense>
                    </div>

                    <div className="col-12 d-flex container justify-content-center py-4">
                        <button
                            onClick={handleSave}
                            className="py-2 px-3 m-3 btn-filled"
                            type="submit">
                            Post
                        </button>
                        <button
                            onClick={handleCancel}
                            className="py-2 px-3 m-3 btn-outlined">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
