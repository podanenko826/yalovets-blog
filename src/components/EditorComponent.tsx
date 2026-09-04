'use client';
import { useRouter } from 'next/navigation';

import { headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, markdownShortcutPlugin, codeMirrorPlugin, linkDialogPlugin, imagePlugin, sandpackPlugin, tablePlugin, diffSourcePlugin, MDXEditor, type MDXEditorMethods, ConditionalContents, codeBlockPlugin, linkPlugin, ListsToggle, usePublisher, insertDirective$, DialogButton, directivesPlugin, GenericDirectiveEditor, DirectiveDescriptor, RealmPlugin, $createDirectiveNode, insertJsx$, GenericJsxEditor, jsxComponentDescriptors$, jsxPlugin, JsxComponentDescriptor, NestedLexicalEditor, StrikeThroughSupSubToggles } from '@mdxeditor/editor';

/* MDXEditor toolbar components */
import { toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles, BlockTypeSelect, ChangeCodeMirrorLanguage, CodeToggle, CreateLink, InsertCodeBlock, InsertImage, InsertTable, Separator, InsertThematicBreak, DiffSourceToggleWrapper } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import { FC, useEffect, useState } from 'react';

import { AuthorItem, PostItem, PostPreviewItem } from '@/types';

import { createPost, formatPostDate, updatePost } from '@/lib/posts';
import React from 'react';
import moment from 'moment';
import dynamic from 'next/dynamic';
import YouTubeEmbed, { YouTubeButton } from './mdx/YouTubeEmbed';
import { MdxJsxTextElement } from 'mdast-util-mdx-jsx';
import { CopyGenericJsxEditor } from './CopyGenericJsxEditor';
import { uploadImage } from '@/lib/images';
import LoadingSpinnerModal from './Modals/LoadingSpinnerModal';
import { sendEmailsOnPost } from '@/services/sendEmailsOnPost';

const PostCard = dynamic(() => import('@/components/PostCard/PostCard'), { ssr: false });

export interface EditorProps {
    markdown: string;
    slug?: string;
    postData?: PostItem;
    authorData: AuthorItem[];
    editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
    legalMdx?: 'privacy-policy' | 'imprint';
}

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
    {
        name: 'YouTubeEmbed',
        kind: 'flow',
        props: [
            { name: 'id', type: 'string', required: true },
        ],
        hasChildren: true,
        Editor: (props) => CopyGenericJsxEditor({ ...props, TargetNode: YouTubeEmbed }),
    },
]

