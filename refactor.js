const fs = require('fs');
const path = require('path');

const replacements = {
    'imageUrl': 'image_url',
    'postType': 'post_type',
    'readTime': 'read_time',
    'viewsCount': 'views_count',
    'sponsoredBy': 'sponsored_by',
    'sponsorUrl': 'sponsor_url',
    'fullName': 'full_name',
    'profileImageUrl': 'avatar_url',
    'socialLinks': 'social_links',
    'purchaseLinks': 'purchase_links',
    'subscribedAt': 'subscribed_at',
    // Mappings removals
    'mapPostToCamelCase(post)': 'post',
    'mapAuthorToCamelCase(author)': 'author',
    '.map(mapPostToCamelCase)': '',
    "import { mapPostToCamelCase } from '@/lib/mappings';": "",
    "import { mapAuthorToCamelCase } from '@/lib/mappings';": "",
    "import { mapPostToCamelCase, mapAuthorToCamelCase } from '@/lib/mappings';": ""
};

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function(filePath) {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.css')) return;
    
    let originalContent = fs.readFileSync(filePath, 'utf8');
    let newContent = originalContent;
    
    for (const [key, value] of Object.entries(replacements)) {
        // Simple replace all using split/join or RegExp
        if (key.includes('import')) {
            newContent = newContent.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\n?', 'g'), '');
        } else if (key === '.map(mapPostToCamelCase)') {
            newContent = newContent.split(key).join(value);
        } else if (key.includes('(')) {
            newContent = newContent.split(key).join(value);
        } else {
            // For word boundaries, use RegExp to avoid partial matches
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            newContent = newContent.replace(regex, value);
        }
    }
    
    // Additional cleanup for leftover maps if any
    newContent = newContent.split('mapPostToCamelCase').join('');
    newContent = newContent.split('mapAuthorToCamelCase').join('');
    
    // Remove any empty imports leftover from mapped ones
    newContent = newContent.replace(/import\s*{\s*}\s*from\s*'@\/lib\/mappings';\n?/g, '');

    if (originalContent !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated: ${filePath}`);
    }
});
