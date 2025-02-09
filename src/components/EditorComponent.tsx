'use client';
import { notFound, redirect, useRouter } from 'next/navigation';

import { headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, markdownShortcutPlugin, codeMirrorPlugin, linkDialogPlugin, imagePlugin, sandpackPlugin, tablePlugin, diffSourcePlugin, MDXEditor, type MDXEditorMethods, type MDXEditorProps, ConditionalContents, codeBlockPlugin, linkPlugin, ListsToggle } from '@mdxeditor/editor';

/* MDXEditor toolbar components */
import { toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles, BlockTypeSelect, ChangeCodeMirrorLanguage, CodeToggle, CreateLink, InsertCodeBlock, InsertImage, InsertTable, Separator, InsertThematicBreak, DiffSourceToggleWrapper } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react';

import { AuthorItem, PostItem, PostPreviewItem, TagItem } from '@/types';

import { createPost, formatPostDate, saveMDXContent, updatePost } from '@/lib/posts';
import React from 'react';
import moment from 'moment';
import dynamic from 'next/dynamic';

const PostCard = dynamic(() => import('@/components/PostCard/PostCard'), { ssr: false });

interface EditorProps {
    markdown: string;
    slug?: string;
    postData?: PostItem;
    authorData: AuthorItem[];
    tagsData: TagItem[];
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Editor: FC<EditorProps> = ({ markdown, slug, postData, authorData, tagsData, editorRef }) => {
    const [currentMarkdown, setCurrentMarkdown] = useState(markdown); // Track current markdown
    const [selectedAuthor, setSelectedAuthor] = useState(postData ? authorData.find(author => author.email === postData.email) : authorData.find(author => author.authorKey === 'ivanyalovets') || authorData[0]);
    const [postTitle, setPostTitle] = useState(postData ? postData.title : '');
    const [description, setDescription] = useState(postData ? postData.description : '');
    const [postType, setPostType] = useState<string>('Article');
    const [readTime, setReadTime] = useState<number>(0);
    const [tags, setTags] = useState<string[]>([]);

    const [isSponsored, setIsSponsored] = useState<boolean>(false);
    const [sponsoredBy, setSponsoredBy] = useState<string | undefined>(undefined);
    const [sponsorUrl, setSponsorUrl] = useState<string | undefined>(undefined);

    const [imageUrl, setImageUrl] = useState(postData ? postData.imageUrl : '/img/AWS-beginning.png');

    const format = 'YYYY-MM-DD';

    // Determine postData and set states conditionally inside useEffect
    useEffect(() => {
        if (postData && slug) {
            if (postData) {
                setPostTitle(postData.title);
                setDescription(postData.description);
                setImageUrl(postData.imageUrl || '/img/AWS-beginning.png');
                setSelectedAuthor(authorData.find(author => author.email === postData.email) || authorData[0]);

                if (postData.postType) {
                    setPostType(postData.postType);
                }

                if (postData.readTime && postData.readTime > 0) {
                    setReadTime(postData.readTime);
                }

                if (postData.tags && postData.tags?.length > 0) {
                    setTags(postData.tags);
                }

                if (postData.sponsoredBy) {
                    setIsSponsored(true);
                    setSponsoredBy(postData.sponsoredBy)
                }

                if (postData.sponsorUrl) {
                    setIsSponsored(true);
                    setSponsorUrl(postData.sponsorUrl)
                }
            }
        }
    }, [slug, postData, authorData]);

    if (postData?.date === 'Invalid date') {
        postData.date = moment.utc().toISOString();
    }

    const Post: PostItem = {
        email: selectedAuthor?.email || authorData[0].email,
        slug: slug ? slug : '',
        title: postTitle,
        description,
        date: postData?.date || moment.utc().toISOString(),
        modifyDate: moment.utc().toISOString(),
        imageUrl,
        tags: tags || [],
        postType,
        readTime,
        viewsCount: postData?.viewsCount || 0,
        postGroup: 'ALL_POSTS',
        sponsoredBy,
        sponsorUrl,
    };

    const PostPreview: PostPreviewItem = {
        title: postTitle,
        description,
        imageUrl: imageUrl as string,
        date: postData?.date || moment(Date.now()).format(format),
        modifyDate: moment(formatPostDate(moment(postData?.modifyDate).toDate()), format).format(format) || moment(Date.now()).format(format),
        postType: postData?.postType || 'Article',
        readTime,
        authorData: (selectedAuthor as AuthorItem) || authorData[0],
    };

    const router = useRouter();

    function calculateReadingTime(markdown: string, avgReadingSpeed = 1200): number {
        // Remove spaces and special characters, keep only letters
        const cleanedText = markdown.replace(/[^a-zA-Z]/g, '');

        // Count the number of letters
        const letterCount = cleanedText.length;

        // Calculate reading time in minutes
        const readingTime = letterCount / avgReadingSpeed;

        // Return rounded value
        setReadTime(Math.ceil(readingTime));
        return Math.ceil(readingTime);
    }

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAuthorEmail = event.target.value;
        const author = authorData.find(a => a.email === selectedAuthorEmail) as AuthorItem;
        setSelectedAuthor(author); // Update the state with the selected author
    };

