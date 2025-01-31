import { PaginationEntry } from '@/types';
import fs from 'fs';
import { NextRequest } from 'next/server';
import path from 'path';

export async function GET(request: Request) {
    try {
        const dirPath = 'src/pagination';

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        const filePath = path.join(process.cwd(), dirPath, 'pagination.json');

        const content = fs.readFileSync(filePath, 'utf8');
        if (!content) return new Response('No pagination found', { status: 404 });

        const data = JSON.parse(content);
        // if (!data || !Array.isArray(data)) {
        //     return new Response('Invalid pagination structure', { status: 500 });
        // }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'text/json',
            },
        });
    } catch (err) {
        console.error('Failed to get tags:', err);
        return new Response('Failed to get the tags', { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const paginationData: Record<number, PaginationEntry> = await request.json();

        const dirPath = 'src/pagination';
        const filePath = path.join(process.cwd(), dirPath, 'pagination.json');

        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        if (Object.keys(paginationData).length > 0) {
            // Write the updated data to the file
            try {
                const updatedData = JSON.stringify(paginationData, null, 4);
                fs.writeFileSync(filePath, updatedData, 'utf-8');
            } catch (err) {
                console.error('Failed to write to JSON file:', err);
                return new Response('Failed to save the tag', { status: 500 });
            }

            return new Response(JSON.stringify(paginationData), { status: 201 });
        } else {
            return new Response('Invalid input', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to write to JSON file:', err);
        return new Response('Failed to create the tag', { status: 500 });
    }
}