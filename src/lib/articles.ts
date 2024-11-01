import mongoose from 'mongoose';

import matter from 'gray-matter';
import path from 'path';
import moment from 'moment';
import {remark} from 'remark';
import html from 'remark-html';

import {useEffect, useState} from 'react';

import type {ArticleItem} from '@/types';
import Post from '@/models/Post';

// const articlesDirectory = path.join(process.cwd(), 'src/articles');

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI!);
//         console.log('MongoDB connected to AWS Atlas');

//         const collections = await mongoose.connection.db
//             ?.listCollections()
//             .toArray();
//         const collectionExists = collections?.some(col => col.name === 'posts');

//         if (!collectionExists) {
//             console.log('Posts collection does not exist. Creating...');

//             await Post.init();
//             console.log('Indexes ensured on Post model');
//         }
//     } catch (err) {
//         console.log('Failed to connect to MongoDB Atlas: ', err);
//     }
// };

// export const getSortedArticles = (): ArticleItem[] => {
//     connectDB();
//     const [fileNames, setFileNames] = useState([]);
//     const [content, setContent] = useState({});

//     useEffect(() => {
//         const fetchFileNames = async () => {
//             try {
//                 const response = await fetch('/api/s3?key=mdx/');
//                 const data = await response.json();

//                 if (data.files && data.files.length) {
//                     const keys = data.files.map(({file}: any) => file.Key);
//                     setFileNames(keys);
//                 }
//             } catch (err) {
//                 console.error('Error fetching S3 files list: ', err);
//             }
//         };

//         fetchFileNames();
//     }, []);

//     console.log('fileNames: ', fileNames);

//     useEffect(() => {
//         const fetchContent = async () => {
//             try {
//             } catch (err) {
//                 console.error('Error fetching S3 content: ', err);
//             }
//         };

//         fetchContent();
//     }, []);
//     const allArticlesData = fileNames.map(async (post: ArticleItem) => {
//         const response = await fetch(`/api/s3?key=${post}`);
//         const fileContents = JSON.stringify(response);
//         console.log('Response: ', response);
//         console.log('fileContents: ', fileContents);

//         const matterResult = matter(fileContents);
//         console.log('MatterResult: ', matterResult);

//         return;
//     });

//     const sortedArticlesData = allArticlesData.sort((a, b) => {
//         const format = 'DD-MM-YYYY';
//         const dateOne = moment(a, format);
//         const dateTwo = moment(b.date, format);

//         if (dateOne.isBefore(dateTwo)) {
//             return -1;
//         } else if (dateTwo.isAfter(dateOne)) {
//             return 1;
//         } else {
//             return 0;
//         }
//     });

//     return sortedArticlesData.reverse();
//     return [];
// };

// export const getLatestArticle = (): ArticleItem => {
//     const sortedArticles = getSortedArticles();
//     const latestArticle: ArticleItem = sortedArticles[0];

//     return latestArticle;
// };

// export const getRecentArticles = (): ArticleItem[] => {
//     const reversedSortedArticles = getSortedArticles();

//     return reversedSortedArticles.slice(0, 9);
// };

export const getArticleData = async (
    slug: string
): Promise<{slug: string; contentHtml: string | TrustedHTML}> => {
    try {
        const baseUrl =
            typeof window === 'undefined'
                ? process.env.NEXT_PUBLIC_API_BASE_URL ||
                  'http://localhost:3000'
                : '';

        const response = await fetch(`${baseUrl}/api/s3?key=mdx/${slug}.mdx`);

        const data = await response.json();

        const fileContent = data.content.toString('utf-8');

        if (!fileContent) {
            console.error('No content found for the given key.');
            return {slug, contentHtml: ''};
        }

        const matterResult = matter(fileContent);

        const processedContent = await remark()
            .use(html)
            .process(matterResult.content);

        const contentHtml = processedContent.toString();

        return {
            slug,
            contentHtml,
            // title: matterResult.data.title,
            // description: matterResult.data.description,
            // imageUrl: matterResult.data.imageUrl,
            // date: moment(matterResult.data.date, 'DD-MM-YYYY').format(
            //     'DD MMM YYYY'
            // ),
            // authorName: matterResult.data.authorName,
            // readTime: matterResult.data.readTime,
        };
    } catch (err) {
        console.error('Failed to fetch post from server: ', err);
        return {slug, contentHtml: ''};
    }
};
