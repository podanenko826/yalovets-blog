import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import moment from 'moment';
import {remark} from 'remark';
import html from 'remark-html';

import type {ArticleItem} from '@/types';

const articlesDirectory = path.join(process.cwd(), 'src/articles');

export const getSortedArticles = (): ArticleItem[] => {
    const fileNames = fs.readdirSync(articlesDirectory);

    const allArticlesData = fileNames.map(fileName => {
        const id = fileName.replace(/\.mdx$/, '');

        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf-8');
        const matterResult = matter(fileContents);

        return {
            id,
            title: matterResult.data.title,
            description: matterResult.data.description,
            imageUrl: matterResult.data.imageUrl,
            date: matterResult.data.date,
            authorName: matterResult.data.authorName,
            readTime: matterResult.data.readTime,
        };
    });

    const sortedArticlesData = allArticlesData.sort((a, b) => {
        const format = 'DD-MM-YYYY';
        const dateOne = moment(a.date, format);
        const dateTwo = moment(b.date, format);

        if (dateOne.isBefore(dateTwo)) {
            return -1;
        } else if (dateTwo.isAfter(dateOne)) {
            return 1;
        } else {
            return 0;
        }
    });

    return sortedArticlesData.reverse();
};

export const getLatestArticle = (): ArticleItem => {
    const sortedArticles = getSortedArticles();
    const latestArticle: ArticleItem = sortedArticles[0];

    return latestArticle;
};

export const getRecentArticles = (): ArticleItem[] => {
    const reversedSortedArticles = getSortedArticles();

    return reversedSortedArticles.slice(0, 9);
};

export const getArticleData = async (id: string) => {
    const fullPath = path.join(articlesDirectory, `${id}.mdx`);

    const fileContents = fs.readFileSync(fullPath, 'utf-8');

    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        title: matterResult.data.title,
        description: matterResult.data.description,
        imageUrl: matterResult.data.imageUrl,
        date: moment(matterResult.data.date, 'DD-MM-YYYY').format(
            'DD MMM YYYY'
        ),
        authorName: matterResult.data.authorName,
        readTime: matterResult.data.readTime,
    };
};
