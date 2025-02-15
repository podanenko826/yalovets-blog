// 'use client';
// import React, { Suspense, lazy, useEffect, useState } from 'react';

// import { TagItem } from '@/types';

// import { usePostContext } from '@/components/Context/PostDataContext';
// import { useModalContext } from '@/components/Context/ModalContext';
// import { getTagData, getTagsData } from '@/lib/tags';
// import { notFound, usePathname } from 'next/navigation';
// import PostList from '@/components/PostCard/PostList';

// const PostPreviewModal = lazy(() => import('@/components/Modals/PostPreviewModal'));
// const ArticleModal = lazy(() => import('@/components/Modals/ArticleModal'));

// export default function TagPage({ params }: { params: { tag: string } }) {
//     const { posts, setPosts } = usePostContext();
//     const { authors, setAuthors } = usePostContext();
//     const { tags, setTags } = usePostContext();
//     const { selectedPost } = useModalContext();
//     const { fetchPosts } = usePostContext();

//     const [tagData, setTagData] = useState<TagItem | null>(null);

//     const currentPath = usePathname() + '/';
//     const slug = currentPath.split('/').pop();

//     const ARTICLES_PER_PAGE = 28;

//     useEffect(() => {
//         if (!selectedPost && typeof document !== 'undefined') {
//             document.title = `#${params.tag} / Yalovets Blog`;
//         }
//     }, [selectedPost]);

//     useEffect(() => {
//         if (ARTICLES_PER_PAGE) {
//             fetchPosts(ARTICLES_PER_PAGE);
//         }
//     }, [ARTICLES_PER_PAGE]);

//     useEffect(() => {
//         const getTag = async () => {
//             let _tagData;

//             const targetTag = tags.find(tag => tag.tag === params.tag);

//             if (targetTag) {
//                 _tagData = { content: targetTag };
//             } else {
//                 _tagData = await getTagData(params.tag);

//                 if (_tagData) {
//                     setTags([...tags, _tagData.content]);
//                 }
//             }

//             if (!_tagData) return notFound();

//             setTagData(_tagData.content);
//         };

//         getTag();
//     }, [params.tag]);

//     // //? Fulfills tags data when the first post is loaded
//     // useEffect(() => {
//     //     const getTags = async () => {
//     //         if (selectedPost && tags.length === 0) {
//     //             const _tags = await getTagsData();

//     //             if (_tags.length > 0) setTags(_tags);
//     //         }
//     //     };

//     //     getTags();
//     // }, [selectedPost, tags]);

//     return (
//         <>
//             <Suspense fallback={<div></div>}>
//                 <PostPreviewModal />
//                 <ArticleModal selectedPost={selectedPost!} slug={slug || ''} />
//             </Suspense>
//             {tagData && (
//                 <main id="body">
//                     <div className="container posts" id="posts">
//                         <h1 className="heading heading-large mt-5">
//                             #{tagData?.tag} | {tagData.title}
//                         </h1>
//                         <p className="subheading-smaller py-3" id="col-heading-2">
//                             {tagData.description}
//                         </p>

//                         <div className="row post-list">
//                             <PostList displayMode="linear" limit={28} style="full" postsData={posts} infiniteScroll />
//                         </div>
//                     </div>
//                 </main>
//             )}
//         </>
//     );
// }