    const handlePostTitleChange = (e: string) => {
        setPostTitle(e);
    };

    const handleTagAdd = (tagSlug: string) => {
        let _tags = [...tags];

        _tags.push(tagSlug);

        setTags(_tags);
    };

    const handleTagRemove = (tagSlug: string) => {
        const updatedTags = tags.filter(tag => tag !== tagSlug);

        setTags(updatedTags);
    };

    const handleSave = async () => {
        if (slug) {
            console.log(Post);
            
            const { markdown, slug } = await updatePost(Post, currentMarkdown);
    
            if (markdown && slug) {
                window.open(`/${slug}`, '_blank', 'noopener,noreferrer');
                setTimeout(() => {
                    return router.push(`/admin/posts`);
                }, 12000);
            }
        } else {
            console.log(Post);
            
            const { markdown, slug } = await createPost(Post, currentMarkdown);
    
            if (markdown && slug) {
                window.open(`/${slug}`, '_blank', 'noopener,noreferrer');
                setTimeout(() => {
                    return router.push(`/admin/posts`);
                }, 12000);
            }
        }
    };

    const handleCancel = () => {
        router.push('/admin/posts');
    };

    if (!selectedAuthor) return null;

    return (
        <div>
            <div className="container col-md-9 mt-5">
                <div className="text-center pt-4">
                    <textarea className="heading-xlarge w-100 col-md-11 col-lg-12 text-center align-content-center" id="col-heading-1" disabled={slug ? true : false} placeholder={slug ? slug : 'Enter the post title'} onChange={e => handlePostTitleChange(e.target.value)} value={postTitle} />
                    <div className="d-flex justify-content-center gap-1">
                        <select className="form-select preview-author-select p-0 px-2" aria-label="Select author" value={selectedAuthor?.email} disabled={slug ? true : false} onChange={handleChange}>
                            {authorData.map(author => (
                                <option key={author.email} value={author.email} className="w-auto p-0 m-0 text-center">
                                    {author.fullName}
                                </option>
                            ))}
                        </select>
                        <p className="m-0">•</p>

                        <div className="d-flex justify-content-center gap-2">
                            <p className="m-0">{postData ? moment(postData.date, format).format('D MMM YYYY') : moment(Date.now()).format('DD MMM YYYY')}</p>

                            {moment(postData?.modifyDate, format).isAfter(moment(postData?.date, format)) && (
                                <>
                                    <p className="d-none d-md-block m-0">•</p>
                                    <span className="d-none d-md-block px-2 m-0 rounded-pill text-bg-secondary">{'Updated ' + moment(postData?.modifyDate, format).fromNow()}</span>
                                </>
                            )}
                        </div>
                    </div>
                    {moment(postData?.modifyDate, format).isAfter(moment(postData?.date, format)) && (
                        <>
                            <span className="d-md-none px-2 m-0 rounded-pill text-bg-secondary" id="mobileUpdatedBadge">
                                {'Updated ' + moment(postData?.modifyDate, format).fromNow()}
                            </span>
                        </>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="col-md-8 offset-md-2 container">
                    <MDXEditor
                        contentEditableClassName="article"
                        onChange={e => {
                            setCurrentMarkdown(e); // Update current markdown when the editor content changes
                            calculateReadingTime(e); // Update read time in real time when the editor content changes
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
                                defaultCodeBlockLanguage: '',
                            }),
                            codeMirrorPlugin({
                                codeBlockLanguages: {
                                    '': 'None',
                                    js: 'JavaScript',
                                    ts: 'TypeScript',
                                    jsx: 'JSX',
                                    tsx: 'TSX',
                                    html: 'HTML',
                                    css: 'CSS',
                                    py: 'Python',
                                    php: 'PHP',
                                    sh: 'Shell',
                                    bash: 'Bash',
                                    ps1: 'PowerShell',
                                    dockerfile: 'Dockerfile',
                                    terraform: 'Terraform',
                                    sql: 'SQL',
                                    json: 'JSON',
                                    yaml: 'YAML',
                                },
                            }),
                            linkPlugin(),
                            linkDialogPlugin(),
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
                                        <DiffSourceToggleWrapper>
                                            <ConditionalContents
                                                options={[
                                                    {
                                                        when: editor => editor?.editorType === 'codeblock',
                                                        contents: () => <ChangeCodeMirrorLanguage />,
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
                                                            </>
                                                        ),
                                                    },
                                                ]}
                                            />
                                        </DiffSourceToggleWrapper>
                                    </>
                                ),
                            }),
                        ]}
                    />
                </div>
            </div>
            <div className="container d-flex justify-content-center col-md-9" style={{ marginTop: '40rem' }}>
                <div className="row">
                    <div className="container">
                        <h1 className="text-center py-3">Preview</h1>
                        <PostCard post={Post} previewData={PostPreview} authorData={selectedAuthor || authorData[0]} style="preview" setValue={setDescription} />
                    </div>
                </div>
            </div>
            <div className="container d-flex justify-content-center col-md-9 my-5">
                <div className="row">
                    <div className="container col-12">
                        <h1 className="text-center py-3">Sponsorship</h1>

                        <li className="list-group-item py-2 py-lg-1">
                            <input
                                className="form-check-input me-2"
                                type="checkbox"
                                name="listGroupRadio"
                                checked={isSponsored}
                                onChange={e => setIsSponsored(e.target.checked)}
                            />
                            <label className="form-check-label">
                                Is Sponsored
                            </label>
                        </li>

                        {isSponsored && (
                            <>
                                <div>
                                    <label htmlFor="" className='mx-3'>Enter sponsor company name</label>
                                    <input type="text" placeholder='Coffeeman Corporation' value={sponsoredBy} onChange={e => setSponsoredBy(e.target.value)} />
                                </div>
                                <div className='mt-3'>
                                    <label htmlFor="" className='mx-3'>Enter company's website URL (optional)</label>
                                    <input type="text" placeholder='www.yalovets.blog/' value={sponsorUrl} onChange={e => setSponsorUrl(e.target.value)} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="container d-flex justify-content-center col-md-9 my-5">
                <div className="row">
                    <div className="container">
                        <h1 className="text-center py-3">Tags</h1>

                        <select className="form-select preview-tags-select py-1 px-2" value={''} aria-label="Select tag" onChange={e => handleTagAdd(e.target.value)}>
                            <option key={0} value={''} className="w-auto p-0 m-0 text-center">
                                Add tag
                            </option>
                            {tagsData.length > 0 &&
                                tagsData.map(tag => (
                                    <option key={tag.id} value={tag.tag} className="w-auto p-0 m-0 text-center" disabled={tags.includes(tag.tag)}>
                                        {tag.tag}
                                    </option>
                                ))}
                        </select>

                        <div className="row d-flex">
                            {tags?.map(tag => (
                                <div className="d-flex col-6 align-items-center justify-content-center gap-3 bg-grey">
                                    <h3>{tag}</h3>
                                    <div>
                                        <button className="btn-outlined py-1" onClick={() => handleTagRemove(tag)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-12 d-flex container justify-content-center py-4">
                        <button onClick={handleSave} className="py-2 px-3 m-3 btn-filled" type="submit">
                            {postData ? 'Update' : 'Post'}
                        </button>
                        <button onClick={handleCancel} className="py-2 px-3 m-3 btn-outlined">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
