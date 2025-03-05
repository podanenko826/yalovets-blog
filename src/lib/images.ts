export const uploadImage = async (formData: FormData, year: string, month: string): Promise<{
    originalName: string,
    extension: string,
    filePath: string,
    size: number,
    mimetype: string,
}> => {
    try {
        if (!formData) {
            return { originalName: '', extension: '', filePath: '', size: 0, mimetype: '' };
        }
        
        const response = await fetch(`/api/image?year=${year}&month=${month}`, {
            method: 'POST',
            body: formData,
        })
        if (!response.ok) {
            console.error('Failed to upload the image');
            return { originalName: '', extension: '', filePath: '', size: 0, mimetype: '' };
        }
    
        const { originalName, extension, filePath, size, mimetype } = await response.json();
        return { originalName, extension, filePath, size, mimetype };
    } catch (err) {
        console.error('Failed to upload the image: ', err);
        return { originalName: '', extension: '', filePath: '', size: 0, mimetype: '' };
    }
}