'use client';
import {notFound, redirect, useRouter} from 'next/navigation';

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

import {ChangeEvent, FC, FormEvent, useEffect, useRef, useState} from 'react';

import PostCard from '@/components/PostCard';
import {AuthorItem, PostItem, PostPreviewItem} from '@/types';

import {createPost, formatPostDate, saveMDXContent} from '@/lib/posts';
import React from 'react';
import moment from 'moment';

interface EditorProps {
    markdown: string;
    slug?: string;
    postsData?: PostItem[];
    authorData: AuthorItem[];
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Editor: FC<EditorProps> = ({
    markdown,
    slug,
    postsData,
    authorData,
    editorRef,
}) => {
    const [currentMarkdown, setCurrentMarkdown] = useState(markdown); // Track current markdown
    if (postsData && !slug) {
        return (
            <p>EditorComponent error: pass the postsData to the component</p>
        );
    }
    const postData = postsData?.find(post => post.slug === slug) || undefined;

    const [selectedAuthor, setSelectedAuthor] = useState(
        postData
            ? authorData.find(author => author.email === postData.email)
            : authorData[0]
    );

    if (slug && !postData) {
        return (
            <>
                <h5>
                    The post with this identifier does not exist on the
                    database.
                </h5>
                <p>Check the slug in URL for any spelling mistakes.</p>
            </>
        );
    }

    const [postTitle, setPostTitle] = useState(postData ? postData.title : '');
    const [description, setDescription] = useState(
        postData ? postData.description : ''
    );
    const [imageUrl, setImageUrl] = useState(
        postData ? postData.imageUrl : '/img/AWS-beginning.png'
    );

    const Post: PostItem = {
        email: selectedAuthor?.email || authorData[0].email,
        slug: slug ? slug : '',
        title: postTitle,
        description: description,
        date: moment(postData?.date).format('DD-MM-YYYY'),
        modifyDate: moment(Date.now()).format('DD-MM-YYYY'),
        imageUrl: imageUrl,
        readTime: postData?.readTime || 0,
        viewsCount: postData?.viewsCount || 0,
    };
    console.log(moment(postData?.date).format('DD-MM-YYYY'));

    const PostPreview: PostPreviewItem = {
        title: postTitle,
        description: description,
        imageUrl: imageUrl as string,
        date: postData?.date || moment(Date.now()).format('DD-MM-YYYY'),
        modifyDate:
            moment(
                formatPostDate(moment(postData?.modifyDate).toDate()),
                'DD-MM-YYYY'
            ).format('DD-MM-YYYY') || moment(Date.now()).format('DD-MM-YYYY'),
        readTime: postData?.readTime || 0,
        authorData: (selectedAuthor as AuthorItem) || authorData[0],
    };

    const router = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAuthorEmail = event.target.value;
        const author = authorData.find(
            a => a.email === selectedAuthorEmail
        ) as AuthorItem;
        setSelectedAuthor(author); // Update the state with the selected author
    };

    const handlePostTitleChange = (e: string) => {
        setPostTitle(e);
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
                        placeholder={slug ? slug : 'Enter the post title'}
                        onChange={e => handlePostTitleChange(e.target.value)}
                        value={postTitle}
                    />
                    <div className="d-flex justify-content-center gap-1">
                        <select
                            className="form-select preview-author-select p-0 px-2"
                            aria-label="Default select example"
                            value={selectedAuthor?.email}
                            disabled={slug ? true : false}
                            onChange={handleChange}>
                            {authorData.map(author => (
                                <option
                                    key={author.email}
                                    value={author.email}
                                    className="w-auto p-0 m-0 text-center">
                                    {author.fullName}
                                </option>
                            ))}
                        </select>
                        <p className="m-0 align-content-center">•</p>

                        <p className="m-0 align-content-center">
                            {postData
                                ? moment(postData.date, 'DD-MM-YYYY').format(
                                      'D MMM YYYY'
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
                        <PostCard
                            post={Post}
                            previewData={PostPreview}
                            authorData={selectedAuthor || authorData[0]}
                            style="preview"
                            setValue={setDescription}
                        />
                    </div>

                    <div className="col-12 d-flex container justify-content-center py-4">
                        <button
                            onClick={handleSave}
                            className="py-2 px-3 m-3 btn-filled"
                            type="submit">
                            {postData ? 'Update' : 'Post'}
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
