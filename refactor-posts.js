const fs = require('fs');

const postsPath = 'src/lib/posts.ts';
let content = fs.readFileSync(postsPath, 'utf8');

// 1. Remove getMDXContent, saveMDXContent, deleteMDXContent
content = content.replace(/export const getMDXContent[\s\S]*?};[\n\r]+/g, '');
content = content.replace(/export const saveMDXContent[\s\S]*?};[\n\r]+/g, '');
content = content.replace(/export const deleteMDXContent[\s\S]*?};[\n\r]+/g, '');

// 2. Fix createPost
content = content.replace(
    /const savedMarkdown = await saveMDXContent\(title, markdown, created_at, slug\);\s*if \(savedMarkdown\.content === '' \|\| savedMarkdown\.slug === ''\) \{\s*return \{ slug: '', markdown: '' \};\s*\}/,
    ''
);
content = content.replace(
    /await deleteMDXContent\(slug, newPost\.created_at\);/,
    ''
);
content = content.replace(
    /return \{ slug, markdown: savedMarkdown\.slug \};/g,
    'return { slug, markdown };'
);

// 3. Fix updatePost
content = content.replace(
    /const savedMarkdown = await saveMDXContent\(title, markdown, created_at, slug\);\s*if \(savedMarkdown\.content === '' \|\| savedMarkdown\.slug === ''\) \{\s*return \{ slug: '', markdown: '' \};\s*\}/,
    ''
);
// return { slug, markdown: savedMarkdown.slug }; was replaced globally above

// 4. Fix deletePost
content = content.replace(
    /const deletedPost = await deleteMDXContent\(slug, created_at\);\s*if \(\!deletedPost\.success \|\| \!deletedPost\.slug\) return '';/g,
    ''
);
content = content.replace(/return deletedPost\.slug;/g, 'return slug;');

// 5. Fix getPostsData
content = content.replace(
    /const mdxContent = await getMDXContent\(slug, postData\.created_at as string\);\s*const markdown = mdxContent\.markdown;/g,
    'const markdown = postData.content || \'\';'
);

fs.writeFileSync(postsPath, content);
console.log('Successfully refactored src/lib/posts.ts');