const Editor: FC<EditorProps> = ({ markdown, slug, postData, authorData, editorRef, legalMdx }) => {
    const [currentMarkdown, setCurrentMarkdown] = useState(markdown); // Track current markdown
    const [selectedAuthor, setSelectedAuthor] = useState(postData ? authorData.find(author => author.id === postData.author_id) : authorData.find(author => author.handle === 'ivanyalovets') || authorData?.[0] || null);
    const [postTitle, setPostTitle] = useState(postData ? postData.title : '');
    const [description, setDescription] = useState(postData ? postData.description : '');
    const [post_type, setPostType] = useState<string>('Article');
    const [read_time, setReadTime] = useState<number>(0);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [isSponsored, setIsSponsored] = useState<boolean>(false);
    const [sponsored_by, setSponsoredBy] = useState<string | undefined>(undefined);
    const [sponsor_url, setSponsorUrl] = useState<string | undefined>(undefined);

    const [image_url, setImageUrl] = useState(postData ? postData.image_url : '');

    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

    const format = 'YYYY-MM-DD';

    // Determine postData and set states conditionally inside useEffect
    useEffect(() => {
        if (postData && slug) {
            if (postData) {
                setPostTitle(postData.title);
                setDescription(postData.description);
                setImageUrl(postData.image_url || '/ui/addpost.png');
                setSelectedAuthor(authorData.find(author => author.id === postData.author_id) || authorData?.[0] || null);

                if (postData.post_type) {
                    setPostType(postData.post_type);
                }

                if (postData.read_time && postData.read_time > 0) {
                    setReadTime(postData.read_time);
                }

                if (postData.sponsored_by) {
                    setIsSponsored(true);
                    setSponsoredBy(postData.sponsored_by)
                }

                if (postData.sponsor_url) {
                    setIsSponsored(true);
                    setSponsorUrl(postData.sponsor_url)
                }
            }
        }
    }, [slug, postData, authorData]);

    useEffect(() => {
        const uploadBannerImage = async () => {
            if (imageFile) {
                let date = moment.utc().toDate();

                if (postData?.created_at) {
                    date = moment(postData.created_at).toDate();
                }

                const year: string = date.getFullYear().toString();
                const month: string = String(date.getMonth() + 1).padStart(2, '0');

                const { filePath } = await uploadImage(imageFile, year, month, 540);

                if (filePath) {
                    setImageUrl(filePath);
                }
            }
        }

        uploadBannerImage();
    }, [imageFile, postData, postData?.created_at]);

    async function imageUploadHandler(image: File) {
        const newName = image.name.replace(/\s+/g, '');
        // Create a new File object with the modified name
        const newImage = new File([image], newName, { type: image.type, lastModified: image.lastModified });

        let date = moment.utc().toDate();

        if (postData?.created_at) {
            date = moment(postData.created_at).toDate();
        }

        const year: string = date.getFullYear().toString();
        const month: string = String(date.getMonth() + 1).padStart(2, '0');
        // send the file to your server and return
        // the URL of the uploaded image in the response
        const { filePath } = await uploadImage(newImage, year, month, 730);

        return filePath;
    }

    if (postData?.created_at === 'Invalid date') {
        postData.created_at = moment.utc().toISOString();
    }

    const Post: Partial<PostItem> = {
        id: postData?.id,
        author_id: selectedAuthor?.id || authorData?.[0]?.id || '',
        slug: slug ? slug : '',
        title: postTitle,
        description,
        created_at: postData?.created_at || moment.utc().toISOString(),
        updated_at: moment.utc().toISOString(),
        image_url,
        post_type,
        read_time,
        views_count: postData?.views_count || 0,
        sponsored_by,
        sponsor_url,
    };

    const PostPreview: Partial<PostPreviewItem> = {
        title: postTitle,
        description,
        image_url: image_url || '/ui/addpost.png',
        created_at: postData?.created_at || moment(Date.now()).format(format),
        updated_at: moment(formatPostDate(moment(postData?.updated_at).toDate()), format).format(format) || moment(Date.now()).format(format),
        post_type: post_type || 'Article',
        read_time,
        authorData: (selectedAuthor as AuthorItem) || authorData?.[0] || null,
        isSponsored,
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
        const selectedAuthorId = event.target.value;
        const author = authorData.find(a => a.id === selectedAuthorId) as AuthorItem;
        setSelectedAuthor(author); // Update the state with the selected author
    };

    const handlePostTitleChange = (e: string) => {
        setPostTitle(e);
    };

    const handleSave = async () => {
        if (!legalMdx && slug) {
            console.log(Post);

            const { markdown, slug } = await updatePost(Post, currentMarkdown);

            if (markdown && slug) {
                window.open(`/${slug}`, '_blank', 'noopener,noreferrer');
                setTimeout(() => {
                    return router.push(`/admin/posts`);
                }, 12000);
            }
        } else if (legalMdx) {
            const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' : '';

            const response = await fetch(`${baseUrl}/api/${legalMdx}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: currentMarkdown }),
            });

            if (response.ok) {
                window.open(`/${legalMdx}`, '_blank', 'noopener,noreferrer');
                setTimeout(() => {
                    return router.push(`/admin/posts`);
                }, 1000);
            }
        } else {
            console.log(Post);

            const { markdown, slug } = await createPost(Post, currentMarkdown, selectedAuthor?.email || '');

            setLoadingMessage('Sending emails on newsletter');

            const isSuccessfullySent = await sendEmailsOnPost(Post as PostItem);

            if (!isSuccessfullySent) {
                setLoadingMessage('Failed to send emails');
            }

            setTimeout(() => {
                setLoadingMessage(null);
            }, 1500)

            if (markdown && slug) {
                window.open(`/${slug}`, '_blank', 'noopener,noreferrer');
                setTimeout(() => {
                    return router.push(`/admin/posts`);
                }, 12000);
            }
        }
    };

    const handleCancel = () => {
        if (legalMdx) {
            router.push('/admin');
        } else {
            router.push('/admin/posts');
        }
    };

    if (!selectedAuthor) {
        if (!authorData || authorData.length === 0) {
            return (
                <div className="container mt-5 text-center">
                    <h3>No authors found</h3>
                    <p>Please create an author before creating a post.</p>
                </div>
            );
        }
        return (
            <div className="container mt-5 text-center">
                <h3>Loading editor...</h3>
            </div>
        );
    }

    return (
        <div>
            {loadingMessage !== null && <LoadingSpinnerModal message={loadingMessage} />}
            <div className="container col-md-9 mt-5">
                {!legalMdx ? (

                    <div className="text-center pt-4">
                        <textarea className="heading-xlarge w-100 col-md-11 col-lg-12 text-center align-content-center" id="col-heading-1" disabled={slug ? true : false} placeholder={slug ? slug : 'Enter the post title'} onChange={e => handlePostTitleChange(e.target.value)} value={postTitle} />
                        <div className="d-flex justify-content-center gap-1">
                            <select className="form-select preview-author-select p-0 px-2" aria-label="Select author" value={selectedAuthor?.id || ''} disabled={slug ? true : false} onChange={handleChange}>
                                {authorData.map(author => (
                                    <option key={author.id} value={author.id} className="w-auto p-0 m-0 text-center">
                                        {author.full_name}
                                    </option>
                                ))}
                            </select>
                            <p className="m-0">•</p>

                            <div className="d-flex justify-content-center gap-2">
                                <p className="m-0">{postData ? moment(postData.created_at, format).format('D MMM YYYY') : moment(Date.now()).format('DD MMM YYYY')}</p>

                                {moment(postData?.updated_at, format).isAfter(moment(postData?.created_at, format)) && (
                                    <>
                                        <p className="d-none d-md-block m-0">•</p>
                                        <span className="d-none d-md-block px-2 m-0 rounded-pill text-bg-secondary">{'Updated ' + moment(postData?.updated_at, format).fromNow()}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {moment(postData?.updated_at, format).isAfter(moment(postData?.created_at, format)) && (
                            <>
                                <span className="d-md-none px-2 m-0 rounded-pill text-bg-secondary" id="mobileUpdatedBadge">
                                    {'Updated ' + moment(postData?.updated_at, format).fromNow()}
                                </span>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <p className='text-center' style={{ color: 'red' }}>DON&apos;T FORGET TO CHANGE THE &quot;LAST UPDATED&quot; DATE</p>
                        <h1 className='py-4 heading-xlarge w-100 col-md-11 col-lg-12 text-center align-content-center'>{legalMdx === 'privacy-policy' ? 'Privacy Policy' : 'Imprint'}</h1>
                    </>
                )}
            </div>
            <div className="row">
                <div className="col-md-8 offset-md-2 container">
                    <MDXEditor
                        contentEditableClassName="article"
                        onChange={e => {
                            setTimeout(() => {
                                setCurrentMarkdown(e); // Update current markdown when the editor content changes
                                calculateReadingTime(e); // Update read time in real time when the editor content changes
                            }, 0);
                        }}
                        ref={editorRef}
                        markdown={currentMarkdown}
                        plugins={[
                            headingsPlugin(),
                            listsPlugin(),
                            quotePlugin(),
                            jsxPlugin({ jsxComponentDescriptors }),
                            thematicBreakPlugin(),
                            markdownShortcutPlugin(),
                            codeBlockPlugin({
                                defaultCodeBlockLanguage: '',
                            }),
                            codeMirrorPlugin({
                                codeBlockLanguages: {
                                    '': 'None',
                                    dart: 'Dart',
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
                            imagePlugin({ imageUploadHandler }),
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
                                                                <StrikeThroughSupSubToggles options={['Strikethrough']} />
                                                                <CodeToggle />
                                                                <Separator />
                                                                <ListsToggle />
                                                                <Separator />
                                                                <BlockTypeSelect />
                                                                <Separator />
                                                                <CreateLink />
                                                                <InsertImage />
                                                                <YouTubeButton />
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

            {!legalMdx && (
                <div className="container d-flex justify-content-center col-md-9" style={{ marginTop: '40rem' }}>
                    <div className="row">
                        <div className="container">
                            <h1 className="text-center py-3">Preview</h1>
                            <PostCard post={Post as PostItem} previewData={PostPreview as PostPreviewItem} authorData={selectedAuthor || authorData?.[0] || ({} as AuthorItem)} style="preview" setValue={setDescription} setPostType={setPostType} setImageFile={setImageFile} />
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
                                        <input type="text" placeholder='Coffeeman Corporation' value={sponsored_by} onChange={e => setSponsoredBy(e.target.value)} />
                                    </div>
                                    <div className='mt-3'>
                                        <label htmlFor="" className='mx-3'>Enter company&apos;s website URL (optional)</label>
                                        <input type="text" placeholder='www.yalovets.blog/' value={sponsor_url} onChange={e => setSponsorUrl(e.target.value)} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="container d-flex justify-content-center col-md-9 my-5">
                <div className="row">
                    <div className="col-12 d-flex container justify-content-center py-4">
                        <button onClick={handleSave} className="py-2 px-3 m-3 btn-filled" type="submit">
                            {legalMdx || postData ? 'Update' : 'Post'}
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
