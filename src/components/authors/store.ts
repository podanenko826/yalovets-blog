import { create } from "zustand";

import { AuthorItem } from "@/types";
import { getAuthors } from "@/lib/authors";

interface AuthorStore {
    authors: AuthorItem[];
    setAuthors: (authors: AuthorItem[]) => void;
    fetchAuthors: () => Promise<AuthorItem[]>;
}

export const useAuthorStore = create<AuthorStore>((set) => {
    const authors: AuthorItem[] = [];

    const AUTHORS_STORAGE_KEY = "cachedAuthors";
    const AUTHORS_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

    const saveAuthorsToLocalStorage = (newAuthors: AuthorItem[]) => {
        if (typeof localStorage === 'undefined') return;

        const storedData = localStorage.getItem(AUTHORS_STORAGE_KEY);
        let existingAuthors: AuthorItem[] = [];
    
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                if (parsedData.authors && Array.isArray(parsedData.authors)) {
                    if (Date.now() - parsedData.timestamp < AUTHORS_EXPIRATION_TIME) {
                        existingAuthors = parsedData.authors;
                    }
                }
            } catch (error) {
                console.error("Error parsing authors from localStorage:", error);
            }
        }
    
        // Ensure existingAuthors is always an array before calling map
        const authorMap = new Map(existingAuthors.map(author => [author.email, author]));
        newAuthors.forEach(author => authorMap.set(author.email, author));
    
        const updatedAuthors = Array.from(authorMap.values());
    
        localStorage.setItem(AUTHORS_STORAGE_KEY, JSON.stringify({
            authors: updatedAuthors,
            timestamp: Date.now(),
        }));
    };

    const loadAuthorsFromStorage = () => {
        if (typeof localStorage === 'undefined') return;

        const savedAuthors = localStorage.getItem(AUTHORS_STORAGE_KEY);
        if (savedAuthors) {
            set({ authors: JSON.parse(savedAuthors) });
        }
    };

    loadAuthorsFromStorage();

    const setAuthors = (authors: AuthorItem[]) => {
        set({ authors });
        saveAuthorsToLocalStorage(authors);
    };

    const fetchAuthors = async (): Promise<AuthorItem[]> => {
        if (authors.length === 0) {
            const authors = await getAuthors();
            setAuthors(authors);
            saveAuthorsToLocalStorage(authors);

            return authors;
        }

        return [];
    };

    return {
        authors,
        setAuthors,
        fetchAuthors
    }

});
