import fs from 'fs';
import path from 'path';

export function wrapArticles() {
    const folderPath = 'src/articles';

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    const dirPath = path.join(process.cwd(), folderPath);

    const dirContent = fs.readdirSync(dirPath);

    for (let folder of dirContent) {
        const fileName = path.join(dirPath, folder, `${folder}.mdx`);
        console.log(fileName);

        if (fileName) {
            // Write the file to the filesystem
            try {
                const wrappedDirPath = path.join(dirPath, fileName);

                // Create a folder with the same name as each article's slug
                if (!fs.existsSync(wrappedDirPath)) {
                    fs.mkdirSync(wrappedDirPath);
                }

                const sourcePath = path.join(dirPath, folder);
                const destinationPath = path.join(dirPath, fileName, folder);

                // Move the article to its dedicated folder
                fs.rename(sourcePath, destinationPath, err => {
                    if (err) {
                        console.error('Error moving the file:', err);
                    }
                });
            } catch (err) {
                console.error('Failed to wrap article in individual folder', err);
            }
        }

        console.log('Wrapping done.');
    }
}
