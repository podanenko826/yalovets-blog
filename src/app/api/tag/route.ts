import { TagItem } from '@/types';
import fs from 'fs';
import { NextRequest } from 'next/server';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tag = searchParams.get('tag');

        const dirPath = 'src/tags';

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        const filePath = path.join(process.cwd(), dirPath, 'tags.json');

        const content = fs.readFileSync(filePath, 'utf8');
        if (!content) return new Response('No tags found', { status: 404 });

        const data = JSON.parse(content);
        if (!data.tags || !Array.isArray(data.tags)) {
            return new Response('Invalid tags structure', { status: 500 });
        }

        if (tag) {
            const selectedTag = data.tags.find((t: { tag: string }) => t.tag === tag);

            if (!selectedTag) return new Response('Tag not found', { status: 404 });

            return new Response(JSON.stringify({ content: selectedTag }), {
                status: 200,
                headers: {
                    'Content-Type': 'text/json',
                },
            });
        }

        return new Response(JSON.stringify({ content: data.tags }), {
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

export async function POST(request: Request) {
    try {
        const { tag, title, description } = await request.json();

        const dirPath = 'src/tags';
        const filePath = path.join(process.cwd(), dirPath, 'tags.json');

        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        if (tag && title && description) {
            // Format the tag slug
            const formattedTag = `${tag
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .replaceAll(' ', '-')
                .toLowerCase()}`;

            let tagsData: Array<{ id: number; tag: string; title: string; description: string; postCount: number }> = [];

            // Read and validate the JSON file
            if (fs.existsSync(filePath)) {
                try {
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const parsedData = JSON.parse(fileContent);

                    // Validate that parsedData.tags exists and is an array
                    if (Array.isArray(parsedData.tags)) {
                        tagsData = parsedData.tags;
                    } else {
                        console.error('tags.json does not contain a "tags" array.');
                        return new Response('Invalid JSON structure', { status: 500 });
                    }
                } catch (err) {
                    console.error('Failed to parse JSON file:', err);
                    return new Response('Failed to read JSON file', { status: 500 });
                }
            }

            // Determine the next ID
            const nextId = tagsData.length > 0 ? Math.max(...tagsData.map((tag: { id: number }) => tag.id)) + 1 : 1;

            // Create the new tag object
            const newTag = {
                id: nextId,
                tag: formattedTag,
                title,
                description,
                postCount: 0,
            };

            // Add the new tag to the data
            tagsData.push(newTag);

            // Write the updated data back to the file
            try {
                const updatedData = JSON.stringify({ tags: tagsData }, null, 4);
                fs.writeFileSync(filePath, updatedData, 'utf-8');
            } catch (err) {
                console.error('Failed to write to JSON file:', err);
                return new Response('Failed to save the tag', { status: 500 });
            }

            return new Response(JSON.stringify(newTag), { status: 201 });
        } else {
            return new Response('Invalid input', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to write to JSON file:', err);
        return new Response('Failed to create the tag', { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, tag, title, description, postCount } = await request.json();

        const dirPath = 'src/tags';
        const filePath = path.join(process.cwd(), dirPath, 'tags.json');

        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        if (tag && title && description) {
            // Format the tag slug
            const formattedTag = `${tag
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .replaceAll(' ', '-')
                .toLowerCase()}`;

            let tagsData: Array<{ id: number; tag: string; title: string; description: string; postCount: number }> = [];

            // Read and validate the JSON file
            if (fs.existsSync(filePath)) {
                try {
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const parsedData = JSON.parse(fileContent);

                    // Validate that parsedData.tags exists and is an array
                    if (Array.isArray(parsedData.tags)) {
                        tagsData = parsedData.tags;
                    } else {
                        console.error('tags.json does not contain a "tags" array.');
                        return new Response('Invalid JSON structure', { status: 500 });
                    }
                } catch (err) {
                    console.error('Failed to parse JSON file:', err);
                    return new Response('Failed to read JSON file', { status: 500 });
                }
            }

            // Create the new tag object
            const newTag = {
                id,
                tag: formattedTag,
                title,
                description,
                postCount,
            };

            // Updates a chosen tag to a new one if IDs match
            const updatedTags = tagsData.map(tag => (tag.id === id ? newTag : tag));

            // Write the updated data back to the file
            try {
                const updatedData = JSON.stringify({ tags: updatedTags }, null, 4);
                fs.writeFileSync(filePath, updatedData, 'utf-8');
            } catch (err) {
                console.error('Failed to write to JSON file:', err);
                return new Response('Failed to save the tag', { status: 500 });
            }

            return new Response(JSON.stringify(newTag), { status: 201 });
        } else {
            return new Response('Invalid input', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to write to JSON file:', err);
        return new Response('Failed to create the tag', { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();

        const id = body;
        const dirPath = 'src/tags';
        const filePath = path.join(process.cwd(), dirPath, 'tags.json');

        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        if (id) {
            let tagsData: Array<{ id: number; tag: string; title: string; description: string; postCount: number }> = [];

            // Read and validate the JSON file
            if (fs.existsSync(filePath)) {
                try {
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const parsedData = JSON.parse(fileContent);

                    // Validate that parsedData.tags exists and is an array
                    if (Array.isArray(parsedData.tags)) {
                        tagsData = parsedData.tags;
                    } else {
                        console.error('tags.json does not contain a "tags" array.');
                        return new Response('Invalid JSON structure', { status: 500 });
                    }
                } catch (err) {
                    console.error('Failed to parse JSON file:', err);
                    return new Response('Failed to read JSON file', { status: 500 });
                }
            }

            const deletedTag = tagsData.filter(tag => tag.id === id);

            // Remove the chosen tag from the data
            tagsData = tagsData.filter(tag => tag.id !== id);

            // Write the updated data back to the file
            try {
                const updatedData = JSON.stringify({ tags: tagsData }, null, 4);
                fs.writeFileSync(filePath, updatedData, 'utf-8');
            } catch (err) {
                console.error('Failed to write to JSON file:', err);
                return new Response('Failed to delete the tag', { status: 500 });
            }

            return new Response(JSON.stringify(deletedTag), { status: 201 });
        } else {
            return new Response('Invalid input', { status: 400 });
        }
    } catch (err) {
        console.error('Failed to write to JSON file:', err);
        return new Response('Failed to delete the tag', { status: 500 });
    }
}
