// import React from 'react';
// import PostCard from '@/components/PostCard';

// const ARTICLES_PER_PAGE = 10;

// export async function generateStaticParams() {
//     const articles = getSortedArticles();
//     const pageCount = Math.ceil(articles.length / ARTICLES_PER_PAGE);

//     return Array.from({length: pageCount}, (_, i) => ({
//         page: (i + 1).toString(),
//     }));
// }

// export default async function BlogPage({params}: {params: {page: string}}) {
//     const currentPage = parseInt(params.page, 10) || 1;
//     const articles = getSortedArticles();

//     const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
//     const paginatedArticles = articles.slice(
//         startIndex,
//         startIndex + ARTICLES_PER_PAGE
//     );
//     const pageCount = Math.ceil(articles.length / ARTICLES_PER_PAGE);
//     return (
//         <main>
//             <div className="container posts" id="posts">
//                 <h1 className="heading-large mt-5">Page {currentPage}</h1>
//                 <div className="row post-list">
//                     {paginatedArticles.map(
//                         (post: ArticleItem, index: number | undefined) => (
//                             <PostCard
//                                 post={post}
//                                 style="full"
//                                 index={index}
//                                 key={index}
//                             />
//                         )
//                     )}
//                 </div>
//                 <div className="row">
//                     <div className="d-flex pagination justify-content-center">
//                         {Array.from({length: pageCount}, (_, i) => (
//                             <a
//                                 className="mb-5 mx-2"
//                                 key={i}
//                                 href={`/page/${i + 1}`}>
//                                 <button className="px-3 py-2">{i + 1}</button>
//                             </a>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// }

export default async function BlogPage() {
    return null;
}
