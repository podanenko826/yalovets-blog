import React from 'react';
import fs from 'fs';
import path from 'path';
import {CategoryItem} from '@/types';

const CategoriesPage = () => {
    const filePath = path.join(
        process.cwd(),
        'src/categories',
        `categories.json`
    );

    if (!fs.existsSync(filePath)) {
        console.error('File not found.');
    }

    const content = fs.readFileSync(filePath, 'utf8');

    console.log(JSON.parse(content));

    const parsedContent = JSON.parse(content);
    const categories: CategoryItem = parsedContent;

    return (
        <div>
            <ul>
                <p>{categories.title}</p>
            </ul>
        </div>
    );
};

export default CategoriesPage;
